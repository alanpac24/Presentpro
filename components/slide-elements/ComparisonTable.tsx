interface ComparisonTableProps {
  data: Array<{
    feature: string
    option1: string
    option2: string
  }>
  headers?: {
    feature: string
    option1: string
    option2: string
  }
}

export function ComparisonTable({ 
  data, 
  headers = { 
    feature: "Feature", 
    option1: "Traditional", 
    option2: "Modern" 
  } 
}: ComparisonTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
              {headers.feature}
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 bg-red-50">
              {headers.option1}
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 bg-green-50">
              {headers.option2}
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {row.feature}
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">
                {row.option1}
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">
                {row.option2}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}