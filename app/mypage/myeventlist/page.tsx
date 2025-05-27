'use client'
import { useEffect, useState } from "react";
import styles from "./page.module.css"
import EventList from "@/components/MyPage/EventList/EventList";


interface event {
  id: number;
  title: string;
  date: string;
  pictureUrl: string;
  address: string;
  createdAt:string;
}



export default function MyeventHistory() {
  const [events, setEvents] = useState<event[]>([]);

  useEffect(() => {
    async function getEvents() {
      const res = await fetch("http://localhost:3001/user/hosted", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch events");
      const data = await res.json();
      setEvents(data);
    }
    getEvents();
  }, []);

  const total = events.length;  //개시물의 총 개수
  console.log(events);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>내 개최 조회({events.length})</h1>
      </div>
      <EventList
        list={events}
        total = {total}
      />
    </div>
  )
}

