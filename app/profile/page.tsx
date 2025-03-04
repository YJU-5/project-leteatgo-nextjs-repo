"use client";

import { useState } from "react";
import styles from "./page.module.css";
import RadarChart from "@/components/RadarChart/RadarChart";
import Chart from "@/components/Chart/Chart";

export default function ProfilePage() {
  const [data, setData] = useState([3.5, 4.5, 3.5, 4.5, 3.5]);

  const calculateAverage = (numbers: number[]): number => {
    const sum = numbers.reduce((acc, curr) => acc + curr, 0);
    return Number((sum / numbers.length).toFixed(1));
  };

  return (
    <div className={styles.profile}>
      <div className={styles.chartContainer}>
        <div className={styles.chartWrap}>
          <RadarChart data={data} />
          <div className={styles.rightChart}>
            <p className={styles.average}>{calculateAverage(data)}</p>
            <Chart data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}
