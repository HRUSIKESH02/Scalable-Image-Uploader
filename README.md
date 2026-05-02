# Scalable Image Uploader

Backend assignment project using Node.js, Express, AWS S3, and NGINX.

It includes:
- `POST /upload` API (`multipart/form-data`, field name: `image`)
- file validation (JPG/PNG only, max size 2MB)
- upload to AWS S3 using AWS SDK v3
- unique object naming (timestamp + UUID)
- multiple backend instances (`3001`, `3002`)
- NGINX round-robin load balancer on port `80`
- GitHub Actions CI smoke test
- optional image resizing with Sharp

Constraints followed:
- no database
- no authentication

## Project Structure

```text
.
|-- .github/workflows/main.yml
|-- nginx/nginx.conf
|-- scripts/ci-smoke.js
|-- src/
|   |-- config/env.js
|   |-- controllers/uploadController.js
|   |-- middleware/errorHandler.js
|   |-- middleware/uploadMiddleware.js
|   |-- routes/uploadRoutes.js
|   |-- services/imageService.js
|   |-- services/s3Service.js
|   |-- utils/AppError.js
|   |-- app.js
|   `-- server.js
|-- .env.example
|-- Dockerfile
|-- package.json
`-- README.md
```

## 1) Setup

Install dependencies:

```bash
npm install
```

Create env file:

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Update `.env`:

```env
PORT=3001
NODE_ENV=development
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
S3_BUCKET_NAME=your-bucket-name
ENABLE_IMAGE_RESIZE=true
RESIZE_WIDTH=1200
```

## 2) Run Backend

Single instance:

```bash
npm start
```

Health check:

- `http://localhost:3001/health`

## 3) Run Multiple Instances

Open two terminals.

Terminal 1:

```powershell
$env:PORT=3001; npm start
```

Terminal 2:

```powershell
$env:PORT=3002; npm start
```

Verify:

- `http://localhost:3001/health`
- `http://localhost:3002/health`

## 4) NGINX Load Balancer

Use [`nginx/nginx.conf`](nginx/nginx.conf).

Upstream servers:
- `127.0.0.1:3001`
- `127.0.0.1:3002`

Run NGINX (example):

```bash
nginx -c /absolute/path/to/CLOUDPROJECT/nginx/nginx.conf
```

Verify load-balanced endpoint:

- `http://localhost/health`

## 5) Upload API

Endpoint:

```text
POST /upload
Content-Type: multipart/form-data
Form field name: image
```

Validation:
- only `image/jpeg` and `image/png`
- max size `2MB`

Success response:

```json
{
  "url": "https://<bucket-name>.s3.amazonaws.com/<image-name>"
}
```

## 6) Testing with cURL

Direct instance:

```bash
curl -X POST http://localhost:3001/upload -F "image=@/absolute/path/to/test.jpg"
```

Through NGINX:

```bash
curl -X POST http://localhost/upload -F "image=@/absolute/path/to/test.png"
```

Windows PowerShell:

```powershell
curl.exe -X POST http://localhost/upload -F "image=@C:/full/path/test.jpg"
```

## 7) GitHub Actions CI

Workflow file: [`.github/workflows/main.yml`](.github/workflows/main.yml)

Triggers:
- `push`
- `pull_request`
- manual run (`workflow_dispatch`)

Pipeline steps:
1. checkout
2. install dependencies (`npm ci`)
3. run smoke test (`npm run ci:smoke`) which starts server and checks `/health`

CI fails if build/startup/health check fails.

## 8) Bonus Features

Docker build:

```bash
docker build -t image-upload-service .
```

Docker run:

```bash
docker run --rm -p 3001:3001 --env-file .env image-upload-service
```

Image resizing config:

```env
ENABLE_IMAGE_RESIZE=true
RESIZE_WIDTH=1200
```

Resize behavior:
- keeps aspect ratio
- avoids upscaling
- auto-rotates using EXIF metadata

## 9) Notes

- `GET /` returns `{"error":"Route not found."}` by design.
- Use `/health` in browser checks.
- If bucket/object is private, upload can succeed even if URL is not publicly viewable.
