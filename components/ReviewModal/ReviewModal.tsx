import Image from "next/image";
import styles from "./ReviewModal.module.css"
import { useState } from "react";


interface Review {
  id: string;
  image: string;
  title: string;
  date: string;
  reviews: number;
  completed: boolean;
}

interface ReviewModalProps {
  review: Review;
  onClose: () => void;
}

const ratingFields = ["친절함", "유머성", "요리", "적극성", "준수성"] as const;
type RatingField = typeof ratingFields[number];

export default function ReviewModal({ review, onClose }: ReviewModalProps) {

  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [ratings, setRatings] = useState<Record<RatingField, number>>({
    친절함: 0,
    유머성: 0,
    요리: 0,
    적극성: 0,
    준수성: 0,
  });

  const [content, setContent] = useState("");

  // 별점 클릭 핸들러
  const handleStarClick = (field: RatingField, star: number) => {
    setRatings((prev) => ({ ...prev, [field]: star }));
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
    <div className={styles.modalContainer}>
      <div className={styles.modal}>
        <h2 className={styles.title}>{review.title}</h2>

        <div className={styles.top}>
          <div className={styles.ratingSection}>
            {/* 별점 항목들 */}
            {ratingFields.map((field) => (
              <div key={field} className={styles.ratingRow}>
                <label className={styles.label}>{field}:</label>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`${styles.star} ${star <= ratings[field] ? styles.active : ""}`}
                    onClick={() => handleStarClick(field, star)}
                  >
                    ★
                  </span>
                ))}
              </div>
            ))}
          </div>


          {/* 텍스트 내용 입력 */}
          <div className={styles.textareaSection}>
            <label>내용:</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={styles.textarea}
            />
          </div>
        </div>


        <div className={styles.reivewRow}>
            <input
              type="file"
              id="imageUpload"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
            <button
              className={`${styles.reivewButton} ${styles.reivewButtonCamera}`}
              onClick={() => document.getElementById("imageUpload")?.click()}
              disabled={selectedImages.length >= 4}
            >
            사진: 사진 올리기 ({selectedImages.length}/4)
            </button>
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



        {/* 하단 버튼 */}
        <div className={styles.buttonGroup}>
          <button onClick={onClose} className={styles.cancelButton}>취소</button>
          <button
            className={styles.submitButton}
            onClick={() => {
              console.log("제출할 데이터:", {
                ratings,
                content,
                reviewId: review.id,
              });
              onClose();
            }}
          >
            작성
          </button>
        </div>
      </div>
    </div>
  )
}