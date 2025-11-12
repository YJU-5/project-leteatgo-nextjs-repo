"use client";

import styles from "./page.module.css";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/store/Store";
import {
  getAllBoards,
  createBoard,
  updateBoard,
  deleteBoard,
  Board,
  UpdateBoardDto,
} from "@/lib/boardApi";
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  Comment as CommentType,
} from "@/lib/commentApi";
import { isOwner } from "@/lib/authUtils";

export default function Album() {
  const userState = useSelector((state: RootState) => state.user);
  const [boards, setBoards] = useState<Board[]>([]);
  const [boardComments, setBoardComments] = useState<{
    [boardId: number]: CommentType[];
  }>({});
  const [loading, setLoading] = useState(true);

  // 각 게시물의 댓글 표시 상태를 관리하는 state
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>(
    {}
  );

  // 각 게시물별 댓글 입력 상태
  const [commentInputs, setCommentInputs] = useState<{
    [key: number]: string;
  }>({});

  // 게시글 수정 상태
  const [editingBoardId, setEditingBoardId] = useState<number | null>(null);
  const [editingBoardTitle, setEditingBoardTitle] = useState("");
  const [editingBoardContent, setEditingBoardContent] = useState("");
  const [editingBoardFiles, setEditingBoardFiles] = useState<File[]>([]);
  const [editingBoardImages, setEditingBoardImages] = useState<string[]>([]);

  // 댓글 수정 상태
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingCommentContent, setEditingCommentContent] = useState("");

  const [write, setWrite] = useState("");
  const [title, setTitle] = useState("");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // 각 게시글별 현재 이미지 인덱스 (슬라이더용)
  const [currentImageIndex, setCurrentImageIndex] = useState<{
    [boardId: number]: number;
  }>({});

  // 게시글 불러오기
  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      setLoading(true);
      const data = await getAllBoards();
      setBoards(data);
    } catch (error) {
      console.error("게시글 로딩 실패:", error);
      alert("게시글을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 특정 게시글의 댓글 불러오기
  const fetchCommentsForBoard = async (boardId: number) => {
    try {
      const data = await getComments(boardId);
      setBoardComments((prev) => ({ ...prev, [boardId]: data }));
    } catch (error) {
      console.error("댓글 로딩 실패:", error);
    }
  };

  // 댓글 토글 함수
  const toggleComments = async (boardId: number) => {
    const boardIdStr = boardId.toString();
    const isCurrentlyShown = showComments[boardIdStr];

    setShowComments((prev) => ({
      ...prev,
      [boardIdStr]: !prev[boardIdStr],
    }));

    // 댓글이 로드되지 않았다면 로드
    if (!isCurrentlyShown && !boardComments[boardId]) {
      await fetchCommentsForBoard(boardId);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (selectedImages.length + files.length > 4) {
      alert("이미지는 최대 4개까지만 업로드할 수 있습니다.");
      return;
    }

    // 파일 객체 저장
    const filesArray = Array.from(files);
    setSelectedFiles((prev) => [...prev, ...filesArray]);

    // 파일을 URL로 변환 (미리보기용)
    const newImages = filesArray.map((file) => URL.createObjectURL(file));
    setSelectedImages((prev) => [...prev, ...newImages]);
  };

  const handleEditImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (editingBoardImages.length + files.length > 4) {
      alert("이미지는 최대 4개까지만 업로드할 수 있습니다.");
      return;
    }

    const filesArray = Array.from(files);
    setEditingBoardFiles((prev) => [...prev, ...filesArray]);

    const newImages = filesArray.map((file) => URL.createObjectURL(file));
    setEditingBoardImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index: number) => {
    // 메모리 해제
    URL.revokeObjectURL(selectedImages[index]);
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeEditImage = (index: number) => {
    const imageUrl = editingBoardImages[index];
    const existingImageUrls =
      boards.find((b) => b.id === editingBoardId)?.picture_urls || [];
    const isExistingImage = existingImageUrls.includes(imageUrl);

    // 새로 추가한 이미지만 메모리 해제 (기존 이미지는 URL이므로 해제하면 안됨)
    if (!isExistingImage) {
      URL.revokeObjectURL(imageUrl);
      // blob URL인 경우에만 editingBoardFiles에서도 제거
      // editingBoardFiles는 새로 추가한 파일만 포함하므로,
      // 기존 이미지가 아닌 경우에만 파일도 제거
      setEditingBoardFiles((prev) => {
        // 현재 인덱스에서 기존 이미지 개수를 빼면 파일 인덱스가 됨
        const existingImageCount = editingBoardImages
          .slice(0, index)
          .filter((url) => existingImageUrls.includes(url)).length;
        const fileIndex = index - existingImageCount;

        if (fileIndex >= 0 && fileIndex < prev.length) {
          return prev.filter((_, i) => i !== fileIndex);
        }
        return prev;
      });
    }

    setEditingBoardImages((prev) => prev.filter((_, i) => i !== index));
  };

  // 게시글 작성
  const handleSubmitPost = async () => {
    if (!userState.jwtToken) {
      alert("로그인이 필요한 서비스입니다.");
      return;
    }

    if (!title.trim() || !write.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    try {
      await createBoard({
        title: title.trim(),
        content: write.trim(),
        files: selectedFiles,
      });
      alert("게시글이 작성되었습니다!");

      // 메모리 해제 후 초기화
      selectedImages.forEach((url) => URL.revokeObjectURL(url));
      setTitle("");
      setWrite("");
      setSelectedImages([]);
      setSelectedFiles([]);

      // 게시글 목록 새로고침
      fetchBoards();
    } catch (error: any) {
      console.error("게시글 작성 실패:", error);
      alert(error?.message || "게시글 작성에 실패했습니다.");
    }
  };

  // 게시글 수정 시작
  const startEditBoard = (board: Board) => {
    setEditingBoardId(board.id);
    setEditingBoardTitle(board.title);
    setEditingBoardContent(board.content);
    // 기존 이미지 URL 표시 (수정용)
    setEditingBoardImages(board.picture_urls || []);
    setEditingBoardFiles([]);
  };

  // 게시글 수정 취소
  const cancelEditBoard = () => {
    // 새로 추가한 이미지만 메모리 해제 (기존 이미지는 URL이므로 해제하면 안됨)
    const existingImageUrls =
      boards.find((b) => b.id === editingBoardId)?.picture_urls || [];
    editingBoardImages.forEach((url) => {
      // 기존 이미지가 아닌 새로 추가한 이미지만 메모리 해제
      if (!existingImageUrls.includes(url)) {
        URL.revokeObjectURL(url);
      }
    });

    setEditingBoardId(null);
    setEditingBoardTitle("");
    setEditingBoardContent("");
    setEditingBoardImages([]);
    setEditingBoardFiles([]);
  };

  // 게시글 수정 저장
  const handleUpdateBoard = async (boardId: number) => {
    if (!editingBoardTitle.trim() || !editingBoardContent.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    try {
      // 기존 이미지 URL 목록 (수정 전)
      const originalImageUrls =
        boards.find((b) => b.id === boardId)?.picture_urls || [];

      // 남아있는 기존 이미지 URL만 필터링 (blob URL 제외)
      // blob URL은 http:// 또는 https://로 시작하지 않으므로 필터링
      const remainingImageUrls = editingBoardImages.filter((url) => {
        // S3 URL인 경우 (http:// 또는 https://로 시작)
        if (url.startsWith("http://") || url.startsWith("https://")) {
          // 정확한 URL 매칭 확인
          const exists = originalImageUrls.some(
            (originalUrl) =>
              originalUrl === url || originalUrl.trim() === url.trim()
          );
          return exists;
        }
        // blob URL인 경우 제외 (새로 추가한 이미지)
        return false;
      });

      console.log("수정 전 이미지:", originalImageUrls);
      console.log("수정 중 이미지:", editingBoardImages);
      console.log("남아있는 이미지:", remainingImageUrls);

      const updateData: UpdateBoardDto = {
        title: editingBoardTitle.trim(),
        content: editingBoardContent.trim(),
        existingImageUrls: remainingImageUrls, // 남아있는 기존 이미지 URL 목록
      };

      if (editingBoardFiles.length > 0) {
        updateData.files = editingBoardFiles;
      }

      await updateBoard(boardId, updateData);
      alert("게시글이 수정되었습니다!");

      // 메모리 해제 후 초기화
      const existingImageUrls =
        boards.find((b) => b.id === boardId)?.picture_urls || [];
      editingBoardImages.forEach((url) => {
        // 새로 추가한 이미지만 메모리 해제
        if (!existingImageUrls.includes(url)) {
          URL.revokeObjectURL(url);
        }
      });

      cancelEditBoard();
      await fetchBoards();
      // 이미지 인덱스 초기화
      setCurrentImageIndex((prev) => {
        const newState = { ...prev };
        delete newState[boardId];
        return newState;
      });
    } catch (error: any) {
      console.error("게시글 수정 실패:", error);
      alert(error?.message || "게시글 수정에 실패했습니다.");
    }
  };

  // 게시글 삭제
  const handleDeleteBoard = async (boardId: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) {
      return;
    }

    try {
      await deleteBoard(boardId);
      alert("게시글이 삭제되었습니다!");
      fetchBoards();
    } catch (error: any) {
      console.error("게시글 삭제 실패:", error);
      alert(error?.message || "게시글 삭제에 실패했습니다.");
    }
  };

  // 댓글 작성
  const handleSubmitComment = async (boardId: number) => {
    const commentContent = commentInputs[boardId];

    if (!userState.jwtToken) {
      alert("로그인이 필요한 서비스입니다.");
      return;
    }

    if (!commentContent || !commentContent.trim()) {
      return;
    }

    try {
      await createComment(boardId, commentContent.trim());

      // 댓글 입력 초기화
      setCommentInputs((prev) => ({ ...prev, [boardId]: "" }));

      // 댓글 표시 상태를 true로 설정
      setShowComments((prev) => ({ ...prev, [boardId.toString()]: true }));

      // 댓글 목록 새로고침
      await fetchCommentsForBoard(boardId);
    } catch (error: any) {
      console.error("댓글 작성 실패:", error);
      alert(error?.message || "댓글 작성에 실패했습니다.");
    }
  };

  // 댓글 수정 시작
  const startEditComment = (comment: CommentType) => {
    setEditingCommentId(comment.id);
    setEditingCommentContent(comment.content);
  };

  // 댓글 수정 취소
  const cancelEditComment = () => {
    setEditingCommentId(null);
    setEditingCommentContent("");
  };

  // 댓글 수정 저장
  const handleUpdateComment = async (commentId: number, boardId: number) => {
    if (!editingCommentContent.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }

    try {
      await updateComment(commentId, editingCommentContent.trim());
      alert("댓글이 수정되었습니다!");
      cancelEditComment();
      await fetchCommentsForBoard(boardId);
    } catch (error: any) {
      console.error("댓글 수정 실패:", error);
      alert(error?.message || "댓글 수정에 실패했습니다.");
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId: number, boardId: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) {
      return;
    }

    try {
      await deleteComment(commentId);
      alert("댓글이 삭제되었습니다!");
      await fetchCommentsForBoard(boardId);
    } catch (error: any) {
      console.error("댓글 삭제 실패:", error);
      alert(error?.message || "댓글 삭제에 실패했습니다.");
    }
  };

  if (loading) {
    return <div className={styles.album}>로딩 중...</div>;
  }

  return (
    <div className={styles.album}>
      <div className={styles.profile}>
        <div className={styles.profileContainer}>
          <Image
            className={styles.profileImage}
            src={userState.user?.pictureUrl || "/gitb.png"}
            alt="profile"
            width={1000}
            height={1000}
          />
          <h1 className={styles.profileName}>
            {userState.user?.name || "게스트"}
          </h1>
        </div>
      </div>
      <div className={styles.albumTopContentContainer}>
        <div className={styles.albumTopContent}>
          <input
            type="text"
            className={styles.albumTextarea}
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              height: "40px",
              marginBottom: "10px",
              border: "1px solid #444",
              borderRadius: "5px",
              padding: "10px",
            }}
          />
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
                  // 메모리 해제
                  selectedImages.forEach((url) => URL.revokeObjectURL(url));
                  setTitle("");
                  setWrite("");
                  setSelectedImages([]);
                  setSelectedFiles([]);
                }}
              >
                취소
              </button>
              <button
                className={`${styles.albumButton} ${styles.albumButtonSubmit}`}
                onClick={handleSubmitPost}
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
          {boards.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px",
                color: "#999",
              }}
            >
              작성된 게시글이 없습니다.
            </div>
          ) : (
            boards.map((board) => (
              <div className={styles.albumBoard} key={board.id}>
                <div className={styles.boardProfileContainer}>
                  <Image
                    className={styles.boardProfileImage}
                    src={board.user.pictureUrl || "/gitb.png"}
                    alt="profile"
                    width={50}
                    height={50}
                  />
                  <p className={styles.boardProfileName}>{board.user.name}</p>
                  {isOwner(board.user.id) && (
                    <div
                      style={{
                        marginLeft: "auto",
                        display: "flex",
                        gap: "5px",
                      }}
                    >
                      {editingBoardId === board.id ? (
                        <>
                          <button
                            onClick={() => handleUpdateBoard(board.id)}
                            style={{
                              padding: "5px 10px",
                              fontSize: "12px",
                              backgroundColor: "#4CAF50",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                            }}
                          >
                            저장
                          </button>
                          <button
                            onClick={cancelEditBoard}
                            style={{
                              padding: "5px 10px",
                              fontSize: "12px",
                              backgroundColor: "#999",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                            }}
                          >
                            취소
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEditBoard(board)}
                            style={{
                              padding: "5px 10px",
                              fontSize: "12px",
                              backgroundColor: "#2196F3",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                            }}
                          >
                            수정
                          </button>
                          <button
                            onClick={() => handleDeleteBoard(board.id)}
                            style={{
                              padding: "5px 10px",
                              fontSize: "12px",
                              backgroundColor: "#f44336",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                            }}
                          >
                            삭제
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
                <div className={styles.boardContentContainer}>
                  {editingBoardId === board.id ? (
                    <>
                      <input
                        type="text"
                        value={editingBoardTitle}
                        onChange={(e) => setEditingBoardTitle(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px",
                          marginBottom: "10px",
                          border: "1px solid #444",
                          borderRadius: "5px",
                          fontSize: "1.3rem",
                        }}
                      />
                      <textarea
                        value={editingBoardContent}
                        onChange={(e) => setEditingBoardContent(e.target.value)}
                        style={{
                          width: "100%",
                          minHeight: "100px",
                          padding: "10px",
                          border: "1px solid #444",
                          borderRadius: "5px",
                          marginBottom: "10px",
                        }}
                      />
                      <input
                        type="file"
                        id={`editImageUpload-${board.id}`}
                        multiple
                        accept="image/*"
                        onChange={handleEditImageUpload}
                        style={{ display: "none" }}
                      />
                      <button
                        onClick={() =>
                          document
                            .getElementById(`editImageUpload-${board.id}`)
                            ?.click()
                        }
                        disabled={editingBoardImages.length >= 4}
                        style={{
                          padding: "5px 10px",
                          fontSize: "12px",
                          backgroundColor: "#666",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          marginBottom: "10px",
                        }}
                      >
                        이미지 추가 ({editingBoardImages.length}/4)
                      </button>
                      {editingBoardImages.length > 0 && (
                        <div
                          style={{
                            display: "flex",
                            gap: "10px",
                            flexWrap: "wrap",
                            marginTop: "10px",
                          }}
                        >
                          {editingBoardImages.map((image, index) => {
                            const existingImageUrls =
                              boards.find((b) => b.id === editingBoardId)
                                ?.picture_urls || [];
                            const isExistingImage =
                              existingImageUrls.includes(image);
                            return (
                              <div key={index} style={{ position: "relative" }}>
                                <Image
                                  src={image}
                                  alt={`수정 이미지 ${index + 1}`}
                                  width={100}
                                  height={100}
                                  style={{ borderRadius: "5px" }}
                                />
                                <button
                                  onClick={() => removeEditImage(index)}
                                  style={{
                                    position: "absolute",
                                    top: "-5px",
                                    right: "-5px",
                                    backgroundColor: "#f44336",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "50%",
                                    width: "20px",
                                    height: "20px",
                                    cursor: "pointer",
                                  }}
                                >
                                  ×
                                </button>
                                {isExistingImage && (
                                  <div
                                    style={{
                                      position: "absolute",
                                      bottom: "5px",
                                      left: "5px",
                                      backgroundColor: "rgba(0,0,0,0.7)",
                                      color: "white",
                                      padding: "2px 6px",
                                      borderRadius: "3px",
                                      fontSize: "10px",
                                    }}
                                  >
                                    기존
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <h3
                        style={{
                          marginBottom: "10px",
                          fontSize: "1.3rem",
                        }}
                      >
                        {board.title}
                      </h3>
                      <p className={styles.boardContent}>{board.content}</p>
                      {board.picture_urls && board.picture_urls.length > 0 && (
                        <div className={styles.boardContentImageContainer}>
                          {board.picture_urls.length > 1 && (
                            <>
                              <button
                                className={`${styles.imageNavButton} ${styles.prev}`}
                                onClick={() => {
                                  const currentIdx =
                                    currentImageIndex[board.id] || 0;
                                  const newIdx =
                                    currentIdx === 0
                                      ? board.picture_urls.length - 1
                                      : currentIdx - 1;
                                  setCurrentImageIndex((prev) => ({
                                    ...prev,
                                    [board.id]: newIdx,
                                  }));
                                }}
                              >
                                ‹
                              </button>
                              <button
                                className={`${styles.imageNavButton} ${styles.next}`}
                                onClick={() => {
                                  const currentIdx =
                                    currentImageIndex[board.id] || 0;
                                  const newIdx =
                                    currentIdx === board.picture_urls.length - 1
                                      ? 0
                                      : currentIdx + 1;
                                  setCurrentImageIndex((prev) => ({
                                    ...prev,
                                    [board.id]: newIdx,
                                  }));
                                }}
                              >
                                ›
                              </button>
                            </>
                          )}
                          <div
                            style={{
                              display: "flex",
                              overflow: "hidden",
                              position: "relative",
                              width: "100%",
                              justifyContent: "center",
                              alignItems: "center",
                              minHeight: "400px",
                            }}
                          >
                            {board.picture_urls.map((imageUrl, index) => {
                              const currentIdx =
                                currentImageIndex[board.id] ?? 0;
                              const isVisible = index === currentIdx;

                              // 현재 이미지만 렌더링
                              if (!isVisible) return null;

                              return (
                                <Image
                                  key={`${board.id}-image-${index}`}
                                  className={styles.boardContentImage}
                                  src={imageUrl}
                                  alt={`게시물 ${board.id}의 ${
                                    index + 1
                                  }번째 이미지`}
                                  width={250}
                                  height={250}
                                  style={{
                                    width:
                                      board.picture_urls.length === 1
                                        ? "100%"
                                        : "auto",
                                    maxWidth: "800px",
                                    height: "auto",
                                    margin: "0 auto",
                                    objectFit: "cover",
                                  }}
                                />
                              );
                            })}
                          </div>
                          {board.picture_urls.length > 1 && (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                gap: "5px",
                                marginTop: "10px",
                              }}
                            >
                              {board.picture_urls.map((_, index) => {
                                const currentIdx =
                                  currentImageIndex[board.id] || 0;
                                return (
                                  <button
                                    key={index}
                                    onClick={() => {
                                      setCurrentImageIndex((prev) => ({
                                        ...prev,
                                        [board.id]: index,
                                      }));
                                    }}
                                    style={{
                                      width: "8px",
                                      height: "8px",
                                      borderRadius: "50%",
                                      border: "none",
                                      backgroundColor:
                                        index === currentIdx
                                          ? "#4CAF50"
                                          : "rgba(255, 255, 255, 0.3)",
                                      cursor: "pointer",
                                      transition: "background-color 0.2s",
                                    }}
                                  />
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
                {editingBoardId !== board.id && (
                  <>
                    <div className={styles.boardInputContainer}>
                      <input
                        type="text"
                        className={styles.boardInput}
                        placeholder="댓글 작성하기"
                        value={commentInputs[board.id] || ""}
                        onChange={(e) =>
                          setCommentInputs((prev) => ({
                            ...prev,
                            [board.id]: e.target.value,
                          }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSubmitComment(board.id);
                          }
                        }}
                      />
                    </div>
                    <button
                      className={styles.boardMoreComment}
                      onClick={() => toggleComments(board.id)}
                    >
                      {showComments[board.id.toString()]
                        ? "댓글 접기"
                        : "댓글 더보기"}
                    </button>
                    {showComments[board.id.toString()] && (
                      <div className={styles.boardBottomContainer}>
                        {boardComments[board.id] &&
                        boardComments[board.id].length > 0 ? (
                          boardComments[board.id].map((comment) => (
                            <div
                              className={styles.boardCommentContainer}
                              key={comment.id}
                            >
                              <Image
                                className={styles.boardCommentProfileImage}
                                src={comment.user.pictureUrl || "/gitb.png"}
                                alt="profile"
                                width={50}
                                height={50}
                              />
                              <div
                                className={styles.boardCommentContentWrap}
                                style={{ flex: 1 }}
                              >
                                <p className={styles.boardCommentName}>
                                  {comment.user.name}
                                </p>
                                {editingCommentId === comment.id ? (
                                  <div>
                                    <input
                                      type="text"
                                      value={editingCommentContent}
                                      onChange={(e) =>
                                        setEditingCommentContent(e.target.value)
                                      }
                                      style={{
                                        width: "100%",
                                        padding: "5px",
                                        border: "1px solid #444",
                                        borderRadius: "4px",
                                        marginBottom: "5px",
                                      }}
                                    />
                                    <div
                                      style={{
                                        display: "flex",
                                        gap: "5px",
                                      }}
                                    >
                                      <button
                                        onClick={() =>
                                          handleUpdateComment(
                                            comment.id,
                                            board.id
                                          )
                                        }
                                        style={{
                                          padding: "3px 8px",
                                          fontSize: "11px",
                                          backgroundColor: "#4CAF50",
                                          color: "white",
                                          border: "none",
                                          borderRadius: "4px",
                                          cursor: "pointer",
                                        }}
                                      >
                                        저장
                                      </button>
                                      <button
                                        onClick={cancelEditComment}
                                        style={{
                                          padding: "3px 8px",
                                          fontSize: "11px",
                                          backgroundColor: "#999",
                                          color: "white",
                                          border: "none",
                                          borderRadius: "4px",
                                          cursor: "pointer",
                                        }}
                                      >
                                        취소
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <p className={styles.boardCommentContent}>
                                      {comment.content}
                                    </p>
                                    {isOwner(comment.user.id) && (
                                      <div
                                        style={{
                                          display: "flex",
                                          gap: "5px",
                                          marginTop: "5px",
                                        }}
                                      >
                                        <button
                                          onClick={() =>
                                            startEditComment(comment)
                                          }
                                          style={{
                                            padding: "3px 8px",
                                            fontSize: "11px",
                                            backgroundColor: "#2196F3",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                          }}
                                        >
                                          수정
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleDeleteComment(
                                              comment.id,
                                              board.id
                                            )
                                          }
                                          style={{
                                            padding: "3px 8px",
                                            fontSize: "11px",
                                            backgroundColor: "#f44336",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                          }}
                                        >
                                          삭제
                                        </button>
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div
                            style={{
                              textAlign: "center",
                              padding: "20px",
                              color: "#999",
                            }}
                          >
                            댓글이 없습니다.
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}