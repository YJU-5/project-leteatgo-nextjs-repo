"use client";

import styles from "./page.module.css";
import { useState } from "react";
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
        "안녕하십니까. 저는 차승현이라고 합니다. 게시판의 임시 내용을 채워넣기 위해 필요 없는 말을 잠시 집어넣겠습니다. 오늘의 점심은 백미밥, 얼큰양파감자국, 숯불닭볶음, 야채고로케, 양배추찜*쌈장, 포기김치입니다. 절대 포기하지 않는 사람이 않겠습니다. 감사합니다.",
      profileImage: "/gitb.png",
      profileName: "차승현",
      images: ["/foods/kr-food.jpg", "/foods/kr-food.jpg"],
      likeNumber: 0,
      commentNumber: 0,
    },
    {
      id: "2",
      content:
        "안녕하십니까. 저는 홍태관이라고 합니다. 저는 잘생겼습니다. 약지를 보시면 아시겠지만, 저는 여자친구가 있습니다.",
      profileImage: "/gitb.png",
      profileName: "홍태관",
      images: ["/foods/kr-food.jpg", "/foods/kr-food.jpg"],
      likeNumber: 0,
      commentNumber: 0,
    },
    {
      id: "3",
      content:
        "안녕하십니까. 저는 김형선이라고 합니다. 저는 잘생겼습니다. 일본에서 취업해서 생활해보고 싶습니다.",
      profileImage: "/gitb.png",
      profileName: "김형선",
      images: ["/foods/kr-food.jpg", "/foods/kr-food.jpg"],
      likeNumber: 0,
      commentNumber: 0,
    },
  ];

  const albumComment = [
    {
      boardId: "1",
      id: "1",
      profileImage: "/gitb.png",
      name: "홍승현",
      content: "1번 - 1번 댓글",
    },
    {
      boardId: "1",
      id: "2",
      profileImage: "/gitb.png",
      name: "김태관",
      content: "1번 - 2번 댓글",
    },
    {
      boardId: "1",
      id: "3",
      profileImage: "/gitb.png",
      name: "차형선",
      content: "1번 - 3번 댓글",
    },
    {
      boardId: "2",
      id: "1",
      profileImage: "/gitb.png",
      name: "홍승현",
      content: "2번 - 1번 댓글",
    },
    {
      boardId: "2",
      id: "2",
      profileImage: "/gitb.png",
      name: "김태관",
      content: "2번 - 2번 댓글",
    },
    {
      boardId: "3",
      id: "1",
      profileImage: "/gitb.png",
      name: "차형선",
      content: "3번 - 1번 댓글",
    },
  ];

  // 각 게시물의 댓글 표시 상태를 관리하는 state
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>(
    {}
  );

  const [write, setWrite] = useState("");
  const [comment, setComment] = useState("");

  // 댓글 토글 함수
  const toggleComments = (boardId: string) => {
    setShowComments((prev) => ({
      ...prev,
      [boardId]: !prev[boardId],
    }));
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
        <div className={styles.album_top_content}>
          <textarea
            className={styles.album_textarea}
            placeholder="글을 작성해보세요!"
            value={write}
            onChange={(e) => setWrite(e.target.value)}
          />
          <hr />
          <div className={styles.button_row}>
            <button
              className={styles.album_button + " " + styles.album_button_camera}
            >
              <Image src="/camera.png" alt="camera" width={30} height={30} />
              사진 올리기
            </button>
            <div className={styles.album_button_container}>
              <button
                className={
                  styles.album_button + " " + styles.album_button_cancel
                }
                onClick={() => {
                  setWrite("");
                }}
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
                <div className={styles.board_content_image_container}>
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
              </div>
              <div className={styles.board_input_container}>
                <input
                  type="text"
                  className={styles.board_input}
                  placeholder="댓글 작성하기"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setComment("");
                      setShowComments((prev) => ({
                        ...prev,
                        [board.id]: true,
                      }));
                    }
                  }}
                />
              </div>
              <button
                className={styles.board_more_comment}
                onClick={() => toggleComments(board.id)}
              >
                {showComments[board.id] ? "댓글 접기" : "댓글 더보기"}
              </button>
              {showComments[board.id] && (
                <div className={styles.board_bottom_container}>
                  {albumComment
                    .filter((comment) => comment.boardId === board.id)
                    .map((comment) => (
                      <div
                        className={styles.board_comment_container}
                        key={comment.id}
                      >
                        <Image
                          className={styles.board_comment_profile_image}
                          src={comment.profileImage}
                          alt="profile"
                          width={50}
                          height={50}
                        />
                        <div className={styles.board_comment_content_wrap}>
                          <p className={styles.board_comment_name}>
                            {comment.name}
                          </p>
                          <p className={styles.board_comment_content}>
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
