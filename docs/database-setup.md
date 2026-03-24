# Database Setup

## Install MongoDB (recommended)

LabKit is based on Payload CMS, which is database-agnostic. That means you can use any type of database behind Payload’s familiar APIs.

Nevertheless, we try to keep LabKit production-ready and therefore can’t support all database clients at this time. This page explains the official support and how to replace the official adapters with your own.

### Install MongoDB locally on macOS
The official MongoDB installation guide is available here: https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/

#### Installing MongoDB 8.0 Community Edition

```bash
brew tap mongodb/brew
brew update
# To install MongoDB, run the following command in your macOS Terminal application:
brew install mongodb-community@8.0
```

#### Run MongoDB locally on macOS

```bash
brew services start mongodb-community@8.0
```

### Run MongoDB in Docker

Better yet, run MongoDB directly in Docker.

```bash
docker run --name labkit-mongodb -p 27017:27017 -v mongo-volume:/data/db -d mongo:8
```

### Install a MongoDB debugging GUI

MongoDB Compass is a GUI for MongoDB. It’s not required to run MongoDB, but it is useful for managing your MongoDB databases.

[MongoDB Compass](https://www.mongodb.com/try/download/compass)

Alternatively, you can use the Studio 3T GUI, which works fine in the free mode: https://studio3t.com/

## Information on Postgres usage

We recommend using MongoDB for Payload. In general, LabKit offers better support for MongoDB than for Postgres.

If you choose to use Postgres, you must create and maintain database migration scripts for each content schema modification. Additionally, some of our features — such as the custom Backup and Seeding plugin — will only work with MongoDB.

For guidance on choosing a database technology, see: Payload Database Documentation

If you still wish to use Postgres, you can find the official installation details here: Payload Postgres Documentation.

To see tutorials for Windows and Linux, see: https://www.mongodb.com/docs/manual/installation/