import { Bar } from "react-chartjs-2"

const StatisticsCharts = ({ session, correctPercentages, averageTimes, chartOptions }) => {
  const getCorrectnessChartData = () => {
    return {
      labels: Array.from({ length: session?.questions?.length || 0 }, (_, i) => `Q${i + 1}`),
      datasets: [
        {
          label: "Correct Answers (%)",
          data: correctPercentages,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    }
  }

  const getTimeChartData = () => {
    return {
      labels: Array.from({ length: session?.questions?.length || 0 }, (_, i) => `Q${i + 1}`),
      datasets: [
        {
          label: "Average Response Time (seconds)",
          data: averageTimes,
          backgroundColor: "rgba(153, 102, 255, 0.6)",
          borderColor: "rgba(153, 102, 255, 1)",
          borderWidth: 1,
        },
      ],
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Correct Answer Percentage</h2>
        <div className="h-80">
          <Bar data={getCorrectnessChartData()} options={chartOptions} />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Average Response Time</h2>
        <div className="h-80">
          <Bar data={getTimeChartData()} options={chartOptions} />
        </div>
      </div>
    </div>
  )
}

export default StatisticsCharts
