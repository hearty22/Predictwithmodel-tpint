import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Metrics {
  accuracy: number;
  f1_score: number;
  precision: number;
  recall: number;
  support: number;
}

export default function MetricsDashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch("/api/metrics");
        if (!response.ok) throw new Error("Error al cargar métricas");
        const data = await response.json();
        setMetrics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Métricas del Modelo</h2>
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Métricas del Modelo</h2>
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  const chartData = [
    { name: "Accuracy", value: metrics?.accuracy ?? 0 },
    { name: "F1-Score", value: metrics?.f1_score ?? 0 },
    { name: "Precision", value: metrics?.precision ?? 0 },
    { name: "Recall", value: metrics?.recall ?? 0 },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Métricas del Modelo</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <MetricCard label="Accuracy" value={metrics?.accuracy ?? 0} />
        <MetricCard label="F1-Score" value={metrics?.f1_score ?? 0} />
        <MetricCard label="Precision" value={metrics?.precision ?? 0} />
        <MetricCard label="Recall" value={metrics?.recall ?? 0} />
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 1]} />
            <Tooltip
              formatter={(value) => {
                const num = Number(value);
                return isNaN(num) ? String(value) : num.toFixed(2);
              }}
            />
            <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="text-sm text-gray-500 mt-4">
        Support: {metrics?.support ?? 0} muestras
      </p>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: number }) {
  const percentage = (value * 100).toFixed(1);
  return (
    <div className="bg-gray-50 p-4 rounded-lg text-center">
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-2xl font-bold text-blue-600">{percentage}%</p>
    </div>
  );
}
