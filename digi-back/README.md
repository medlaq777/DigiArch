# DigiArch Backend (NestJS)

The core API for the DigiArch document management system.

## 🐳 Docker Deployment (Recommended)

To run the entire stack (API, MongoDB, MinIO) with Docker:

```bash
docker-compose up -d --build
```

The API will be available at `http://localhost:3000`.

### Services
- **API**: `http://localhost:3000`
- **MinIO Console**: `http://localhost:9001` (User/Pass: `minioadmin`)
- **MongoDB**: `localhost:27017`

## 🛠 Local Development

### 1. Installation
```bash
npm install
```

### 2. Environment Variables
Ensure `.env` exists:
```env
MONGO_USER=root
MONGO_PASSWORD=example
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin
MONGO_URI=mongodb://root:example@localhost:27017/digiarch?authSource=admin
JWT_SECRET=supersecretkey
GEMINI_API_KEY=your_gemini_api_key
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
```

### 3. Run Locally
```bash
npm run start:dev
```

## 🧪 Testing
```bash
# Unit tests
npm run test
```
