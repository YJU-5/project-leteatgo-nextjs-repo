import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ScriptableScalePointLabelContext,
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

// RadarChart 컴포넌트: 레이더 차트를 표시하는 컴포넌트
// data: 5개의 점수를 포함하는 배열 (0-5 사이의 값)
export default function RadarChart({ data }: RadarChartProps) {
  // 차트 데이터 설정
  const chartData = {
    // 5개의 평가 항목 레이블
    labels: [
      "친절해요",
      "재밌어요",
      "적극적이에요",
      "요리를 잘해요",
      "약속을 잘 지켜요",
    ],
    datasets: [
      {
        label: "",
        data: data,
        // 반투명한 회색 배경
        backgroundColor: "#D9D9D970",
        // 테두리 색상 및 두께
        borderColor: "#f0f0f0",
        borderWidth: 2,
        // 데이터 포인트 스타일링
        pointBackgroundColor: "#f0f0f0",
        pointBorderColor: "transparent",
      },
    ],
  };

  // 차트 옵션 설정
  const chartOptions: ChartOptions<"radar"> = {
    // 반응형 설정
    responsive: true,
    maintainAspectRatio: false,
    // 차트 요소 스타일링
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
    // 레이더 차트 축 설정
    scales: {
      r: {
        beginAtZero: true,
        ticks: {
          stepSize: 2.5,
          display: false,
        },
        // 그리드 라인 스타일링
        grid: {
          color: "#f0f0f0",
          lineWidth: 1,
        },
        // 레이블 스타일링
        pointLabels: {
          font: {
            size: 14,
            weight: "bold",
            family: "Pretendard",
          },
          color: (context: ScriptableScalePointLabelContext) => {
            const colors = [
              "#FF7B7B",
              "#FFEA82",
              "#6955FF",
              "#FB7AFF",
              "#6AFF79",
            ];
            return colors[context.index];
          },
        },
        // 각도 라인 설정
        angleLines: {
          display: true,
          color: "#f0f0f0",
          lineWidth: 1,
        },
        // 최소/최대 값 설정
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
        display: "inline-block",
        width: "500px",
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
