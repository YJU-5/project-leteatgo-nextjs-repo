"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "../page.module.css";
import { createBoard } from "../../../api/board";
import type { Board } from "../../../types/board";

interface CreateBoardProps {
  onBoardCreated: (newBoard: Board) => void;
}

export default function CreateBoard({ onBoardCreated }: CreateBoardProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      const newBoard = await createBoard({
        title: title || content.slice(0, 50),
        content,
        file: selectedFile || undefined,
      });

      onBoardCreated(newBoard);
      setTitle("");
      setContent("");
      setSelectedFile(null);
    } catch (err: any) {
      console.error("게시물 작성 실패:", err);
      alert(err.message || "게시물 작성에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.albumTopContentContainer}>
      <div className={styles.albumTopContent}>
        <input
          type="text"
          className={styles.albumTitleInput}
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className={styles.albumTextarea}
          placeholder="글을 작성해보세요!"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <hr />
        <div className={styles.buttonRow}>
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
          <button
            className={`${styles.albumButton} ${styles.albumButtonCamera}`}
            onClick={() => document.getElementById("imageUpload")?.click()}
            disabled={isSubmitting}
          >
            <Image src="/camera.png" alt="camera" width={30} height={30} />
            사진 올리기 {selectedFile ? "(1)" : "(0)"}
          </button>
          <div className={styles.albumButtonContainer}>
            <button
              className={`${styles.albumButton} ${styles.albumButtonCancel}`}
              onClick={() => {
                setTitle("");
                setContent("");
                setSelectedFile(null);
              }}
              disabled={isSubmitting}
            >
              취소
            </button>
            <button
              className={`${styles.albumButton} ${styles.albumButtonSubmit}`}
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "작성 중..." : "올리기"}
            </button>
          </div>
        </div>
        {selectedFile && (
          <div className={styles.selectedImagesContainer}>
            <div className={styles.selectedImageWrapper}>
              <Image
                src={URL.createObjectURL(selectedFile)}
                alt="선택된 이미지"
                width={100}
                height={100}
                className={styles.selectedImage}
              />
              <button
                className={styles.removeImageButton}
                onClick={() => setSelectedFile(null)}
                disabled={isSubmitting}
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
