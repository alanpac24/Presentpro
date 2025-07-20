interface MetricBoxProps {
  value: string
  label: string
  trend?: string
  color?: "blue" | "green" | "orange" | "gray"
}

export function MetricBox({ value, label, trend, color = "blue" }: MetricBoxProps) {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-900",
    green: "bg-green-50 border-green-200 text-green-900",
    orange: "bg-orange-50 border-orange-200 text-orange-900",
    gray: "bg-gray-50 border-gray-200 text-gray-900"
  }

  const trendColorClasses = {
    blue: "text-blue-600",
    green: "text-green-600",
    orange: "text-orange-600",
    gray: "text-gray-600"
  }

  return (
    <div className={`rounded-lg border-2 p-6 ${colorClasses[color]}`}>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm font-medium opacity-80">{label}</div>
      {trend && (
        <div className={`text-xs mt-2 ${trendColorClasses[color]}`}>
          {trend}
        </div>
      )}
    </div>
  )
}