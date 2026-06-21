# ServidorModeloPrediccion

## Descripción del Proyecto

API REST Full-Stack para predecir niveles de estrés académico en estudiantes. El sistema consume un modelo de RandomForest entrenado con scikit-learn y lo expone a través de una interfaz web.

## Arquitectura

```
ServidorModeloPrediccion/
├── models/
│   ├── modelo_final.pkl      # RandomForestClassifier entrenado
│   └── scaler.pkl            # StandardScaler para preprocesamiento
├── app/
│   ├── backend/
│   │   ├── main.py           # FastAPI app
│   │   └── requirements.txt # Dependencias Python
│   └── frontend/
│       ├── src/
│       │   ├── App.tsx       # Componente principal React
│       │   └── components/
│       │       └── MetricsDashboard.tsx
│       └── package.json      # Dependencias Node
├── Dockerfile.backend       # Contenedor Python
├── Dockerfile.frontend      # Contenedor Node + Nginx
├── docker-compose.yml       # Orquestación servicios
└── nginx.conf               # Reverse proxy
```

## Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| Backend | FastAPI + Uvicorn + Pydantic |
| ML | scikit-learn 1.9.0 + joblib + pandas + numpy |
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS |
| Visualización | Recharts 3.x |
| Contenedores | Docker + Docker Compose |
| Servidor Web | Nginx |

## Modelo de ML

### Features de Entrada (8 campos)

| Campo | Tipo | Rango | Descripción |
|-------|------|-------|-------------|
| Sleep_Hours | float | 0-24 | Horas de sueño al día |
| Study_Hours | float | 0-24 | Horas de estudio al día |
| Social_Media_Hours | float | 0-24 | Horas en redes sociales |
| Attendance | float | 0-100 | Asistencia (%) |
| Exam_Pressure | float | 1-10 | Presión de exámenes |
| Family_Support | float | 1-10 | Apoyo familiar |
| Month | int | 1-12 | Mes del año |
| Student_Type | string | - | Tipo: "college", "school", "working_student" |

### Preprocesamiento

1. **Escalado**: Study_Hours y Sleep_Hours se escalan con StandardScaler
2. **One-Hot Encoding**: Student_Type se convierte a 3 variables binarias

### Features Finales (10 columnas)

```
['Sleep_Hours', 'Study_Hours', 'Social_Media_Hours', 'Attendance', 
 'Exam_Pressure', 'Family_Support', 'Month', 'student_type_college', 
 'student_type_school', 'student_type_working_student']
```

### Predicción

- **Output**: Entero (0 = Bajo Estrés/Sin Estrés, 1 = Alto Estrés)

## Endpoints del Backend

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/` | Health-check |
| POST | `/predict` | Predicción con validación Pydantic |
| GET | `/metrics` | Métricas del modelo (hardcodeadas) |

## Ejemplo de Request

```json
POST /predict
{
  "Sleep_Hours": 7.0,
  "Study_Hours": 4.0,
  "Social_Media_Hours": 2.0,
  "Attendance": 85.0,
  "Exam_Pressure": 6.0,
  "Family_Support": 7.0,
  "Month": 6,
  "Student_Type": "college"
}
```

## Configuración y Ejecución

### Requisitos Previos

- Docker
- Docker Compose
- pnpm (para desarrollo local del frontend)

### Desarrollo Local

```bash
# Frontend
cd app/frontend
pnpm install
pnpm dev

# Backend
cd app/backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Producción (Docker)

```bash
docker-compose up --build
```

Acceso: `http://localhost:80`

## Puertos Expuestos

| Servicio | Puerto |
|----------|--------|
| Frontend (Nginx) | 80 |
| Backend (FastAPI) | 8000 |

## Variables de Entorno

| Variable | Descripción |
|-----------|-------------|
| PYTHONUNBUFFERED=1 | Salida de logs en tiempo real |

## Notas

- El modelo y scaler se cargan en memoria al iniciar FastAPI
- El directorio `models/` se monta como volumen en el contenedor backend
- Nginx actúa como reverse proxy: `/api/*` → backend:8000
- Los logs de depuración del endpoint `/predict` muestran el payload, valores escalados y DataFrame final