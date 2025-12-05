# Food Nutrition Analyzer
Developed by: Obaid Javed (Bcss22045) and Abdul Moiz (Bscs22123)


## Introduction
- This app helps users estimate nutrition from a photo of food. You upload an image, the model identifies the most likely food class, and the backend retrieves nutrition facts for that item using the USDA FoodData Central API. It’s designed for quick, everyday use: students tracking meals, fitness enthusiasts, or anyone curious about what’s in their food.
- Under the hood, a lightweight image classification model (via Hugging Face Transformers + PyTorch) predicts the label. To provide actionable data, we normalize the predicted label (e.g., replacing underscores with spaces) and query USDA FDC for nutrients like calories, protein, carbs, and fats. Results are presented in a modern React UI with a clean, responsive design.
- Deployment and operations are kept simple: we use a single Docker image built via a multi-stage Dockerfile. The React app is compiled once and copied into the Python image, and FastAPI serves both the static UI and the API on the same origin. This avoids CORS headaches and makes cloud deployment (e.g., AWS Lightsail) straightforward.

## Tech Stack
- **Backend:** FastAPI, Uvicorn, Transformers, PyTorch, Pillow
- **Frontend:** React 18, Vite, Axios
- **AI Model:** Hugging Face Transformers (food-classifier-224)
- **API:** USDA FoodData Central
- **Container:** Docker with multi-stage build
- **Deployment:** AWS Lightsail, Docker Hub

## System Requirements

### For Running with Docker (Recommended)
- **Docker Desktop** 4.0+ (includes Docker Compose)
- **RAM:** 4GB minimum, 8GB recommended
- **Disk Space:** 3GB free space
- **OS:** macOS, Windows 10/11, or Linux

### For Local Development (Optional)
- **Node.js:** 18.x or higher
- **Python:** 3.11 or higher
- **pip:** Latest version
- **RAM:** 8GB minimum (for model loading)

Quick start (Docker Compose)
Run the app locally in one container. This builds the React app, copies the static build into the backend image, and serves everything from FastAPI on port 8000.

first run your local docker if you don't have docker you can skip this and run local development commands
```zsh
docker compose up --build
```

Then open:
- App: http://localhost:8000


Local development (optional)
- Frontend (dev server):
```zsh
cd frontend
npm ci
npm run dev
```

- Backend (auto-reload):
```zsh
cd backend

# Create & activate a Python virtual environment (recommended)
# macOS/Linux
python3 -m venv .venv
source .venv/bin/activate

# Windows (PowerShell)
# python -m venv .venv
# .venv\Scripts\Activate.ps1

# Upgrade pip and install dependencies
python -m pip install --upgrade pip
pip install -r requirements.txt

# Run the backend with auto-reload
uvicorn app:app --reload --port 8000
```

## Repository
**GitHub:** https://github.com/Obaidjaved475/SeProjectFall2025
live