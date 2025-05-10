# Movie Collection API Setup

[![YouTube](https://img.shields.io/badge/YouTube-Channel-FF0000?style=social&logo=youtube)](https://www.youtube.com/@techstackmedia)

A complete setup guide to run the Movie Collection API locally using Node.js, Express, MongoDB (Atlas), TypeScript, and Bun as the package manager.

---

## 1. Prerequisites

Ensure the following tools are installed based on your operating system:

### Required for All Platforms

* [Node.js](https://nodejs.org) (or install via `nvm`)
* [Bun](https://bun.sh/) (recommended)
* [Git](https://git-scm.com/)
* [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (or local MongoDB if preferred)
* `.env` file with your `TMDB_API_KEY`, Mongo URI, etc.

### Install NVM (Optional — if you prefer managing Node versions via `nvm`)

#### macOS and Linux

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
```

> Replace `v0.40.3` with the [latest release version](https://github.com/nvm-sh/nvm/releases).

#### Windows

```bash
powershell -c "irm https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | iex"
```

> Replace `v0.40.3` with the [latest release version](https://github.com/nvm-sh/nvm/releases).

If script execution is restricted, run:

```bash
Set-ExecutionPolicy RemoteSigned -Scope Process
```

### Install Bun (Optional — if you prefer `bun` over `node`)

#### macOS and Linux

```bash
curl -fsSL https://bun.sh/install | bash
```

#### Windows

```bash
powershell -c "irm https://bun.sh/install.ps1 | iex"
```

If script execution is restricted, run:

```bash
Set-ExecutionPolicy RemoteSigned -Scope Process
```

> To install a specific version of Bun on Linux/Mac, [checkout the Bun Docs](https://bun.sh/docs/installation#installing-a-specific-version-of-bun-on-linux-mac).

---

### Windows

Install [Chocolatey](https://chocolatey.org/install) to manage packages:

**Open PowerShell as Administrator** and run:

```bash
Set-ExecutionPolicy Bypass -Scope Process -Force; `
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; `
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

Then install essential tools:

```bash
choco install git nodejs mongodb.install bun vscode mongodb-atlas postman arc-browser warp mongodb-atlas -y # optionally install node if nvm is already installed
```

---

### macOS (via Homebrew)

Install [Homebrew](https://brew.sh) if not already installed:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Then install required tools:

```bash
brew install git node mongodb-community@6.0 mongodb/brew/mongosh mongodb-atlas-cli # optionally install node if nvm is already installed
brew install --cask visual-studio-code postman arc warp
```

---

### Linux (APT or Pacman)

#### For Ubuntu/Debian:

```bash
sudo apt update
sudo apt install -y curl git gnupg

# Install Node.js using NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install --lts

# Install Bun
curl -fsSL https://bun.sh/install | bash

# Optional: VS Code and MongoDB CLI
sudo snap install code --classic
```

#### For Arch/Manjaro (Pacman):

```bash
sudo pacman -Syu git curl base-devel

# Node.js (or use NVM)
sudo pacman -S nodejs npm

# Bun
curl -fsSL https://bun.sh/install | bash

# VS Code
sudo pacman -S code
```

> Note: Use your package manager or Snap/Flatpak for other tools like Postman, Warp, Arc.

---

## 2. Clone the Project

```bash
cd ~/Documents
git clone https://github.com/techstackspace/express-projects.git
cd express-projects
git checkout feature/01-movie-collection-api
```

---

## 3. Install Dependencies

### Using Bun (preferred):

```bash
bun install
```

> Delete `package-lock.json` if switching to `bun`.

### Or using npm:

```bash
npm install
```

---

## 4. How to Get Your TMDB API Key

To use the TMDB API, follow these steps:

1. **Create or Access Your TMDB Account**

   * If you don't have an account: [Sign up here](https://www.themoviedb.org/signup)
   * If you already have an account: [Log in here](https://www.themoviedb.org/login)

2. **Generate Your API Key**

   * Go to the [API settings page](https://www.themoviedb.org/settings/api)
   * Choose the **"Developer" plan** by filling out the [developer subscription form](https://www.themoviedb.org/subscribe/developer)
   * Accept the terms for [personal use](https://www.themoviedb.org/settings/api/request)

3. **Access Your API Key**

   * After approval, visit the [API key details page](https://www.themoviedb.org/subscription)
   * Copy your **API key**

4. **Add the API Key to Your Project**

   * Open your `.env` file
   * Add the following line:

     ```env
     TMDB_API_KEY=<your_tmdb_api_key>
     ```

> ✅ Make sure to restart your development server after updating the `.env` file.

## 5. Environment Variables**

Create a `.env` file in the root directory and add:

```env
MONGO_URI=<mongo_uri>
TMDB_API_KEY=<your_tmdb_api_key>
PORT=5000
```

**Replace `<mongo_uri>` with one of the following options:**

* **Local MongoDB:** `mongodb://localhost:27017/movies-db`
* **MongoDB Atlas:** Use the connection string from your Atlas cluster, e.g.,
  `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/movies-db?retryWrites=true&w=majority`

> **Pro Tip:** You can also import the [`movies-db.movies.json`](./movies-db.movies.json) file into MongoDB Compass or Atlas to quickly populate your database for testing.

---

## 6. Start the Server

### Development:

```bash
bun dev
```

### Build and Run:

```bash
bun run build
bun start
```

> Ensure MongoDB Atlas (or Compass) is running and accessible.

---

## 7. Seed Database with Top Movies

To fetch and seed top-rated movies from TMDB:

```bash
bun run seed
mongosh # optional
```

This script is located at:
`src/scripts/seedMovies.ts`

---

## 8. API Endpoints

### 🔍 `GET /api/movies`

- Optional query params: `search`, `genre`, `country`, `limit`, `page`

### 🌟 `GET /api/movies/top`

- Fetch top 10 movies sorted by rating

### 🔍 `GET /api/movies/:id`

- Get movie by ID

### ➕ `POST /api/movies`

- Add a new movie to the database

---

## 9. Project Structure

```
.
├── src/
│   ├── models/
│   │   └── Movie.ts
│   ├── routes/
│   │   └── movies.ts
│   ├── scripts/
│   │   └── seedMovies.ts
│   ├── index.ts
├── .env
├── tsconfig.json
├── bun.lockb / package-lock.json
├── README.md
```

---

## 10. Recommended Tools via Brewfile

```bash
brew "gh"
brew "git"
brew "mongodb-community@6.0"
brew "mongodb-atlas-cli"
brew "oven-sh/bun/bun"
brew "mongodb/brew/mongosh"
cask "amazon-q"
cask "postman"
cask "arc"
cask "visual-studio-code"
cask "warp"
cask "mongodb-compass"
vscode "amazonwebservices.codewhisperer-for-command-line-companion"
vscode "mongodb.mongodb-vscode"
vscode "bengreenier.vscode-node-readme"
vscode "yzhang.markdown-all-in-one"
vscode "Postman.postman-for-vscode"
vscode "esbenp.prettier-vscode"
vscode "GitHub.github-vscode-theme"
vscode "PKief.material-icon-theme"
```

Use this to install all tools in the project directory:

```bash
brew bundle --file=config/macOS/Brewfile
```

---

## 11. Recommended Tools via Chocolatey

```bash
<?xml version="1.0" encoding="utf-8"?>
<packages>
  <package id="git" />
  <package id="gh" />
  <package id="bun" />
  <package id="nvm" />
  <package id="mongodb.install" />
  <package id="mongodb-compass" />
  <package id="mongodb-atlas" />
  <package id="postman" />
  <package id="vscode" />
  <package id="warp" />
</packages>
```

Use this to install all tools in the project directory:

```bash
choco install config\choco-packages.config -y
```

## 12. Recommended Tools via APT, Pacman, etc

```bash
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
...
```

Use this to install all tools in the project directory:

```bash
chmod +x config/linux/install.sh
```

To run it with sudo, run:

```bash
sudo config/linux/install.sh
```

## 13. Installation of VSCode Extensions

```bash
code --install-extension amazonwebservices.aws-toolkit-vscode
code --install-extension mongodb.mongodb-vscode
code --install-extension bengreenier.vscode-node-readme
code --install-extension yzhang.markdown-all-in-one
code --install-extension postman.postman-for-vscode
code --install-extension esbenp.prettier-vscode
code --install-extension github.github-vscode-theme
code --install-extension pkief.material-icon-theme
```

## 14. Uninstalling Tools

If, after development, you need to reinstall specific packages or all packages, run:

### macOS (Homebrew)

To uninstall tools:

```bash
brew uninstall git node mongodb-community@6.0 bun mongodb-atlas-cli mongosh gh
brew uninstall --cask visual-studio-code postman arc warp mongodb-compass amazon-q
```

To remove Homebrew itself:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/uninstall.sh)"
```

### Windows (Chocolatey)

To uninstall packages:

```powershell
choco uninstall git nodejs mongodb.install mongodb-compass amazon-q postman arc-browser vscode warp-terminal -y
```

To uninstall Chocolatey (run in Administrator PowerShell):

```powershell
Remove-Item -Recurse -Force "$env:ProgramData\chocolatey"
[Environment]::SetEnvironmentVariable('Path', ($env:Path -replace ';C:\\ProgramData\\chocolatey\\bin',''), 'Machine')
```

### Linux

For APT (Ubuntu/Debian):

```bash
sudo apt remove --purge nodejs git mongodb-org -y
sudo snap remove code
sudo rm -rf ~/.bun ~/.nvm ~/.npm ~/.config/bun
```

For Pacman (Arch/Manjaro):

```bash
sudo pacman -Rns nodejs npm git code mongodb --noconfirm
rm -rf ~/.bun ~/.nvm ~/.npm ~/.config/bun
```

## 15. Resources

- [Express.js Docs](https://expressjs.com/)
- [TypeScript Docs](https://www.typescriptlang.org/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [TMDB API Docs](https://developer.themoviedb.org/docs)
- [Bun Docs](https://bun.sh/docs)

---

## 16. Feedback & Suggestions

Your feedback is incredibly valuable and helps improve these resources for the entire community.

Whether you've followed a tutorial, read the documentation, watched a video, or used a script—I'd love to hear your thoughts!

### What you can share:

* What worked well for you?
* What was unclear or confusing?
* Suggestions for improvement or new topics?
* Bugs or outdated instructions?

### Submit your feedback here:

[Submit Feedback Form](https://techstackspace.com/feedback)

Your input helps shape better content for developers like you. Thank you!

---

## 17. Social Media

- [![Instagram](https://img.shields.io/badge/Instagram-Profile-8a3ab9?style=social&logo=instagram)](https://instagram.com/techstackmedia)
- [![Threads](https://img.shields.io/badge/Threads-Profile-8a3ab9?style=social&logo=threads)](https://www.threads.net/@techstackmedia)
- [![Facebook](https://img.shields.io/badge/Facebook-Page-1877F2?style=social&logo=facebook)](https://www.facebook.com/techstackmedia)
- [![TikTok](https://img.shields.io/badge/TikTok-Profile-black?style=social&logo=tiktok)](https://www.tiktok.com/@techstackmedia)
- [![YouTube](https://img.shields.io/badge/YouTube-Channel-FF0000?style=social&logo=youtube)](https://www.youtube.com/@techstackmedia)
- [![X](https://img.shields.io/badge/twitter-Profile-000000?style=social&logo=x)](https://x.com/techstackmedia)