import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import type { ChartOptions } from "chart.js";

// 필요한 Chart.js 컴포넌트들을 등록
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface RadarChartProps {
  data: number[]; // 5개의 점수를 받는 배열
}

export default function RadarChart({ data }: RadarChartProps) {
  const chartData = {
    labels: [
      "친절해요",
      "재밌어요",
      "적극적이에요",
      "요리를 잘해요",
      "약속을 잘 지켜요",
    ],
    datasets: [
      {
        label: "점수",
        data: data, // props로 받은 데이터 사용
        backgroundColor: "#D9D9D970",
        borderColor: "#f0f0f0",
        borderWidth: 2,
        pointBackgroundColor: "#f0f0f0",
        pointBorderColor: "transparent",
      },
    ],
  };

  const chartOptions: ChartOptions<"radar"> = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      line: {
        borderWidth: 2,
        borderColor: "#f0f0f0",
      },
      point: {
        radius: 3,
        hitRadius: 10,
        hoverRadius: 5,
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        ticks: {
          stepSize: 2.5,
          display: false,
        },
        grid: {
          color: "#f0f0f0",
          lineWidth: 1,
        },
        pointLabels: {
          font: {
            size: 16,
            weight: "bold",
            family: "Pretendard",
          },
          color: "#f0f0f0",
        },
        angleLines: {
          display: true,
          color: "#f0f0f0",
          lineWidth: 1,
        },
        suggestedMin: 0,
        suggestedMax: 5,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
    animation: {
      duration: 1000,
      easing: "easeInOutQuart",
    },
    transitions: {
      active: {
        animation: {
          duration: 1000,
          easing: "easeInOutQuart",
        },
      },
    },
  };

  return (
    <div
      style={{
        width: "100%",
        height: "400px",
        margin: "0 auto",
        padding: "0 auto",
      }}
    >
      <Radar
        key={JSON.stringify(data)}
        data={chartData}
        options={chartOptions}
      />
    </div>
  );
}
