# open-cloud

A full stack PERN application for cloud users who want to inventory cloud resources.

## Why I Built This

As a having previously worked in cloud support and operations, I wanted to build an application that I wish I had back when I had to inventory cloud resources.

## Technologies Used

- TypeScript
- React
- Express
- Node.js
- PostgreSQL
- TailwindCSS
- DaisyUI
- AWS - EC2, RDS, ELB
- AWS SDK for JavaScript v3
- Google Cloud API - Node.js Cloud Client Libraries

## Live Demo

Try the application live at [https://opencloud.osgcode.com/](https://opencloud.osgcode.com/)

## Features

- Users can add AWS accounts or GCP projects.
- Users can view virtual machines from AWS EC2 and GCP Compute Engine.
- Users can view object storage buckets from AWS S3 and GCP Cloud Storage.

## Preview

<img width="589" alt="image" src="https://github.com/user-attachments/assets/672bcd6c-e82e-4e54-a31d-c54ca5abf1d0" />

## Development

### System Requirements

- Node.js 18.18 or higher
- NPM 10 or higher
- PostgreSQL 14 or higher

### Getting Started

1. Clone the repository.

   ```shell
   git clone git@github.com:mikejglenn/open-cloud.git
   cd open-cloud
   ```

1. Install all dependencies with NPM.

   ```shell
   npm install
   ```

1. Import the starting database to PostgreSQL.

   ```shell
   createdb openCloud
   npm run db:import
   ```

1. Start the project. Once started you can view the application by opening http://localhost:5173 in your browser.

   ```shell
   npm run dev
   ```
