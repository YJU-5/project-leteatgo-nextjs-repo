"use client";

import RadarChart from "@/components/radar-chart/radar-chart";
import { useState } from "react";

export default function ProfilePage() {
  const [data, setData] = useState([3.5, 4.5, 3.5, 4.5, 3.5]);

  return (
    <div>
      <RadarChart data={data} />
    </div>
  );
}
