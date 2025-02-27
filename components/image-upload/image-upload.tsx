import { useState, ChangeEvent } from "react";
import styles from "./image-upload.module.css";

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
    <div className={styles.upload_container}>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageChange}
        className={styles.file_input}
      />
      <div className={styles.preview_container}>
        {selectedImages.map((image, index) => (
          <div key={index} className={styles.preview_item}>
            <img
              src={image.preview}
              alt={`Preview ${index + 1}`}
              className={styles.preview_image}
            />
            <button
              onClick={() => handleRemoveImage(index)}
              className={styles.remove_button}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
