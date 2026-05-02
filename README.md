# Scalable Image Upload System (Node.js + Express + S3 + NGINX)

This project provides a scalable image upload service with:
- `POST /upload` endpoint for multipart uploads
- Validation for image type (`JPG/PNG`) and max size (`2MB`)
- AWS S3 upload using AWS SDK v3
- NGINX load balancing across multiple Node instances
- GitHub Actions CI pipeline
- Optional image resizing (Sharp) before upload

## 1) Project Structure

```text
.
├─ .github/
│  └─ workflows/
│     └─ main.yml
├─ nginx/
│  └─ nginx.conf
├─ scripts/
│  └─ ci-smoke.js
├─ src/
│  ├─ config/
│  │  └─ env.js
│  ├─ controllers/
│  │  └─ uploadController.js
│  ├─ middleware/
│  │  ├─ errorHandler.js
│  │  └─ uploadMiddleware.js
│  ├─ routes/
│  │  └─ uploadRoutes.js
│  ├─ services/
│  │  ├─ imageService.js
│  │  └─ s3Service.js
│  ├─ utils/
│  │  └─ AppError.js
│  ├─ app.js
│  └─ server.js
├─ .env.example
├─ .gitignore
├─ Dockerfile
├─ package.json
└─ README.md
```

## 2) Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` from `.env.example` and fill your AWS values:
```bash
cp .env.example .env
```

3. Start one instance:
```bash
npm start
```


The upload response format:

```json
{
  "url": "https://<bucket-name>.s3.amazonaws.com/<image-name>"
}
```

## 4) Run Multiple Backend Servers

Run two instances on different ports:

Linux/macOS:
```bash
PORT=3001 npm start
PORT=3002 npm start
```

PowerShell (Windows):
```powershell
$env:PORT=3001; npm start
$env:PORT=3002; npm start
```

## 5) NGINX Load Balancer

Use [`nginx/nginx.conf`](nginx/nginx.conf). It does round-robin load balancing by default:
- `127.0.0.1:3001`
- `127.0.0.1:3002`

Example local run:
1. Start both Node servers.
2. Run NGINX with this config (path depends on your install):
```bash
nginx -c /absolute/path/to/nginx/nginx.conf
```
3. Send requests to:
```text
http://localhost/upload
```

## 6) Upload API

Endpoint:
```text
POST /upload
Content-Type: multipart/form-data
Form field name: image
```

Validation:
- Only `image/jpeg` and `image/png`
- Max file size: `2MB`

## 7) Testing with curl

Direct instance:
```bash
curl -X POST http://localhost:3001/upload \
  -F "image=@/absolute/path/to/test-image.jpg"
```

Through NGINX:
```bash
curl -X POST http://localhost/upload \
  -F "image=@/absolute/path/to/test-image.png"
```

## 8) GitHub Actions CI

Workflow file: [`.github/workflows/main.yml`](.github/workflows/main.yml)

It runs on `push` and `pull_request`:
1. Checks out code
2. Installs dependencies
3. Starts server and smoke-tests `/health`
4. Fails the pipeline if startup/health check fails

## 9) Docker (Bonus)

Build image:
```bash
docker build -t image-upload-service .
```

Run container:
```bash
docker run --rm -p 3001:3001 --env-file .env image-upload-service
```

## 10) Image Resizing (Bonus)

The service can resize images before upload using Sharp.

Environment variables:
- `ENABLE_IMAGE_RESIZE=true|false`
- `RESIZE_WIDTH=1200`

Behavior:
- Keeps aspect ratio
- Prevents upscaling small images
- Auto-rotates using EXIF metadata

## 11) Commands Summary

Install:
```bash
npm install
```

Run single instance:
```bash
npm start
```

Run two instances:
```bash
PORT=3001 npm start
PORT=3002 npm start
```

Smoke test (used in CI):
```bash
npm run ci:smoke
```
