"use client";

import styles from "./page.module.css";
// import { useState } from "react";
import Image from "next/image";

export default function Album() {
  // const [user, setUser] = useState({
  //   name: "차승현",
  //   image: "/foods/kr-food.jpg",
  // });

  // const [board, setBoard] = useState({
  //   title: "",
  //   content: "",
  //   image: "",
  // });

  // const comment = {
  //   content: "",
  // };

  const user = {
    name: "차승현",
    image: "/gitb.png",
  };

  const albumBoard = [
    {
      id: "1",
      content:
        "안녕하세요? 안녕하세요? 안녕하세요? 안녕하세요? 안녕하세요? 안녕하세요? 안녕하세요? 안녕하세요? 안녕하세요? 안녕하세요? 안녕하세요? 안녕하세요? 안녕하세요? 안녕하세요? 안녕하세요? 안녕하세요? 안녕하세요? 안녕하세요? 안녕하세요? 안녕하세요? 안녕하세요? 안녕하세요? 안녕하세요? 안녕하세요? 안녕하세요? 안녕하세요? ",
      profileImage: "/gitb.png",
      profileName: "차승현",
      images: ["/foods/kr-food.jpg", "/foods/kr-food.jpg"],
      likeNumber: 0,
      commentNumber: 0,
    },
    {
      id: "2",
      content: "오늘 점심 뭐 먹지?",
      profileImage: "/gitb.png",
      profileName: "홍태관",
      images: ["/foods/kr-food.jpg", "/foods/kr-food.jpg"],
      likeNumber: 0,
      commentNumber: 0,
    },
    {
      id: "3",
      content: "오늘 점심 뭐 먹지?",
      profileImage: "/gitb.png",
      profileName: "김형선",
      images: ["/foods/kr-food.jpg", "/foods/kr-food.jpg"],
      likeNumber: 0,
      commentNumber: 0,
    },
  ];

  const albumComment = [
    {
      id: "1",
      content: "",
    },
    {
      id: "2",
      content: "",
    },
    {
      id: "3",
      content: "",
    },
    {
      id: "4",
      content: "",
    },
    {
      id: "5",
      content: "",
    },
  ];

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
        <div className={styles.album_top_content}>
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
                className={
                  styles.album_button + " " + styles.album_button_cancel
                }
              >
                취소
              </button>
              <button
                className={
                  styles.album_button + " " + styles.album_button_submit
                }
              >
                올리기
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.album_board_container}>
        <div className={styles.album_board_wrap}>
          {albumBoard.map((board) => (
            <div className={styles.album_board} key={board.id}>
              <div className={styles.board_profile_container}>
                <Image
                  className={styles.board_profile_image}
                  src={board.profileImage}
                  alt="profile"
                  width={50}
                  height={50}
                />
                <p className={styles.board_profile_name}>{board.profileName}</p>
              </div>
              <div className={styles.board_content_container}>
                <p className={styles.board_content}>{board.content}</p>
                {board.images.map((image) => (
                  <>
                    <Image
                      className={styles.board_content_image}
                      src={image}
                      alt="image"
                      width={250}
                      height={250}
                    />
                  </>
                ))}
              </div>
              <div className={styles.board_comment_container}>
                <p className={styles.board_comment_content}>
                  {albumComment.map((comment) => (
                    <div key={comment.id}>
                      <p>{comment.content}</p>
                    </div>
                  ))}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
