import { getAuthHeaders, handleApiError, checkAuth } from "./authUtils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    pictureUrl: string;
    email: string;
  };
}

// 댓글 목록 조회
export const getComments = async (boardId: number): Promise<Comment[]> => {
  try {
    const response = await fetch(`${API_URL}/comment/${boardId}`, {
      headers: getAuthHeaders(),
      credentials: "include",
    });

    if (!response.ok) {
      throw { status: response.status, response };
    }

    return await response.json();
  } catch (error) {
    throw await handleApiError(error);
  }
};

// 댓글 작성
export const createComment = async (
  boardId: number,
  content: string
): Promise<Comment> => {
  if (!checkAuth()) {
    throw new Error("로그인이 필요합니다.");
  }

  try {
    const response = await fetch(`${API_URL}/comment/${boardId}`, {
      method: "POST",
      headers: getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "댓글 작성에 실패했습니다.");
    }

    return await response.json();
  } catch (error) {
    throw await handleApiError(error);
  }
};

export interface UpdateCommentDto {
  content: string;
}

// 댓글 수정
export const updateComment = async (
  commentId: number,
  content: string
): Promise<Comment> => {
  if (!checkAuth()) {
    throw new Error("로그인이 필요합니다.");
  }

  try {
    const response = await fetch(`${API_URL}/comment/${commentId}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "댓글 수정에 실패했습니다.");
    }

    return await response.json();
  } catch (error) {
    throw await handleApiError(error);
  }
};

// 댓글 삭제
export const deleteComment = async (commentId: number): Promise<void> => {
  if (!checkAuth()) {
    throw new Error("로그인이 필요합니다.");
  }

  try {
    const response = await fetch(`${API_URL}/comment/${commentId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
      credentials: "include",
    });

    if (!response.ok) {
      throw { status: response.status, response };
    }
  } catch (error) {
    throw await handleApiError(error);
  }
};
