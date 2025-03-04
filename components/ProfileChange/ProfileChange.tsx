import React, { useState, useRef } from "react";
import styles from "./ProfileChange.module.css";
import Image from "next/image";

interface ProfileChangeProps {
  currentProfileImage?: string;
  currentBackgroundImage?: string;
  onProfileImageChange?: (file: File) => void;
  onBackgroundImageChange?: (file: File) => void;
}

const ProfileChange: React.FC<ProfileChangeProps> = ({
  currentProfileImage = "/default-profile.png",
  currentBackgroundImage = "/default-background.png",
  onProfileImageChange,
  onBackgroundImageChange,
}) => {
  const [previewProfileImage, setPreviewProfileImage] =
    useState<string>(currentProfileImage);
  const [previewBackgroundImage, setPreviewBackgroundImage] = useState<string>(
    currentBackgroundImage
  );
  const profileFileInputRef = useRef<HTMLInputElement>(null);
  const backgroundFileInputRef = useRef<HTMLInputElement>(null);

  const handleProfileImageClick = () => {
    profileFileInputRef.current?.click();
  };

  const handleBackgroundImageClick = () => {
    backgroundFileInputRef.current?.click();
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setPreview: (preview: string) => void,
    onImageChange?: (file: File) => void
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        onImageChange?.(file);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.backgroundWrapper}
        onClick={handleBackgroundImageClick}
      >
        <Image
          src={previewBackgroundImage}
          alt="배경 이미지"
          className={styles.backgroundImage}
          width={200}
          height={200}
        />
        <div className={styles.backgroundOverlay}>
          <span>배경 이미지 변경</span>
        </div>
      </div>

      <div className={styles.profileSection}>
        <div className={styles.profileContainer}>
          <div
            className={styles.imageWrapper}
            onClick={handleProfileImageClick}
          >
            <Image
              src={previewProfileImage}
              alt="프로필 이미지"
              className={styles.profileImage}
              width={200}
              height={200}
            />
            <div className={styles.overlay}>
              <span>이미지 변경</span>
            </div>
          </div>
        </div>
      </div>

      <input
        type="file"
        ref={profileFileInputRef}
        onChange={(e) =>
          handleFileChange(e, setPreviewProfileImage, onProfileImageChange)
        }
        accept="image/*"
        className={styles.fileInput}
        style={{ display: "none" }}
      />
      <input
        type="file"
        ref={backgroundFileInputRef}
        onChange={(e) =>
          handleFileChange(
            e,
            setPreviewBackgroundImage,
            onBackgroundImageChange
          )
        }
        accept="image/*"
        className={styles.fileInput}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default ProfileChange;
