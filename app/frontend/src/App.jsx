import { useState } from 'react'

function App() {
  const [data, setData] = useState([1, 2, 3, 4, 5])
  const [prediction, setPrediction] = useState(null)

  const handlePredict = async () => {
    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data })
      })
      const result = await response.json()
      setPrediction(result.prediction)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Modelo de Predicción</h1>
        <p className="mb-4">Datos: {data.join(', ')}</p>
        <button
          onClick={handlePredict}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Predecir
        </button>
        {prediction !== null && (
          <p className="mt-4 text-lg">Predicción: {prediction}</p>
        )}
      </div>
    </div>
  )
}

export default App
