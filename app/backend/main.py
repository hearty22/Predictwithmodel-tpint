from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class PredictionRequest(BaseModel):
    data: list[float]


@app.get("/")
def read_root():
    return {
        "message": "Backend API is running",
        "ok": True,
    }


@app.post("/predict")
def predict(request: PredictionRequest):
    # Placeholder for your model prediction
    return {"prediction": sum(request.data) / len(request.data) if request.data else 0}
