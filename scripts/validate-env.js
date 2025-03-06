#!/usr/bin/env bun

/**
 * Environment Variable Validation Script
 * 
 * This script validates that all required environment variables are present
 * for a specific service or for the root configuration.
 * 
 * Usage:
 *   bun run scripts/validate-env.js [service-name]
 * 
 * If service-name is provided, it validates that service's .env file.
 * If no service-name is provided, it validates the root .env file.
 */

import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

// Service names
const SERVICES = ['admin', 'metrics', 'scheduler', 'gateway', 'engine'];

// Required variables by service
const REQUIRED_VARS = {
  root: [
    'NODE_ENV',
  ],
  admin: [
    'SERVICE_NAME',
    'HTTP_PORT',
    'HTTP_HOST',
    'GRPC_PORT',
    'GRPC_HOST',
    'DATABASE_HOST',
    'DATABASE_PORT',
    'DATABASE_USERNAME',
    'DATABASE_PASSWORD',
    'DATABASE_NAME',
  ],
  metrics: [
    'SERVICE_NAME',
    'HTTP_PORT',
    'HTTP_HOST',
    'GRPC_PORT',
    'GRPC_HOST',
    'DATABASE_HOST',
    'DATABASE_PORT',
    'DATABASE_USERNAME',
    'DATABASE_PASSWORD',
    'DATABASE_NAME',
  ],
  scheduler: [
    'SERVICE_NAME',
    'HTTP_PORT',
    'HTTP_HOST',
    'GRPC_PORT',
    'GRPC_HOST',
    'DATABASE_HOST',
    'DATABASE_PORT',
    'DATABASE_USERNAME',
    'DATABASE_PASSWORD',
    'DATABASE_NAME',
  ],
  gateway: [
    'SERVICE_NAME',
    'HTTP_PORT',
    'HTTP_HOST',
    'ADMIN_SERVICE_URL',
    'METRICS_SERVICE_URL',
    'SCHEDULER_SERVICE_URL',
    'ENGINE_SERVICE_URL',
  ],
  engine: [
    'SERVICE_NAME',
    'HTTP_PORT',
    'HTTP_HOST',
    'GRPC_PORT',
    'GRPC_HOST',
    'DATABASE_HOST',
    'DATABASE_PORT',
    'DATABASE_USERNAME',
    'DATABASE_PASSWORD',
    'DATABASE_NAME',
  ],
};

/**
 * Validates environment variables for a specific service or root
 * @param {string} serviceName - The name of the service to validate, or 'root' for root config
 * @returns {boolean} - True if all required variables are present, false otherwise
 */
function validateEnv(serviceName) {
  let envPath;
  
  if (serviceName === 'root') {
    envPath = path.join(rootDir, '.env');
  } else {
    envPath = path.join(rootDir, 'apps', serviceName, '.env');
  }
  
  // Check if .env file exists
  if (!fs.existsSync(envPath)) {
    console.error(`❌ Error: .env file not found at ${envPath}`);
    console.error(`   Run './setup-dev-env.sh' to create .env files from templates.`);
    return false;
  }
  
  // Load environment variables from .env file
  const envConfig = dotenv.parse(fs.readFileSync(envPath));
  
  // Get required variables for this service
  const requiredVars = REQUIRED_VARS[serviceName];
  
  // Check if all required variables are present
  const missingVars = requiredVars.filter(varName => !envConfig[varName]);
  
  if (missingVars.length > 0) {
    console.error(`❌ Error: Missing required environment variables in ${envPath}:`);
    missingVars.forEach(varName => {
      console.error(`   - ${varName}`);
    });
    return false;
  }
  
  console.log(`✅ Environment validation passed for ${serviceName}`);
  return true;
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);
  const serviceName = args[0] || 'root';
  
  if (serviceName !== 'root' && !SERVICES.includes(serviceName)) {
    console.error(`❌ Error: Unknown service '${serviceName}'`);
    console.error(`   Available services: ${SERVICES.join(', ')}`);
    process.exit(1);
  }
  
  const isValid = validateEnv(serviceName);
  
  if (!isValid) {
    process.exit(1);
  }
  
  process.exit(0);
}

// Run the main function
main();
