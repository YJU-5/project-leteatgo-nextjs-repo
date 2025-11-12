import { handleApiError, getToken } from "./authUtils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface Board {
  id: number;
  title: string;
  content: string;
  picture_urls: string[];
  hits: number;
  like: number;
  isNotice: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    pictureUrl: string;
    email: string;
    socialId?: string;
  };
}

export interface CreateBoardDto {
  title: string;
  content: string;
  files?: File[];
}

export interface UpdateBoardDto {
  title?: string;
  content?: string;
  files?: File[];
}

// 게시글 목록 조회
export const getAllBoards = async (): Promise<Board[]> => {
  try {
    const token = getToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/board`, {
      headers,
    });

    if (!response.ok) {
      throw { status: response.status, response };
    }

    return response.json();
  } catch (error) {
    throw await handleApiError(error);
  }
};

// 게시글 상세 조회
export const getBoard = async (id: number): Promise<Board> => {
  try {
    const token = getToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/board/${id}`, {
      headers,
    });

    if (!response.ok) {
      throw { status: response.status, response };
    }

    return response.json();
  } catch (error) {
    throw await handleApiError(error);
  }
};

// 게시글 작성
export const createBoard = async (data: CreateBoardDto): Promise<Board> => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("로그인이 필요한 서비스입니다.");
    }

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    if (data.files) {
      data.files.forEach((file) => {
        formData.append("files", file);
      });
    }

    const response = await fetch(`${API_URL}/board`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw { status: response.status, response };
    }

    return response.json();
  } catch (error) {
    // handleApiError를 사용하여 일관된 에러 처리
    throw await handleApiError(error);
  }
};

// 게시글 수정
export const updateBoard = async (
  id: number,
  data: UpdateBoardDto
): Promise<Board> => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("로그인이 필요한 서비스입니다.");
    }

    const formData = new FormData();
    if (data.title) {
      formData.append("title", data.title);
    }
    if (data.content) {
      formData.append("content", data.content);
    }
    if (data.files) {
      data.files.forEach((file) => {
        formData.append("files", file);
      });
    }

    // FormData와 함께 사용할 때는 Content-Type 헤더를 설정하지 않음
    const response = await fetch(`${API_URL}/board/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw { status: response.status, response };
    }

    return response.json();
  } catch (error) {
    throw await handleApiError(error);
  }
};

// 게시글 삭제
export const deleteBoard = async (id: number): Promise<void> => {
  try {
    const token = getToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/board/${id}`, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      throw { status: response.status, response };
    }
  } catch (error) {
    throw await handleApiError(error);
  }
};