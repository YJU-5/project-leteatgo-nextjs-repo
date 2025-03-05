import { useState, ChangeEvent } from "react";
import styles from "./ImageUpload.module.css";
import Image from "next/image";

interface ImageUploadProps {
  onImageSelect: (files: File[]) => void;
}

export default function ImageUpload({ onImageSelect }: ImageUploadProps) {
  const [selectedImages, setSelectedImages] = useState<
    { file: File; preview: string }[]
  >([]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setSelectedImages((prev) => [...prev, ...newImages]);
    onImageSelect(newImages.map((img) => img.file));
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview); // 메모리 해제
      newImages.splice(index, 1);
      onImageSelect(newImages.map((img) => img.file));
      return newImages;
    });
  };

  return (
    <div className={styles.uploadContainer}>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageChange}
        className={styles.fileInput}
      />
      <div className={styles.previewContainer}>
        {selectedImages.map((image, index) => (
          <div key={index} className={styles.previewItem}>
            <Image
              src={image.preview}
              alt={`Preview ${index + 1}`}
              className={styles.previewImage}
              width={150}
              height={150}
            />
            <button
              onClick={() => handleRemoveImage(index)}
              className={styles.removeButton}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
