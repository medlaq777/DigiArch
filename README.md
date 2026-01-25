# DigiArch

**DigiArch** is an intelligent document archiving and management system powered by AI. It leverages modern web technologies to automate the classification, metadata extraction, and storage of administrative documents.

## 📂 Project Structure

- **`digi-back/`**: Backend API built with **NestJS**.
  - **Authentication**: JWT & Role-based Access Control (RBAC).
  - **Storage**: Secure file storage using **MinIO**.
  - **AI Processing**:
    - **OCR**: Text extraction via `tesseract.js`.
    - **LLM**: Metadata extraction using **Google Gemini**.
    - **Classification**: Automatic folder structuring.
  - **Database**: Metadata indexing with **MongoDB**.

## 🚀 Getting Started

### Prerequisites

- Docker & Docker Compose
- Node.js (v20+)
- Google Gemini API Key

### Backend Setup

Navigate to the backend directory and follow the instructions:

```bash
cd digi-back
# See digi-back/README.md for detailed setup, env configuration, and running instructions.
```

### Quick Launch (Infrastructure)

```bash
cd digi-back
docker-compose up -d
npm install
npm run start:dev
```

## 🛠 Technologies

- **Framework**: NestJS
- **Database**: MongoDB
- **Object Storage**: MinIO
- **AI**: Google Gemini & Tesseract.js
- **Containerization**: Docker
