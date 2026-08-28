# Framecape Internships API

A small Express API for managing and verifying internship certificates.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   Copy `.env.example` to `.env` and fill in a secure API key.
   ```bash
   cp .env.example .env
   ```

3. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

### Public Endpoints
- `GET /api/interns` - Retrieve all interns. Optional `?q=searchTerm` filters by name or certificate ID.
- `GET /api/interns/:certId` - Retrieve a specific intern by their certificate ID.

### Admin Endpoints (Requires `x-api-key` header)
- `POST /api/interns` - Add a new intern and upload their PDF certificate.
  - Accepts `multipart/form-data`
  - Required fields: `name`, `certId`, `duration`, `certificate` (PDF file)
  - Optional fields: `project`
- `DELETE /api/interns/:certId` - Delete an intern and their certificate PDF.

## Postman Example (POST)
- **URL**: `http://localhost:4000/api/interns`
- **Method**: `POST`
- **Headers**:
  - `x-api-key`: your-secret-api-key
- **Body** (form-data):
  - `name`: "Jane Doe"
  - `certId`: "FC-2026-0005"
  - `duration`: "Jan–Mar 2026"
  - `project`: "Built the new landing page."
  - `certificate`: (Select a PDF file)

## Important Note on Storage
This API uses a local `interns.json` file for storage and saves PDF files to the local disk in `uploads/certificates/`. 

**WARNING**: This approach is perfectly fine for a traditional Node.js server (like a VPS or DigitalOcean Droplet), but it **will NOT persist data** on ephemeral/serverless platforms like Vercel or Netlify Functions. If you plan to deploy there, you will need to replace the local JSON storage with a database (e.g., MongoDB, Firebase) and the local disk storage with an object storage service (e.g., AWS S3).
