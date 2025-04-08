#!/bin/bash

# Function to check if kustomize is installed
check_kustomize() {
    if ! [ -x "$(command -v kustomize)" ]; then
        echo "Error: kustomize is not installed. Please install it first."
        exit 1
    fi
}

# Function to check if kubectl is installed and configured
check_kubectl() {
    if ! kubectl version &>/dev/null; then
        echo "Error: kubectl is not installed or not properly configured. Please install it and set up your Kubernetes configuration."
        exit 1
    fi
}

# Function to deploy resources using kustomize
deploy_resources() {
    local target_environment="overlays/$1"
    local VERSION=$2
    echo "Deploying Kubernetes resources in $target_environment..."
    cd "$target_environment" || exit
    echo | kustomize build | sed 's/${VERSION}/'$VERSION'/g' | kubectl apply -f -
}

# Main function
main() {
    check_kustomize
    check_kubectl
    if [ $# -ne 2 ]; then
        echo "Usage: $0 <target_environment> <version>"
        exit 1
    fi
    deploy_resources "$1" "$2"
}

# Run the script with the overlays folder and target environment as arguments
main "$@"
