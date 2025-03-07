#!/usr/bin/env node

/**
 * Proto file generation script for Jackpot Bootstrap Monorepo
 * 
 * This script generates TypeScript interfaces from proto files for a specific service.
 * It uses protobufjs and grpc-tools to generate the necessary files.
 * 
 * Usage: bun run generate-proto.js <service-name>
 * Example: bun run generate-proto.js scheduler
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Get the service name from command line arguments
const serviceName = process.argv[2];

if (!serviceName) {
  console.error('Error: Service name is required');
  console.error('Usage: bun run generate-proto.js <service-name>');
  process.exit(1);
}

// Define paths
const rootDir = path.resolve(__dirname, '..');
const protosDir = path.join(rootDir, 'protos');
const serviceDir = path.join(rootDir, 'apps', serviceName);
const outputDir = path.join(serviceDir, 'src', 'proto');

// Check if service directory exists
if (!fs.existsSync(serviceDir)) {
  console.error(`Error: Service directory not found: ${serviceDir}`);
  process.exit(1);
}

// Check if protos directory exists
if (!fs.existsSync(protosDir)) {
  console.error(`Error: Protos directory not found: ${protosDir}`);
  process.exit(1);
}

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`Created output directory: ${outputDir}`);
}

// Get all proto files
const protoFiles = fs.readdirSync(protosDir)
  .filter(file => file.endsWith('.proto'))
  .map(file => path.join(protosDir, file));

if (protoFiles.length === 0) {
  console.error(`Error: No proto files found in ${protosDir}`);
  process.exit(1);
}

console.log(`Generating TypeScript interfaces for ${serviceName} service...`);
console.log(`Found ${protoFiles.length} proto files: ${protoFiles.map(f => path.basename(f)).join(', ')}`);

try {
  // Install required packages if not already installed
  const requiredPackages = [
    'protobufjs',
    'protobufjs-cli',
    '@grpc/proto-loader',
    '@grpc/grpc-js'
  ];
  
  console.log('Checking for required packages...');
  for (const pkg of requiredPackages) {
    try {
      require.resolve(pkg);
    } catch (e) {
      console.log(`Installing ${pkg}...`);
      execSync(`bun add -D ${pkg}`, { cwd: rootDir, stdio: 'inherit' });
    }
  }

  // Generate TypeScript interfaces for each proto file
  for (const protoFile of protoFiles) {
    const fileName = path.basename(protoFile, '.proto');
    const outputFile = path.join(outputDir, `${fileName}.ts`);
    
    console.log(`Generating TypeScript interfaces for ${fileName}.proto...`);
    
    // Use protobufjs to generate TypeScript interfaces
    execSync(
      `npx pbjs -t static-module -w es6 -o ${outputDir}/${fileName}.js ${protoFile}`,
      { cwd: rootDir, stdio: 'inherit' }
    );
    
    execSync(
      `npx pbts -o ${outputDir}/${fileName}.d.ts ${outputDir}/${fileName}.js`,
      { cwd: rootDir, stdio: 'inherit' }
    );
    
    console.log(`Generated ${outputFile}`);
  }

  // Generate index.ts file to export all interfaces
  const indexContent = protoFiles
    .map(file => {
      const fileName = path.basename(file, '.proto');
      return `export * from './${fileName}';`;
    })
    .join('\n');

  fs.writeFileSync(path.join(outputDir, 'index.ts'), indexContent);
  console.log(`Generated ${path.join(outputDir, 'index.ts')}`);

  console.log('Proto generation completed successfully!');
} catch (error) {
  console.error('Error generating proto files:', error.message);
  process.exit(1);
}
