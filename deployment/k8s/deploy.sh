#!/bin/bash

# Exit on error
set -e

# Set default environment
ENV=${1:-dev}
VERSION=${2:-latest}

# Validate environment
if [[ "$ENV" != "dev" && "$ENV" != "staging" && "$ENV" != "prod" ]]; then
    echo "Environment must be one of: dev, staging, prod"
    exit 1
fi

# Validate version
if [[ -z "$VERSION" ]]; then
    echo "Version is required"
    exit 1
fi

# Set up kustomize
KUSTOMIZE_DIR="overlays/$ENV"

# Log information
echo "Deploying to $ENV environment with version $VERSION"

# Update version in kustomization.yaml
sed -i'.bak' -e "s/\${VERSION}/$VERSION/g" base/kustomization.yaml
rm -f base/kustomization.yaml.bak

# Apply kustomization
kubectl apply -k $KUSTOMIZE_DIR

# Reset version in kustomization.yaml
sed -i'.bak' -e "s/$VERSION/\${VERSION}/g" base/kustomization.yaml
rm -f base/kustomization.yaml.bak

# Build and push CMS Docker image
if [[ "$3" == "--build-cms" ]]; then
    echo "Building and pushing CMS Docker image..."
    cd ../../cms
    docker build -t registry.gitlab.com/asaiasa/asaiasa-cms:$VERSION .
    docker push registry.gitlab.com/asaiasa/asaiasa-cms:$VERSION
    cd -
fi

echo "Deployment to $ENV environment completed successfully!"
