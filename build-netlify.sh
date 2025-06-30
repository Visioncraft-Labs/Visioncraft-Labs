#!/bin/bash
set -e

echo "Building VisionCraft Labs for Netlify deployment..."

# Build the client application from project root (where vite.config.ts is)
echo "Building client application..."
npx vite build

# Build the server application
echo "Building server application..."
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

echo "Build completed successfully!"
echo "Client files: dist/public/"
echo "Server files: dist/"