# DigiArch

**DigiArch** is an intelligent document archiving and management system powered by AI. It leverages modern web technologies to automate the classification, metadata extraction, and storage of administrative documents.

## 📂 Project Structure

- **`digi-back/`**: Backend API built with **NestJS**.
- **`digi-front/`**: Frontend Application built with **Next.js**.

## 🚀 Getting Started

### Prerequisites

- Docker & Docker Compose
- Node.js (v20+)
- Google Gemini API Key

### Quick Launch (Full Stack)

Run the entire application (Backend + Frontend + Database + Storage) with a single command:

```bash
docker-compose up -d --build
```

### Access Points

- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:3001`
- **MinIO Console**: `http://localhost:9001` (User/Pass: `minioadmin`)

## 🛠 Technologies

- **Frameworks**: NestJS (Back), Next.js (Front)
- **Database**: MongoDB
- **Object Storage**: MinIO
- **AI**: Google Gemini & Tesseract.js
- **Containerization**: Docker

---

_Last Updated: January 27, 2026_
