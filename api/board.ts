import { Board, CreateBoardDto, CreateCommentDto } from "../types/board";

const API_URL = "http://localhost:3001"; // 백엔드 서버 URL

// Helper function to get headers with token
const getHeaders = (isFormData = false) => {
  const token = localStorage.getItem("accessToken"); // jwtToken -> accessToken으로 변경
  const headers: Record<string, string> = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};

// 모든 게시물 조회
export const getAllBoards = async (): Promise<Board[]> => {
  try {
    console.log("Fetching boards from:", `${API_URL}/board`);
    const response = await fetch(`${API_URL}/board`, {
      method: "GET",
      headers: getHeaders(),
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Server response:", errorData);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Received boards:", data);
    return data;
  } catch (error) {
    console.error("Error in getAllBoards:", error);
    throw error;
  }
};

// 게시물 생성
export const createBoard = async (data: CreateBoardDto): Promise<Board> => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("content", data.content);
  if (data.isNotice !== undefined) {
    formData.append("isNotice", String(data.isNotice));
  }
  if (data.file) {
    formData.append("file", data.file);
  }

  try {
    const response = await fetch(`${API_URL}/board`, {
      method: "POST",
      body: formData,
      headers: getHeaders(true),
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Server response:", errorData);
      throw new Error("Failed to create board");
    }

    return response.json();
  } catch (error: any) {
    console.error("Create board error:", error);
    throw new Error(error.message || "Failed to create board");
  }
};

// 특정 게시물 조회
export const getBoard = async (id: number): Promise<Board> => {
  const response = await fetch(`${API_URL}/board/${id}`, {
    method: "GET",
    credentials: "include",
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error("Server response:", errorData);
    throw new Error("Failed to fetch board");
  }
  return response.json();
};

// 게시물 수정
export const updateBoard = async (
  id: number,
  data: Partial<CreateBoardDto>
): Promise<Board> => {
  const formData = new FormData();
  if (data.title) formData.append("title", data.title);
  if (data.content) formData.append("content", data.content);
  if (data.isNotice !== undefined) {
    formData.append("isNotice", String(data.isNotice));
  }
  if (data.file) {
    formData.append("file", data.file);
  }

  const response = await fetch(`${API_URL}/board/${id}`, {
    method: "PUT",
    body: formData,
    credentials: "include",
    headers: getHeaders(true),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error("Server response:", errorData);
    throw new Error("Failed to update board");
  }

  return response.json();
};

// 게시물 삭제
export const deleteBoard = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/board/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error("Server response:", errorData);
    throw new Error("Failed to delete board");
  }
};

// 댓글 생성
export const createComment = async (
  data: CreateCommentDto
): Promise<Comment> => {
  const response = await fetch(`${API_URL}/comment`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error("Server response:", errorData);
    throw new Error("Failed to create comment");
  }

  return response.json();
};
