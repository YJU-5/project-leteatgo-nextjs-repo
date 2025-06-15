"use client";

import styles from "./page.module.css";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Board as ApiBoard,
  CreateBoardDto,
  UpdateBoardDto,
  getAllBoards,
  createBoard,
  updateBoard,
  deleteBoard,
} from "./components/boardApi";
import {
  Comment,
  getComments,
  createComment,
  updateComment,
  deleteComment,
} from "./components/commentApi";
import {
  isOwner,
  checkAuth,
  getCurrentUser,
  refreshUserInfo,
} from "./components/authUtils";

interface CommentState {
  data: Comment[];
  error?: string;
  loading?: boolean;
}

type Comments = Record<number, CommentState>;

interface Board {
  id: number;
  title: string;
  content: string;
  picture_urls: string[];
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    pictureUrl: string;
    email: string;
    socialId?: string;
  };
  comments: Comment[];
}

export default function Album() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [editSelectedFiles, setEditSelectedFiles] = useState<File[]>([]);
  const [editSelectedImages, setEditSelectedImages] = useState<string[]>([]);
  const [currentImageIndexes, setCurrentImageIndexes] = useState<
    Record<number, number>
  >({});
  const [comment, setComment] = useState("");
  const [showComments, setShowComments] = useState<Record<number, boolean>>({});
  const [comments, setComments] = useState<Comments>({});
  const [editingBoard, setEditingBoard] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editingComment, setEditingComment] = useState<{
    id: number;
    content: string;
  } | null>(null);
  const [editCommentContent, setEditCommentContent] = useState("");
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>(
    {}
  );
  const [editCommentId, setEditCommentId] = useState<number | null>(null);
  const [currentUser, setCurrentUser] = useState(getCurrentUser());

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        setLoading(true);
        const result = await getAllBoards();
        const boardsWithComments = result.map((board) => ({
          ...board,
          comments: [],
        }));
        setBoards(boardsWithComments);
      } catch (err) {
        setError("게시글을 불러오는데 실패했습니다.");
        console.error("Error fetching boards:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBoards();
  }, []);

  useEffect(() => {
    const refreshUser = async () => {
      const updatedUser = await refreshUserInfo();
      if (updatedUser) {
        setCurrentUser(updatedUser);
      }
    };
    refreshUser();
  }, []);

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  // 이미지 업로드 처리 - 작성 모드
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
    setSelectedFiles((prev) => [...prev, ...Array.from(files)]);
  };

  // 이미지 업로드 처리 - 수정 모드
  const handleEditImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (editSelectedImages.length + files.length > 4) {
      alert("이미지는 최대 4개까지만 업로드할 수 있습니다.");
      return;
    }

    const newImages = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );
    setEditSelectedImages((prev) => [...prev, ...newImages]);
    setEditSelectedFiles((prev) => [...prev, ...Array.from(files)]);
  };

  // 이미지 제거 - 작성 모드
  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // 이미지 제거 - 수정 모드
  const removeEditImage = (index: number) => {
    setEditSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setEditSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // 이미지 슬라이더 컨트롤
  const handlePrevImage = (boardId: number) => {
    setCurrentImageIndexes((prev) => ({
      ...prev,
      [boardId]: (prev[boardId] || 0) > 1 ? (prev[boardId] || 0) - 2 : 0,
    }));
  };

  const handleNextImage = (boardId: number, maxIndex: number) => {
    setCurrentImageIndexes((prev) => ({
      ...prev,
      [boardId]:
        (prev[boardId] || 0) < maxIndex - 2
          ? (prev[boardId] || 0) + 2
          : maxIndex - 2,
    }));
  };

  // 게시글 작성
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 로그인 체크
    if (!checkAuth()) {
      alert("로그인이 필요한 서비스입니다.");
      return;
    }

    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      // 게시글 작성 전 사용자 정보 갱신
      const updatedUser = await refreshUserInfo();
      if (updatedUser) {
        setCurrentUser(updatedUser);
      }

      const formData = {
        title: title.trim(),
        content: content.trim(),
        files: selectedFiles,
      };

      const result = await createBoard(formData);
      if (result) {
        // 새로운 게시글 작성 후 목록을 새로 불러오기
        const updatedBoards = await getAllBoards();
        setBoards(
          updatedBoards.map((board) => ({
            ...board,
            comments: [],
          }))
        );

        setTitle("");
        setContent("");
        setSelectedFiles([]);
        setSelectedImages([]);
      }
    } catch (err) {
      console.error("Error creating board:", err);
      alert("게시글 작성에 실패했습니다.");
    }
  };

  // 게시글 수정
  const handleUpdate = async (boardId: number) => {
    // 로그인 체크
    if (!checkAuth()) {
      alert("로그인이 필요한 서비스입니다.");
      return;
    }

    try {
      if (!editTitle.trim() || !editContent.trim()) {
        alert("제목과 내용을 입력해주세요.");
        return;
      }

      setLoading(true);
      const updateData: UpdateBoardDto = {
        title: editTitle.trim(),
        content: editContent.trim(),
        files: editSelectedFiles,
      };

      await updateBoard(boardId, updateData);

      // 수정 후 목록을 새로 불러오기
      const updatedBoards = await getAllBoards();
      setBoards(
        updatedBoards.map((board) => ({
          ...board,
          comments:
            board.id === boardId
              ? boards.find((b) => b.id === boardId)?.comments || []
              : [],
        }))
      );

      setEditingBoard(null);
      setEditTitle("");
      setEditContent("");
      setEditSelectedFiles([]);
      setEditSelectedImages([]);
    } catch (error) {
      console.error("Failed to update board:", error);
      alert("게시글 수정에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 게시글 삭제
  const handleDelete = async (boardId: number) => {
    // 로그인 체크
    if (!checkAuth()) {
      alert("로그인이 필요한 서비스입니다.");
      return;
    }

    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      await deleteBoard(boardId);
      // 삭제 후 목록을 새로 불러오기
      const updatedBoards = await getAllBoards();
      setBoards(
        updatedBoards.map((board) => ({
          ...board,
          comments: [],
        }))
      );
    } catch (error) {
      console.error("Failed to delete board:", error);
      alert("게시글 삭제에 실패했습니다.");
    }
  };

  // 댓글 목록 조회
  const fetchComments = async (boardId: number) => {
    const result = await getComments(boardId);
    const newState: CommentState = {
      data: result.data || [],
      error: result.error,
    };
    setComments((prev) => ({ ...prev, [boardId]: newState }));
  };

  // 댓글 작성
  const handleCommentSubmit = async (boardId: number) => {
    try {
      if (!checkAuth()) {
        alert("로그인이 필요한 서비스입니다.");
        return;
      }

      const content = commentInputs[boardId];
      if (!content?.trim()) {
        alert("댓글 내용을 입력해주세요.");
        return;
      }

      // 댓글 작성 전 사용자 정보 갱신
      const updatedUser = await refreshUserInfo();
      if (updatedUser) {
        setCurrentUser(updatedUser);
      }

      setLoading(true);
      const result = await createComment(boardId, content.trim());

      if (result.data) {
        // 댓글 목록을 새로 불러오기
        const updatedComments = await getComments(boardId);
        setComments((prev) => ({
          ...prev,
          [boardId]: {
            data: updatedComments.data || [],
            loading: false,
            error: undefined,
          },
        }));
        setCommentInputs((prev) => ({ ...prev, [boardId]: "" }));
      }
    } catch (error: any) {
      console.error("Failed to create comment:", error);
      alert(error.message || "댓글 작성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 댓글 수정
  const handleCommentUpdate = async (boardId: number, commentId: number) => {
    if (!checkAuth()) {
      alert("로그인이 필요한 서비스입니다.");
      return;
    }

    if (!editCommentContent.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }

    try {
      const result = await updateComment(commentId, editCommentContent.trim());
      if (!result.data) throw new Error("댓글 데이터가 없습니다.");

      // 댓글 목록을 새로 불러오기
      const updatedComments = await getComments(boardId);
      setComments((prev) => ({
        ...prev,
        [boardId]: {
          data: updatedComments.data || [],
          loading: false,
          error: undefined,
        },
      }));

      setEditCommentId(null);
      setEditCommentContent("");
    } catch (error) {
      console.error("Failed to update comment:", error);
      alert("댓글 수정에 실패했습니다.");
    }
  };

  // 댓글 삭제
  const handleCommentDelete = async (boardId: number, commentId: number) => {
    if (!checkAuth()) {
      alert("로그인이 필요한 서비스입니다.");
      return;
    }

    if (!confirm("댓글을 삭제하시겠습니까?")) return;

    try {
      const result = await deleteComment(commentId);
      if (result.error) {
        alert(result.error);
        return;
      }

      if (result.success) {
        // 댓글 목록을 새로 불러오기
        const updatedComments = await getComments(boardId);
        setComments((prev) => ({
          ...prev,
          [boardId]: {
            data: updatedComments.data || [],
            loading: false,
            error: undefined,
          },
        }));
      }
    } catch (error) {
      console.error("Failed to delete comment:", error);
      alert("댓글 삭제에 실패했습니다.");
    }
  };

  // 댓글 토글
  const toggleComments = async (boardId: number) => {
    setShowComments((prev) => {
      const newState = { ...prev, [boardId]: !prev[boardId] };
      if (newState[boardId] && !comments[boardId]) {
        fetchComments(boardId);
      }
      return newState;
    });
  };

  // 댓글 입력 핸들러
  const handleCommentInputChange = (boardId: number, value: string) => {
    setCommentInputs((prev) => ({
      ...prev,
      [boardId]: value,
    }));
  };

  // 수정 모드 진입 시 기존 이미지 로드
  const handleEditMode = (board: Board) => {
    setEditingBoard(board.id);
    setEditTitle(board.title);
    setEditContent(board.content);
    // 기존 이미지가 있다면 설정
    if (board.picture_urls && board.picture_urls.length > 0) {
      setEditSelectedImages(board.picture_urls);
    } else {
      setEditSelectedImages([]);
    }
    setEditSelectedFiles([]); // 파일은 초기화
  };

  return (
    <div className={styles.album}>
      <div className={styles.profile}>
        <div className={styles.profileContainer}>
          <Image
            className={styles.profileImage}
            src={currentUser?.pictureUrl || "/default-profile.png"}
            alt="profile"
            width={150}
            height={150}
          />
          <h1 className={styles.profileName}>{currentUser?.name}</h1>
        </div>
      </div>

      <div className={styles.albumTopContentContainer}>
        <div className={styles.albumTopContent}>
          <textarea
            className={styles.albumTextarea}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
          />
          <textarea
            className={styles.albumTextarea}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요"
          />
          <hr />
          <div className={styles.buttonRow}>
            <div className={styles.albumButtonContainer}>
              <input
                type="file"
                id="imageUpload"
                onChange={handleImageUpload}
                accept="image/*"
                multiple
                style={{ display: "none" }}
                disabled={selectedImages.length >= 4}
              />
              <label htmlFor="imageUpload" className={styles.albumButtonCamera}>
                📷 사진 업로드 ({selectedImages.length}/4)
              </label>
            </div>
            <div>
              <button
                className={styles.albumButtonCancel}
                onClick={() => {
                  setTitle("");
                  setContent("");
                  setSelectedFiles([]);
                  setSelectedImages([]);
                }}
              >
                취소
              </button>
              <button
                className={styles.albumButtonSubmit}
                onClick={handleSubmit}
              >
                작성하기
              </button>
            </div>
          </div>
          {selectedImages.length > 0 && (
            <div className={styles.selectedImagesContainer}>
              {selectedImages.map((image, index) => (
                <div key={index} className={styles.selectedImageWrapper}>
                  <Image
                    src={image}
                    alt={`Selected ${index + 1}`}
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
          {boards.map((board) => (
            <div key={board.id} className={styles.albumBoard}>
              <div className={styles.boardContentContainer}>
                <div className={styles.boardContent}>
                  <div className={styles.boardProfileContainer}>
                    <Image
                      src={board.user.pictureUrl || "/default-profile.png"}
                      alt="Profile"
                      width={50}
                      height={50}
                      className={styles.boardProfileImage}
                    />
                    <p className={styles.boardProfileName}>{board.user.name}</p>
                    {isOwner(board.user.socialId || board.user.id) && (
                      <div className={styles.albumItemActions}>
                        <button
                          onClick={() => {
                            handleEditMode(board);
                          }}
                        >
                          수정
                        </button>
                        <button onClick={() => handleDelete(board.id)}>
                          삭제
                        </button>
                      </div>
                    )}
                  </div>
                  {editingBoard === board.id ? (
                    <div>
                      <textarea
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className={styles.albumTextarea}
                        placeholder="제목을 입력하세요"
                      />
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className={styles.albumTextarea}
                        placeholder="내용을 입력하세요"
                      />
                      <div className={styles.buttonRow}>
                        <div className={styles.albumButtonContainer}>
                          <input
                            type="file"
                            id={`imageUploadEdit-${board.id}`}
                            onChange={handleEditImageUpload}
                            accept="image/*"
                            multiple
                            style={{ display: "none" }}
                            disabled={editSelectedImages.length >= 4}
                          />
                          <label
                            htmlFor={`imageUploadEdit-${board.id}`}
                            className={styles.albumButtonCamera}
                          >
                            📷 사진 수정 ({editSelectedImages.length}/4)
                          </label>
                        </div>
                        <div>
                          <button
                            className={styles.albumButtonSubmit}
                            onClick={() => handleUpdate(board.id)}
                          >
                            수정 완료
                          </button>
                          <button
                            className={styles.albumButtonCancel}
                            onClick={() => {
                              setEditingBoard(null);
                              setEditTitle("");
                              setEditContent("");
                              setEditSelectedFiles([]);
                              setEditSelectedImages([]);
                            }}
                          >
                            취소
                          </button>
                        </div>
                      </div>
                      {editSelectedImages.length > 0 && (
                        <div className={styles.selectedImagesContainer}>
                          {editSelectedImages.map((image, index) => (
                            <div
                              key={index}
                              className={styles.selectedImageWrapper}
                            >
                              <Image
                                src={image}
                                alt={`Selected ${index + 1}`}
                                width={100}
                                height={100}
                                className={styles.selectedImage}
                              />
                              <button
                                className={styles.removeImageButton}
                                onClick={() => removeEditImage(index)}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <h3>{board.title}</h3>
                      <p>{board.content}</p>
                      {board.picture_urls && board.picture_urls.length > 0 && (
                        <div className={styles.boardContentImageContainer}>
                          <div className={styles.imageRow}>
                            {board.picture_urls
                              .slice(
                                currentImageIndexes[board.id] || 0,
                                (currentImageIndexes[board.id] || 0) + 2
                              )
                              .map((url, index) => (
                                <Image
                                  key={index}
                                  src={url}
                                  alt={`Board image ${index + 1}`}
                                  width={400}
                                  height={400}
                                  className={styles.boardContentImage}
                                />
                              ))}
                          </div>
                          {board.picture_urls.length > 2 && (
                            <>
                              {(currentImageIndexes[board.id] || 0) > 0 && (
                                <button
                                  className={`${styles.imageNavButton} ${styles.prev}`}
                                  onClick={() => handlePrevImage(board.id)}
                                >
                                  ←
                                </button>
                              )}
                              {(currentImageIndexes[board.id] || 0) <
                                board.picture_urls.length - 2 && (
                                <button
                                  className={`${styles.imageNavButton} ${styles.next}`}
                                  onClick={() =>
                                    handleNextImage(
                                      board.id,
                                      board.picture_urls.length
                                    )
                                  }
                                >
                                  →
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className={styles.boardBottomContainer}>
                  <button
                    className={styles.boardMoreComment}
                    onClick={() => toggleComments(board.id)}
                  >
                    {showComments[board.id] ? "댓글 닫기" : "댓글 보기"}
                  </button>

                  {showComments[board.id] && comments[board.id] && (
                    <>
                      {comments[board.id].data.map((comment) => (
                        <div
                          key={comment.id}
                          className={styles.boardCommentContainer}
                        >
                          <Image
                            src={
                              comment.user.pictureUrl || "/default-profile.png"
                            }
                            alt="Profile"
                            width={50}
                            height={50}
                            className={styles.boardCommentProfileImage}
                          />
                          <div className={styles.boardCommentContentWrap}>
                            <p className={styles.boardCommentName}>
                              {comment.user.name}
                            </p>
                            {editCommentId === comment.id ? (
                              <div>
                                <input
                                  type="text"
                                  value={editCommentContent}
                                  onChange={(e) =>
                                    setEditCommentContent(e.target.value)
                                  }
                                  className={styles.commentEditInput}
                                />
                                <button
                                  onClick={() =>
                                    handleCommentUpdate(board.id, comment.id)
                                  }
                                  className={styles.commentUpdateButton}
                                >
                                  수정
                                </button>
                                <button
                                  onClick={() => {
                                    setEditCommentId(null);
                                    setEditCommentContent("");
                                  }}
                                  className={styles.commentCancelButton}
                                >
                                  취소
                                </button>
                              </div>
                            ) : (
                              <>
                                <p className={styles.boardCommentContent}>
                                  {comment.content}
                                </p>
                                {isOwner(
                                  comment.user.socialId || comment.user.id
                                ) && (
                                  <div className={styles.commentActions}>
                                    <button
                                      onClick={() => {
                                        setEditCommentId(comment.id);
                                        setEditCommentContent(comment.content);
                                      }}
                                      className={styles.commentEditButton}
                                    >
                                      수정
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleCommentDelete(
                                          board.id,
                                          comment.id
                                        )
                                      }
                                      className={styles.commentDeleteButton}
                                    >
                                      삭제
                                    </button>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                      <div className={styles.commentInputContainer}>
                        <input
                          type="text"
                          value={commentInputs[board.id] || ""}
                          onChange={(e) =>
                            handleCommentInputChange(board.id, e.target.value)
                          }
                          placeholder="댓글을 입력하세요"
                          className={styles.commentInput}
                        />
                        <button
                          onClick={() => handleCommentSubmit(board.id)}
                          className={styles.commentSubmitButton}
                        >
                          작성
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
