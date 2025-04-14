import { User } from "./user";
import { Comment } from "./comment";

export interface Board {
  id: number;
  title: string;
  content: string;
  imageUrls: string[];
  like: number;
  hits: number;
  isNotice: boolean;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  comments: Comment[];
  likes: Like[];
}

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    name: string;
    picture_url: string;
  };
}

export interface Like {
  id: number;
  createdAt: string;
  user: {
    id: number;
    name: string;
    picture_url: string;
  };
}

export interface CreateBoardDto {
  title: string;
  content: string;
  isNotice?: boolean;
  file?: File;
}

export interface CreateCommentDto {
  content: string;
  boardId: number;
}

export interface UpdateBoardDto extends Partial<CreateBoardDto> {}
