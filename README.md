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

To run the project, use:

```bash
yarn start
```

To run the project with live-reload for development, use:

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
