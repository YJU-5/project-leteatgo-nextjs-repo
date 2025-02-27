"use client";

import styles from "./page.module.css";
// import { useState } from "react";
import Image from "next/image";

export default function Album() {
  // const [user, setUser] = useState({
  //   name: "차승현",
  //   image: "/foods/kr-food.jpg",
  // });

  const user = {
    name: "차승현",
    image: "/gitb.png",
  };

  return (
    <div className={styles.album}>
      <div className={styles.profile}>
        <div className={styles.profile_container}>
          <Image
            className={styles.profile_image}
            src={user.image}
            alt="profile"
            width={1000}
            height={1000}
          />
          <h1 className={styles.profile_name}>{user.name}</h1>
        </div>
      </div>
      <div className={styles.album_top_content_container}>
        <textarea
          className={styles.album_textarea}
          placeholder="글을 작성해보세요!"
        />
        <hr />
        <div className={styles.button_row}>
          <button
            className={styles.album_button + " " + styles.album_button_camera}
          >
            <Image src="/camera.png" alt="camera" width={30} height={30} />
            사진/동영상
          </button>
          <div className={styles.album_button_container}>
            <button
              className={styles.album_button + " " + styles.album_button_cancel}
            >
              취소
            </button>
            <button
              className={styles.album_button + " " + styles.album_button_submit}
            >
              올리기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
