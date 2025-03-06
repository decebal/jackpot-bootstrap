#!/usr/bin/env bun

/**
 * Setup Dependencies Script
 * 
 * This script ensures all required modules and dependencies are properly set up
 * for each microservice before running the application.
 * 
 * It creates necessary modules, updates imports, and ensures configurations
 * are properly set up.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..')

// Service names
const SERVICES = ['admin', 'metrics', 'scheduler', 'gateway', 'engine']

/**
 * Setup Redis module for admin service
 */
function setupAdminRedisModule() {
  const redisModulePath = path.join(rootDir, 'apps/admin/src/infrastructure/redis')
  const redisModuleFile = path.join(redisModulePath, 'redis.module.ts')
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(redisModulePath)) {
    fs.mkdirSync(redisModulePath, { recursive: true })
    console.log('✅ Created Redis module directory for admin service')
  }
  
  // Create Redis module if it doesn't exist
  if (!fs.existsSync(redisModuleFile)) {
    const redisModuleContent = `import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import Redis, { RedisOptions } from 'ioredis'

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const redisHost = configService.get<string>('REDIS_HOST', 'localhost')
        const redisPort = configService.get<number>('REDIS_PORT', 6379)
        const redisPassword = configService.get<string>('REDIS_PASSWORD', '')
        const redisPrefix = configService.get<string>('REDIS_PREFIX', 'admin:')
        
        const options: RedisOptions = {
          host: redisHost,
          port: redisPort,
          keyPrefix: redisPrefix,
        }
        
        if (redisPassword) {
          options.password = redisPassword
        }
        
        return new Redis(options)
      },
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}`
    
    fs.writeFileSync(redisModuleFile, redisModuleContent)
    console.log('✅ Created Redis module for admin service')
  }
  
  // Update health module to import Redis module
  const healthModulePath = path.join(rootDir, 'apps/admin/src/health/health.module.ts')
  if (fs.existsSync(healthModulePath)) {
    let healthModuleContent = fs.readFileSync(healthModulePath, 'utf8')
    
    // Check if RedisModule is already imported
    if (!healthModuleContent.includes('RedisModule')) {
      // Add import statement
      healthModuleContent = healthModuleContent.replace(
        "import { TypeOrmModule } from '@nestjs/typeorm'",
        "import { TypeOrmModule } from '@nestjs/typeorm'\nimport { RedisModule } from '../infrastructure/redis/redis.module'"
      )
      
      // Add to imports array
      healthModuleContent = healthModuleContent.replace(
        "imports: [\n\t\tTerminusModule,\n\t\tHttpModule,\n\t\tTypeOrmModule",
        "imports: [\n\t\tTerminusModule,\n\t\tHttpModule,\n\t\tTypeOrmModule,\n\t\tRedisModule"
      )
      
      fs.writeFileSync(healthModulePath, healthModuleContent)
      console.log('✅ Updated health module to import Redis module')
    }
  }
}

/**
 * Setup gRPC module for scheduler service
 */
function setupSchedulerGrpcModule() {
  const grpcModulePath = path.join(rootDir, 'apps/scheduler/src/infrastructure/grpc')
  const grpcModuleFile = path.join(grpcModulePath, 'grpc.module.ts')
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(grpcModulePath)) {
    fs.mkdirSync(grpcModulePath, { recursive: true })
    console.log('✅ Created gRPC module directory for scheduler service')
  }
  
  // Create gRPC module if it doesn't exist
  if (!fs.existsSync(grpcModuleFile)) {
    const grpcModuleContent = `import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { join } from 'path'

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'METRICS_PACKAGE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: configService.get<string>('METRICS_SERVICE_URL'),
            package: 'metrics',
            protoPath: join(__dirname, '../../../../../protos/metrics.proto'),
            loader: {
              keepCase: true,
              longs: String,
              enums: String,
              defaults: true,
              oneofs: true,
            },
          },
        }),
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class GrpcModule {}`
    
    fs.writeFileSync(grpcModuleFile, grpcModuleContent)
    console.log('✅ Created gRPC module for scheduler service')
  }
  
  // Update scheduler domain module to import gRPC module
  const domainModulePath = path.join(rootDir, 'apps/scheduler/src/domain/scheduler-domain.module.ts')
  if (fs.existsSync(domainModulePath)) {
    let domainModuleContent = fs.readFileSync(domainModulePath, 'utf8')
    
    // Check if GrpcModule is already imported
    if (!domainModuleContent.includes('GrpcModule')) {
      // Add import statement
      domainModuleContent = domainModuleContent.replace(
        "import { SchedulerInfrastructureModule } from '../infrastructure/scheduler-infrastructure.module'",
        "import { SchedulerInfrastructureModule } from '../infrastructure/scheduler-infrastructure.module'\nimport { GrpcModule } from '../infrastructure/grpc/grpc.module'"
      )
      
      // Add to imports array
      domainModuleContent = domainModuleContent.replace(
        "imports: [SchedulerInfrastructureModule]",
        "imports: [SchedulerInfrastructureModule, GrpcModule]"
      )
      
      fs.writeFileSync(domainModulePath, domainModuleContent)
      console.log('✅ Updated scheduler domain module to import gRPC module')
    }
  }
  
  // Update scheduler module to import infrastructure module
  const schedulerModulePath = path.join(rootDir, 'apps/scheduler/src/scheduler.module.ts')
  if (fs.existsSync(schedulerModulePath)) {
    let schedulerModuleContent = fs.readFileSync(schedulerModulePath, 'utf8')
    
    // Check if SchedulerInfrastructureModule is already imported
    if (!schedulerModuleContent.includes('import { SchedulerInfrastructureModule }')) {
      // Add import statement
      schedulerModuleContent = schedulerModuleContent.replace(
        "import { SchedulerDomainModule } from './domain/scheduler-domain.module'",
        "import { SchedulerDomainModule } from './domain/scheduler-domain.module'\nimport { SchedulerInfrastructureModule } from './infrastructure/scheduler-infrastructure.module'"
      )
      
      // Add to imports array
      schedulerModuleContent = schedulerModuleContent.replace(
        "// Domain modules\n\t\tSchedulerDomainModule,\n\t\t\n\t\t// Health module",
        "// Domain modules\n\t\tSchedulerDomainModule,\n\t\t\n\t\t// Infrastructure module\n\t\tSchedulerInfrastructureModule,\n\t\t\n\t\t// Health module"
      )
      
      fs.writeFileSync(schedulerModulePath, schedulerModuleContent)
      console.log('✅ Updated scheduler module to import infrastructure module')
    }
  }
}

/**
 * Fix proto file paths in all services
 */
function fixProtoFilePaths() {
  console.log('\n🔧 Fixing proto file paths in all services...')
  
  // Find all files that might reference proto files
  const files = [
    // Admin service
    path.join(rootDir, 'apps/admin/src/admin.module.ts'),
    path.join(rootDir, 'apps/admin/src/main.ts'),
    // Scheduler service
    path.join(rootDir, 'apps/scheduler/src/scheduler.module.ts'),
    path.join(rootDir, 'apps/scheduler/src/main.ts'),
    path.join(rootDir, 'apps/scheduler/src/infrastructure/grpc/grpc.module.ts'),
    // Other services (add as needed)
    path.join(rootDir, 'apps/metrics/src/main.ts'),
    path.join(rootDir, 'apps/gateway/src/main.ts'),
    path.join(rootDir, 'apps/engine/src/main.ts')
  ]
  
  // Process each file
  files.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8')
      
      // Fix incorrect proto paths
      if (content.includes("protoPath: join(__dirname, '../../protos/")) {
        content = content.replace(
          /protoPath: join\(__dirname, '\.\.\/\.\.\/protos\//g,
          "protoPath: join(__dirname, '../../../protos/"
        )
        fs.writeFileSync(filePath, content)
        console.log(`✅ Fixed proto path in ${path.relative(rootDir, filePath)}`)
      }
      
      // Fix incorrect proto paths in infrastructure modules
      if (content.includes("protoPath: join(__dirname, '../../../../protos/")) {
        content = content.replace(
          /protoPath: join\(__dirname, '\.\.\/\.\.\/\.\.\/\.\.\/protos\//g,
          "protoPath: join(__dirname, '../../../../../protos/"
        )
        fs.writeFileSync(filePath, content)
        console.log(`✅ Fixed proto path in ${path.relative(rootDir, filePath)}`)
      }
    }
  })
}

/**
 * Main function
 */
function main() {
  console.log('🔧 Setting up dependencies for microservices')
  console.log('===========================================')
  
  // Setup Redis module for admin service
  console.log('\n📦 Setting up Redis module for admin service...')
  setupAdminRedisModule()
  
  // Setup gRPC module for scheduler service
  console.log('\n📦 Setting up gRPC module for scheduler service...')
  setupSchedulerGrpcModule()
  
  // Fix proto file paths
  fixProtoFilePaths()
  
  console.log('\n✅ All dependencies set up successfully')
}

// Run the main function
main()
