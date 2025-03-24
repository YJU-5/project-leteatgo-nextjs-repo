import EventList from "../eventlist/eventlist";
import styles from "./page.module.css"

interface event {
  id: number;
  title: string;
  date: string;
  img: string;
  address: string;
}

export default function MyeventHistory(){

  const event: event[] = Array.from({ length: 30 }, (_, index) => ({
    id: index + 1,
    title: `리뷰 제목${index + 1}`,
    date: "2024.11.30",
    img: "/gitb.png",
    address: "서울특별시 어쩌구"
  }));

  return(
    <div className={styles.container}>
    <div className={styles.header}>
      <h1 className={styles.title}>내 후기 조회({event.length})</h1>
    </div>
    <EventList list={event}/>
  </div>
  )
}