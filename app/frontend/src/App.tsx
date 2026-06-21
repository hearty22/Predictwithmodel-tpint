import { useState } from "react";
import MetricsDashboard from "./components/MetricsDashboard";

interface PredictionInput {
  Sleep_Hours: number;
  Study_Hours: number;
  Social_Media_Hours: number;
  Attendance: number;
  Exam_Pressure: number;
  Family_Support: number;
  Month: number;
  Student_Type: string;
}

interface PredictionResult {
  prediction: number;
}

const defaultValues: PredictionInput = {
  Sleep_Hours: 7.0,
  Study_Hours: 4.0,
  Social_Media_Hours: 2.0,
  Attendance: 85.0,
  Exam_Pressure: 6.0,
  Family_Support: 7.0,
  Month: 6,
  Student_Type: "college",
};

export default function App() {
  const [formData, setFormData] = useState<PredictionInput>(defaultValues);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof PredictionInput, value: string) => {
    if (field === "Student_Type") {
      setFormData((prev) => ({ ...prev, [field]: value }));
    } else {
      const numValue = parseFloat(value) || 0;
      setFormData((prev) => ({ ...prev, [field]: numValue }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error en la predicción");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Modelo de Predicción ML
          </h1>
          <p className="text-gray-600 mt-2">Predicción de estrés academico</p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Ingrese los Datos</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <InputField
                label="Horas de Sueño al día"
                name="Sleep_Hours"
                value={formData.Sleep_Hours}
                onChange={(v) => handleChange("Sleep_Hours", v)}
                min={0}
                max={24}
                step={0.1}
                placeholder="0 - 24 horas"
              />
              <InputField
                label="Horas de Estudio al día"
                name="Study_Hours"
                value={formData.Study_Hours}
                onChange={(v) => handleChange("Study_Hours", v)}
                min={0}
                max={24}
                step={0.1}
                placeholder="0 - 24 horas"
              />
              <InputField
                label="Horas en Redes Sociales al día"
                name="Social_Media_Hours"
                value={formData.Social_Media_Hours}
                onChange={(v) => handleChange("Social_Media_Hours", v)}
                min={0}
                max={24}
                step={0.1}
                placeholder="0 - 24 horas"
              />
              <InputField
                label="Asistencia (%)"
                name="Attendance"
                value={formData.Attendance}
                onChange={(v) => handleChange("Attendance", v)}
                min={0}
                max={100}
                step={0.1}
                placeholder="0 - 100%"
              />
              <InputField
                label="Presión de Exámenes (1 al 10)"
                name="Exam_Pressure"
                value={formData.Exam_Pressure}
                onChange={(v) => handleChange("Exam_Pressure", v)}
                min={1}
                max={10}
                step={0.5}
                placeholder="1 - 10"
              />
              <InputField
                label="Apoyo Familiar (1 al 10)"
                name="Family_Support"
                value={formData.Family_Support}
                onChange={(v) => handleChange("Family_Support", v)}
                min={1}
                max={10}
                step={0.5}
                placeholder="1 - 10"
              />
              <InputField
                label="Mes del Año"
                name="Month"
                value={formData.Month}
                onChange={(v) => handleChange("Month", v)}
                min={1}
                max={12}
                step={1}
                placeholder="1 - 12"
              />
              <SelectField
                label="Tipo de Estudiante"
                name="Student_Type"
                value={formData.Student_Type}
                onChange={(v) => handleChange("Student_Type", v)}
                options={[
                  { value: "college", label: "College" },
                  { value: "school", label: "Escuela" },
                  { value: "working_student", label: "Estudiante Trabajador" },
                ]}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
              >
                {loading ? "Procesando..." : "Predecir"}
              </button>
            </form>

            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            {result !== null && (
              <div className="mt-4 p-4 bg-green-100 border border-green-400 rounded-lg">
                <h3 className="font-bold text-green-800 mb-2">Resultado</h3>
                <p className="text-lg">
                  <span className="font-semibold">Predicción:</span>{" "}
                  <span className="text-2xl font-bold">
                    {result.prediction}
                  </span>
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {result.prediction === 1
                    ? "Alto Estrés"
                    : "Bajo Estrés / Sin Estrés"}
                </p>
              </div>
            )}
          </div>

          <MetricsDashboard />
        </div>
      </div>
    </div>
  );
}

function InputField({
  label,
  name,
  value,
  onChange,
  min,
  max,
  step,
  placeholder,
}: {
  label: string;
  name: string;
  value: number;
  onChange: (value: string) => void;
  min: number;
  max: number;
  step: number;
  placeholder: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <input
        id={name}
        type="number"
        name={name}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
