# AchadoseLidos

Catálogo digital de sebos de Campina Grande

## Table of Contents

- [Introduction](#introduction)
- [Technologies](#technologies)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Testing](#testing)
- [Development Tools](#development-tools)

## Introduction

Achados e Lidos is a digital catalog for second-hand bookstores (aka sebos) in Campina Grande.

## Technologies

The technologies used in this project are:

- **Node.js** and **TypeScript** for functionalities development
- **Jest** for testing
- **Json Web Token** for authentication and authorization
- **ESLint** for code linting and **Prettier** for code formatting
- **Prisma** as the ORM, **Postgres** as the database, and **Docker** for containerization

The recommended Node.js version for this project is v22.14.0. Please use this version when installing dependencies.

## Features

- Feature 1
- Feature 2
- Feature 3

## Installation

You'll need Docker installed in your machine to run this project in local environment. You can see how to do it on your OS on [Docker](https://www.docker.com/)

Follow these steps to install and set up the project:

```bash
# Clone the repository
git clone https://github.com/Engenharia-de-Software-Grupo-1/AchadoseLidos-Back.git

# Navigate to the project directory
cd AchadoseLidos

# Install dependencies
yarn install
```

## Usage

### Setting Up the Database

1. Create a `.env` file with the values required in the `docker-compose.yml` file.
2. Ensure the Docker daemon is running. On Windows, you can start Docker Desktop from the Start menu.
3. Run the following command to set up the database for the first time:

   ```bash
   docker-compose up -d
   ```

4. Create migrations from your Prisma schema, apply them to the database, and generate artifacts:

   ```bash
   yarn prisma migrate dev
   ```

### Running the Project

1. Ensure the Docker daemon is running. On Windows, you can start Docker Desktop from the Start menu.

2. List all containers (including stopped ones) to find the container ID or name:

   ```bash
   docker ps -a
   ```

3. Start the stopped container using its container ID or name:

   ```bash
   docker start <container_id_or_name>
   ```

4. Start the project:

   ```bash
   yarn start
   ```

### Stopping the Docker Container

1. List all containers (including stopped ones) to find the container ID or name:

   ```bash
   docker ps -a
   ```

2. Stop the running container using its container ID or name:

   ```bash
   docker stop <container_id_or_name>
   ```

```bash
yarn start:local
```

## Testing

To run the tests, use:

```bash
yarn test
```

## Development Tools

It's recommended to use the following extensions in VSCode for better readability and maintaining code patterns:

- **Prettier**
- **Prisma**

To auto-format code in VSCode, add the following to your `settings.json`:

```json
{
  "[prisma]": {
    "editor.defaultFormatter": "Prisma.prisma"
  },
  "editor.formatOnSave": true
}
```

In the development environment, you can use **DBeaver** or **Beekeeper** to visualize your database.

The values for the Database Docker come from the `.env` file.
