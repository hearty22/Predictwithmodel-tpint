# ServidorModeloPrediccion

## Descripción

Este proyecto es una aplicación web completa que incluye un backend basado en FastAPI y un frontend basado en React. La aplicación permite realizar predicciones utilizando un modelo de machine learning.

## Arquitectura

La arquitectura del proyecto se compone de los siguientes componentes:

### Backend

- **Tecnologías**: FastAPI, Uvicorn, Pydantic, NumPy
- **Estructura**:
  - `main.py`: Punto de entrada de la aplicación FastAPI.
  - `requirements.txt`: Lista de dependencias del backend.

### Frontend

- **Tecnologías**: React, Vite, Tailwind CSS
- **Estructura**:
  - `App.jsx`: Componente principal de la aplicación React.
  - `package.json`: Lista de dependencias del frontend.

### Docker

- **Dockerfile**: Configuración para construir la imagen del backend.
- **Dockerfile.frontend**: Configuración para construir la imagen del frontend.
- **docker-compose.yml**: Configuración para orquestar los servicios del backend y frontend.
- **nginx.conf**: Configuración del servidor Nginx para servir el frontend y proxy las solicitudes al backend.

## Configuración del Entorno

### Requisitos Previos

- Docker
- Docker Compose

### Instalación

1. Clona el repositorio:
   ```sh
   git clone <repository-url>
   cd ServidorModeloPrediccion
   ```

2. Construye y levanta los contenedores:
   ```sh
   docker-compose up --build
   ```

### Uso

1. Accede a la aplicación en tu navegador:
   ```sh
   http://localhost:80
   ```

2. Haz clic en el botón "Predecir" para obtener una predicción basada en los datos proporcionados.

## Endpoints del Backend

- `GET /`: Verifica que el backend esté funcionando.
- `POST /predict`: Realiza una predicción basada en los datos proporcionados.

## Estructura del Proyecto

```
ServidorModeloPrediccion/
├── app/
│   ├── backend/
│   │   ├── main.py
│   │   └── requirements.txt
│   └── frontend/
│       ├── src/
│       │   └── App.jsx
│       └── package.json
├── Dockerfile
├── Dockerfile.frontend
├── docker-compose.yml
└── nginx.conf
```

## Contribución

Si deseas contribuir a este proyecto, por favor sigue estos pasos:

1. Haz un fork del repositorio.
2. Crea una nueva rama (`git checkout -b feature/nueva-caracteristica`).
3. Realiza tus cambios y haz commit (`git commit -am 'Agrega nueva característica'`).
4. Sube tus cambios (`git push origin feature/nueva-caracteristica`).
5. Abre un Pull Request.

## Licencia

Este proyecto está licenciado bajo la Licencia MIT.