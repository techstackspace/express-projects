#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Check if the OS is Linux
if [[ "$OSTYPE" != "linux-gnu"* ]]; then
    echo "This script is intended for Linux systems."
    exit 1
fi

# Source the os-release file to get distribution information
if [ -r /etc/os-release ]; then
    . /etc/os-release
    DISTRO_ID=$ID
    DISTRO_VERSION_ID=$VERSION_ID
else
    echo "Cannot determine Linux distribution."
    exit 1
fi

# Determine the package manager and install MongoDB accordingly
case "$DISTRO_ID" in
    ubuntu|debian)
        # Install required packages
        sudo apt-get update
        sudo apt-get install -y gnupg curl

        # Import the MongoDB public GPG key
        curl -fsSL https://pgp.mongodb.com/server-6.0.asc | \
          sudo gpg -o /usr/share/keyrings/mongodb-server-6.0.gpg --dearmor

        # Create the MongoDB source list file
        echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-6.0.gpg ] https://repo.mongodb.org/apt/ubuntu $VERSION_CODENAME/mongodb-org/6.0 multiverse" | \
          sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

        # Reload local package database
        sudo apt-get update

        # Install MongoDB packages
        sudo apt-get install -y mongodb-org

        # Start and enable MongoDB service
        sudo systemctl enable --now mongod
        ;;
    centos|fedora|rhel)
        # Install required packages
        sudo yum install -y gnupg curl

        # Create a MongoDB repository file
        sudo tee /etc/yum.repos.d/mongodb-org-6.0.repo <<EOF
[mongodb-org-6.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/\$releasever/mongodb-org/6.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://pgp.mongodb.com/server-6.0.asc
EOF

        # Install MongoDB packages
        sudo yum install -y mongodb-org

        # Start and enable MongoDB service
        sudo systemctl enable --now mongod
        ;;
    arch)
        # Install MongoDB using pacman
        sudo pacman -Sy --noconfirm mongodb

        # Start and enable MongoDB service
        sudo systemctl enable --now mongodb
        ;;
    *)
        echo "Unsupported Linux distribution: $DISTRO_ID"
        exit 1
        ;;
esac

# Install additional packages
echo "Installing additional packages..."

# Update package lists
sudo apt-get update

# Install gh and git
sudo apt-get install -y gh git

# Install Visual Studio Code
echo "Installing Visual Studio Code..."
wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.gpg
sudo install -o root -g root -m 644 microsoft.gpg /etc/apt/trusted.gpg.d/
sudo sh -c 'echo "deb [arch=amd64] https://packages.microsoft.com/repos/vscode stable main" > /etc/apt/sources.list.d/vscode.list'
sudo apt-get update
sudo apt-get install -y code
rm microsoft.gpg

# Install Postman
echo "Installing Postman..."
sudo snap install postman

# Install Arc Browser (if available)
echo "Installing Arc Browser..."
# Note: Arc Browser may not be available for Linux. Skipping installation.

# Install Warp Terminal (if available)
echo "Installing Warp Terminal..."
# Note: Warp Terminal may not be available for Linux. Skipping installation.

# Install MongoDB Compass
echo "Installing MongoDB Compass..."
sudo snap install mongodb-compass

# Install VS Code extensions
echo "Installing VS Code extensions..."
code --install-extension amazonwebservices.aws-toolkit-vscode
code --install-extension mongodb.mongodb-vscode
code --install-extension bengreenier.vscode-node-readme
code --install-extension yzhang.markdown-all-in-one
code --install-extension postman.postman-for-vscode
code --install-extension esbenp.prettier-vscode
code --install-extension github.github-vscode-theme
code --install-extension pkief.material-icon-theme

echo "All installations completed successfully."

# Edit file to add or remove packages/dependencies