"use client"
import React, { useEffect, useRef } from "react";
import styles from "./Notification.module.css"

interface NotificationProps{
  showNotifications: boolean;
  setShowNotifications: (value:boolean) =>void;
}


export default function Notification({showNotifications,setShowNotifications,}:NotificationProps){

  const notificationRef = useRef<HTMLDivElement>(null);

  const notifications = [
    {
      id: 1,
      profileImage: "/gitb.png",
      message: "차승현 님이 새로운 게시글을 올렸습니다.",
      date: "2024.11.30",
    },
    {
      id: 2,
      profileImage: "/gitb.png",
      message: "홍태관 님이 새로운 게시글을 올렸습니다.",
      date: "2024.11.30",
    },
    
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    }

    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications, setShowNotifications]);


  return(
    showNotifications && (
      <div
        className={`${styles.notificationMenu} ${
          showNotifications ? styles.animateIn : ""
        }`}
        ref={notificationRef}
      >
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <div key={notif.id} className={styles.notificationItem}>
              <img
                src={notif.profileImage}
                alt=""
                className={styles.profileImage}
              />
              <div className={styles.notificationContent}>
                <p className={styles.notificationMessage}>{notif.message}</p>
                <p className={styles.notificationDate}>{notif.date}</p>
              </div>
              <button className={styles.notificationButton}>바로가기</button>
            </div>
          ))
        ) : (
          <p className={styles.noNotifications}>새로운 알림이 없습니다</p>
        )}
      </div>
    )
  )
}