"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import { Board, CreateBoardDto, CreateCommentDto } from "../../types/board";
import { getAllBoards, createBoard, createComment } from "../../api/board";
import CreateBoard from "./components/CreateBoard";

export default function AlbumPage() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [comment, setComment] = useState("");
  const [showComments, setShowComments] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 게시물 목록 조회
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const data = await getAllBoards();
        setBoards(data);
      } catch (err) {
        setError("게시물을 불러오는데 실패했습니다.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBoards();
  }, []);

  // 댓글 토글
  const toggleComments = (boardId: number) => {
    setShowComments((prev) => ({
      ...prev,
      [boardId]: !prev[boardId],
    }));
  };

  // 댓글 작성
  const handleCommentSubmit = async (boardId: number) => {
    if (!comment.trim()) return;

    try {
      const commentData: CreateCommentDto = {
        content: comment,
        boardId: boardId,
      };

      const newComment = await createComment(commentData);

      // 새 댓글이 추가된 게시물 업데이트
      setBoards(
        boards.map((board) => {
          if (board.id === boardId) {
            return {
              ...board,
              comments: [...board.comments, newComment],
            };
          }
          return board;
        })
      );

      setComment("");
      setShowComments((prev) => ({
        ...prev,
        [boardId]: true,
      }));
    } catch (err) {
      console.error("댓글 작성 실패:", err);
    }
  };

  // 새 게시물이 작성되었을 때
  const handleBoardCreated = (newBoard: Board) => {
    setBoards((prevBoards) => [newBoard, ...prevBoards]);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.album}>
      <CreateBoard onBoardCreated={handleBoardCreated} />
      <div className={styles.albumBoardContainer}>
        <div className={styles.albumBoardWrap}>
          {boards.map((board) => (
            <div className={styles.albumBoard} key={board.id}>
              <div className={styles.boardProfileContainer}>
                <Image
                  className={styles.boardProfileImage}
                  src={board.user.picture_url || "/default-profile.jpg"}
                  alt="profile"
                  width={50}
                  height={50}
                />
                <p className={styles.boardProfileName}>{board.user.name}</p>
              </div>
              <div className={styles.boardContentContainer}>
                <p className={styles.boardContent}>{board.content}</p>
                {board.imageUrls && board.imageUrls.length > 0 && (
                  <div className={styles.boardContentImageContainer}>
                    {board.imageUrls.map((imageUrl, index) => (
                      <Image
                        key={index}
                        className={styles.boardContentImage}
                        src={imageUrl}
                        alt={`게시물 ${board.id}의 이미지 ${index + 1}`}
                        width={0}
                        height={0}
                        sizes="100vw"
                        style={{
                          width: "100%",
                          height: "auto",
                        }}
                      />
                    ))}
                  </div>
                )}
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
                      handleCommentSubmit(board.id);
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
                  {board.comments.map((comment) => (
                    <div
                      className={styles.boardCommentContainer}
                      key={comment.id}
                    >
                      <Image
                        className={styles.boardCommentProfileImage}
                        src={comment.user.picture_url || "/default-profile.jpg"}
                        alt="profile"
                        width={50}
                        height={50}
                      />
                      <div className={styles.boardCommentContentWrap}>
                        <p className={styles.boardCommentName}>
                          {comment.user.name}
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
