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
      images: [
        "/foods/kr-food.jpg",
        "/foods/kr-food.jpg",
        "/foods/kr-food.jpg",
        "/foods/kr-food.jpg",
      ],
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
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  // 댓글 토글 함수
  const toggleComments = (boardId: string) => {
    setShowComments((prev) => ({
      ...prev,
      [boardId]: !prev[boardId],
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (selectedImages.length + files.length > 4) {
      alert("이미지는 최대 4개까지만 업로드할 수 있습니다.");
      return;
    }

    // 파일을 URL로 변환
    const newImages = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );
    setSelectedImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={styles.album}>
      <div className={styles.profile}>
        <div className={styles.profileContainer}>
          <Image
            className={styles.profileImage}
            src={user.image}
            alt="profile"
            width={1000}
            height={1000}
          />
          <h1 className={styles.profileName}>{user.name}</h1>
        </div>
      </div>
      <div className={styles.albumTopContentContainer}>
        <div className={styles.albumTopContent}>
          <textarea
            className={styles.albumTextarea}
            placeholder="글을 작성해보세요!"
            value={write}
            onChange={(e) => setWrite(e.target.value)}
          />
          <hr />
          <div className={styles.buttonRow}>
            <input
              type="file"
              id="imageUpload"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
            <button
              className={`${styles.albumButton} ${styles.albumButtonCamera}`}
              onClick={() => document.getElementById("imageUpload")?.click()}
              disabled={selectedImages.length >= 4}
            >
              <Image src="/camera.png" alt="camera" width={30} height={30} />
              사진 올리기 ({selectedImages.length}/4)
            </button>
            <div className={styles.albumButtonContainer}>
              <button
                className={`${styles.albumButton} ${styles.albumButtonCancel}`}
                onClick={() => {
                  setWrite("");
                  setSelectedImages([]);
                }}
              >
                취소
              </button>
              <button
                className={`${styles.albumButton} ${styles.albumButtonSubmit}`}
              >
                올리기
              </button>
            </div>
          </div>
          {selectedImages.length > 0 && (
            <div className={styles.selectedImagesContainer}>
              {selectedImages.map((image, index) => (
                <div key={index} className={styles.selectedImageWrapper}>
                  <Image
                    src={image}
                    alt={`선택된 이미지 ${index + 1}`}
                    width={100}
                    height={100}
                    className={styles.selectedImage}
                  />
                  <button
                    className={styles.removeImageButton}
                    onClick={() => removeImage(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className={styles.albumBoardContainer}>
        <div className={styles.albumBoardWrap}>
          {albumBoard.map((board) => (
            <div className={styles.albumBoard} key={board.id}>
              <div className={styles.boardProfileContainer}>
                <Image
                  className={styles.boardProfileImage}
                  src={board.profileImage}
                  alt="profile"
                  width={50}
                  height={50}
                />
                <p className={styles.boardProfileName}>{board.profileName}</p>
              </div>
              <div className={styles.boardContentContainer}>
                <p className={styles.boardContent}>{board.content}</p>
                <div className={styles.boardContentImageContainer}>
                  {board.images.map((image, index) => (
                    <Image
                      key={`${board.id}-image-${index}`}
                      className={styles.boardContentImage}
                      src={image}
                      alt={`게시물 ${board.id}의 ${index + 1}번째 이미지`}
                      width={250}
                      height={250}
                    />
                  ))}
                </div>
              </div>
              <div className={styles.boardInputContainer}>
                <input
                  type="text"
                  className={styles.boardInput}
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
                className={styles.boardMoreComment}
                onClick={() => toggleComments(board.id)}
              >
                {showComments[board.id] ? "댓글 접기" : "댓글 더보기"}
              </button>
              {showComments[board.id] && (
                <div className={styles.boardBottomContainer}>
                  {albumComment
                    .filter((comment) => comment.boardId === board.id)
                    .map((comment) => (
                      <div
                        className={styles.boardCommentContainer}
                        key={comment.id}
                      >
                        <Image
                          className={styles.boardCommentProfileImage}
                          src={comment.profileImage}
                          alt="profile"
                          width={50}
                          height={50}
                        />
                        <div className={styles.boardCommentContentWrap}>
                          <p className={styles.boardCommentName}>
                            {comment.name}
                          </p>
                          <p className={styles.boardCommentContent}>
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
