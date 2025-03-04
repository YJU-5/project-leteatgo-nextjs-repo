import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Chart.js 컴포넌트 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ChartProps {
  data: number[]; // 단순 숫자 배열로 변경
}

const Chart: React.FC<ChartProps> = ({ data }) => {
  const chartData = {
    labels: ["친절함 ❤️", "유머 🤣", "적극성 💪", "요리 🍳", "약속 🔒"],
    datasets: [
      {
        label: "",
        data: data,
        backgroundColor: [
          "#FF7B7B",
          "#FFEA82",
          "#6955FF",
          "#FB7AFF",
          "#6AFF79",
        ],
        borderColor: ["#FF7B7B", "#FFEA82", "#6955FF", "#FB7AFF", "#6AFF79"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: "y" as const,
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        max: 5,
        ticks: {
          display: false, // x축 수치 숨기기
        },
      },
      y: {
        ticks: {
          color: ["#FF7B7B", "#FFEA82", "#6955FF", "#FB7AFF", "#6AFF79"],
          font: {
            size: 16,
          },
        },
      },
    },
  };

  return (
    <div
      style={{
        display: "inline-block",
        width: "400px",
        height: "200px",
        margin: "0 auto",
        padding: "0 auto",
      }}
    >
      <Bar options={options} data={chartData} />
    </div>
  );
};

export default Chart;
