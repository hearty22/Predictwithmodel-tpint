FROM python:3.11-slim

WORKDIR /app

RUN pip install uv

COPY app/backend/requirements.txt .

RUN uv pip install --system -r requirements.txt

COPY app/backend/ .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
