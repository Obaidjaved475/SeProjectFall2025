# Stage 1: build frontend (no cache artifacts)
FROM node:18-alpine AS frontend-builder
WORKDIR /frontend
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci --silent || npm install --silent
COPY frontend/ .
RUN npm run build \
  && rm -rf node_modules ~/.npm /root/.npm

# Stage 2: backend
FROM python:3.11-slim
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV HF_HOME=/app/.cache/huggingface
WORKDIR /app

# Minimal OS deps for Pillow
RUN apt-get update \
    && apt-get install -y --no-install-recommends libjpeg-dev zlib1g-dev \
    && rm -rf /var/lib/apt/lists/*

# Python deps
COPY backend/requirements.txt ./
RUN pip install --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Pre-download HF model to speed up startup
RUN python - <<'PY'
from transformers import AutoImageProcessor, AutoModelForImageClassification
print('Downloading model to cache...')
AutoImageProcessor.from_pretrained('Dricz/food-classifier-224')
AutoModelForImageClassification.from_pretrained('Dricz/food-classifier-224')
print('Done.')
PY

# Backend code
COPY backend/ /app/

# Built frontend -> static
RUN mkdir -p /app/static
COPY --from=frontend-builder /frontend/dist /app/static

EXPOSE 8000
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]