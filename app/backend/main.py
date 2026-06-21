from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

# ============ CONFIGURACIÓN DEL MODELO ============
MODEL_PATH = Path("/app/models/modelo_final.pkl")
SCALER_PATH = Path("/app/models/scaler.pkl")

# Carga global del modelo y scaler al iniciar la aplicación
try:
    MODEL = joblib.load(MODEL_PATH)
    SCALER = joblib.load(SCALER_PATH)
except FileNotFoundError as e:
    MODEL = None
    SCALER = None
    print(f"Advertencia: {e}")


# ============ ESQUEMAS DE VALIDACIÓN (Pydantic) ============
class DatosEntrada(BaseModel):
    """Schema para los 8 features de entrada."""

    Sleep_Hours: float = Field(..., description="Horas de sueño")
    Study_Hours: float = Field(..., description="Horas de estudio")
    Social_Media_Hours: float = Field(..., description="Horas en redes sociales")
    Attendance: float = Field(..., description="Asistencia (0-100)")
    Exam_Pressure: float = Field(..., description="Presión del examen")
    Family_Support: float = Field(..., description="Apoyo familiar")
    Month: int = Field(..., description="Mes del año")
    Student_Type: str = Field(
        ..., description="Tipo de estudiante: college, school, working_student"
    )

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "Sleep_Hours": 7.0,
                    "Study_Hours": 4.0,
                    "Social_Media_Hours": 2.0,
                    "Attendance": 85.0,
                    "Exam_Pressure": 6.0,
                    "Family_Support": 7.0,
                    "Month": 6,
                    "Student_Type": "college",
                }
            ]
        }
    }


class PrediccionResponse(BaseModel):
    """Schema para la respuesta de predicción."""

    prediction: int


# ============ APP FASTAPI ============
app = FastAPI(
    title="API de Predicción ML",
    description="API REST para inferencia con modelo de RandomForest",
    version="1.0.0",
)


# ============ ENDPOINTS ============
@app.get("/")
def health_check() -> dict:
    model_loaded = MODEL is not None and SCALER is not None
    return {
        "status": "ok" if model_loaded else "model_not_loaded",
        "message": "Backend API is running",
        "model_loaded": model_loaded,
    }


@app.post("/predict", response_model=PrediccionResponse)
def predict(datos: DatosEntrada) -> PrediccionResponse:
    """
    Endpoint de predicción con preprocesamiento exacto.
    """
    if MODEL is None or SCALER is None:
        raise HTTPException(status_code=500, detail="Modelo o scaler no cargado")

    try:
        # ========== DEBUG: Mostrar payload original ==========
        print("=" * 60)
        print("[DEBUG] Payload original recibido:")
        print(datos.model_dump())
        print("=" * 60)

        # ========== Paso A: Escalado ==========
        # Extraer Study_Hours y Sleep_Hours en orden específico
        scaler_input = np.array([[datos.Study_Hours, datos.Sleep_Hours]])
        scaled_features = SCALER.transform(scaler_input)
        study_hours_scaled = scaled_features[0][0]
        sleep_hours_scaled = scaled_features[0][1]

        # ========== DEBUG: Mostrar valores escalados ==========
        print("[DEBUG] Valores escalados por el scaler:")
        print(f"  - study_hours_scaled: {study_hours_scaled}")
        print(f"  - sleep_hours_scaled: {sleep_hours_scaled}")
        print("=" * 60)

        # ========== Paso B: One-Hot Encoding Manual ==========
        student_type = datos.Student_Type
        student_type_college = 1 if student_type == "college" else 0
        student_type_school = 1 if student_type == "school" else 0
        student_type_working = 1 if student_type == "working_student" else 0

        # ========== Paso C: Construir Array Final como DataFrame ==========
        # Orden exacto de los features
        feature_columns = [
            "Sleep_Hours",
            "Study_Hours",
            "Social_Media_Hours",
            "Attendance",
            "Exam_Pressure",
            "Family_Support",
            "Month",
            "student_type_college",
            "student_type_school",
            "student_type_working_student",
        ]

        entrada_final = pd.DataFrame(
            [
                [
                    sleep_hours_scaled,
                    study_hours_scaled,
                    datos.Social_Media_Hours,
                    datos.Attendance,
                    datos.Exam_Pressure,
                    datos.Family_Support,
                    datos.Month,
                    student_type_college,
                    student_type_school,
                    student_type_working,
                ]
            ],
            columns=feature_columns,
        )

        # ========== DEBUG: Mostrar array final ==========
        print("[DEBUG] Array final construido (DataFrame):")
        print(f"  - Shape: {entrada_final.shape}")
        print(f"  - Columns: {list(entrada_final.columns)}")
        print(entrada_final)
        print("=" * 60)

        # Predicción
        prediction = int(MODEL.predict(entrada_final)[0])

        print(f"[DEBUG] Predicción resultante: {prediction}")
        print("=" * 60)

        return PrediccionResponse(prediction=prediction)

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error en predicción: {str(e)}")


@app.get("/metrics")
def get_metrics():
    """Métricas hardcodeadas del modelo."""
    return {
        "accuracy": 0.87,
        "f1_score": 0.85,
        "precision": 0.88,
        "recall": 0.84,
        "support": 1000,
    }


# ============ PUNTO DE ENTRADA ============
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
