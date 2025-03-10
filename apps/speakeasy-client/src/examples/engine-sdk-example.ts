/**
 * Example usage of the Jackpot Engine gRPC SDK
 */
import { EngineClient, EngineClientError } from '../index'

// Load environment variables (in a real app, use dotenv or similar)
const ENGINE_HOST = process.env['ENGINE_HOST'] || 'localhost'
const ENGINE_PORT = parseInt(process.env['ENGINE_PORT'] || '50051', 10)
const ENGINE_API_KEY = process.env['ENGINE_API_KEY'] || 'test-api-key'

async function main() {
  console.log('Initializing Engine SDK client...')
  
  // Create a client instance
  const client = new EngineClient({
    host: ENGINE_HOST,
    port: ENGINE_PORT,
    apiKey: ENGINE_API_KEY,
    secure: false, // Set to true for production
    timeout: 30000
  })

  try {
    // Example 1: Process a simple request
    console.log('\n--- Example 1: Processing a simple request ---')
    const simpleResponse = await client.process(
      'text-processing',
      'This is a sample text to process',
      {
        priority: 5,
        timeout: 60
      },
      {
        'source': 'example-client'
      }
    )
    console.log('Request processed successfully:')
    console.log(`  ID: ${simpleResponse.id}`)
    console.log(`  Status: ${simpleResponse.status}`)
    console.log(`  Success: ${simpleResponse.success}`)
    
    // Example 2: Check status of a request
    console.log('\n--- Example 2: Checking request status ---')
    const statusResponse = await client.getStatus(simpleResponse.id)
    console.log('Status retrieved:')
    console.log(`  Status: ${statusResponse.status}`)
    console.log(`  Processing time: ${statusResponse.metrics?.processing_time_ms}ms`)
    
    // Example 3: Get engine status
    console.log('\n--- Example 3: Getting engine status ---')
    const engineStatus = await client.getEngineStatus()
    if (engineStatus.success && engineStatus.status) {
      console.log('Engine status:')
      console.log(`  Version: ${engineStatus.status.version}`)
      console.log(`  Status: ${engineStatus.status.status}`)
      console.log(`  Active requests: ${engineStatus.status.active_requests}`)
      console.log(`  CPU usage: ${engineStatus.status.resources?.cpu_usage_percent}%`)
    } else {
      console.log('Failed to get engine status:', engineStatus.error)
    }
    
    // Example 4: Error handling demonstration
    console.log('\n--- Example 4: Error handling demonstration ---')
    try {
      // Intentionally use an invalid request ID to trigger an error
      await client.getStatus('invalid-request-id')
    } catch (error) {
      if (error instanceof EngineClientError) {
        console.log('Caught gRPC error:')
        console.log(`  Code: ${error.code}`)
        console.log(`  Message: ${error.message}`)
        console.log(`  Details: ${error.details}`)
      } else {
        console.log('Caught non-gRPC error:', error)
      }
    }

  } catch (error) {
    console.error('Unexpected error:', error)
  } finally {
    // Always close the client when done
    console.log('\nClosing client connection...')
    client.close()
  }
}

// Run the example
main().catch(console.error)
