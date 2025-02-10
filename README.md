# Panache

## About

Panache is an open-source everything app, in the making.

## Why?

## Features

## Development

### Requirements

- [NodeJS + NPM](https://nodejs.org)
- [Docker](https://www.docker.com)

### Installation

```bash
# Clone the repository
git clone https://github.com/PanacheCompany/panache

# Change directory
cd panache.so

# Install dependencies
npm install

# Set up a environment variables file
cp .env.example .env

# Generate a development application key
node ace generate:key

# Launch Docker compose services
docker compose up -d

# Run migrations
node ace migration:run

# Start development server
npm run dev
```
