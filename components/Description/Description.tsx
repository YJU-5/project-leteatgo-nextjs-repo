import React from "react";
import Image from "next/image";
import styles from "./Description.module.css";

interface DescriptionProps {
  content: Content;
  onClose: () => void;
}

interface Content {
  id: number;
  img: string;
  profileImg: string;
  username: string;
  name: string;
  address: string;
  date: string;
  tag: string[];
  person: number;
}

interface DescriptionProps {
  content: Content;
  onClose: () => void;
}

export default function Description({ content, onClose }: DescriptionProps) {
  const defaultImage = "/default-image.jpg"; // 기본 이미지 경로 설정

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          ✕
        </button>
        <Image
          src={content.img || defaultImage}
          alt={`${content.name}의 이미지`}
          width={1000}
          height={1000}
          className={styles.modalImage}
        />
        <div className={styles.modalContentContainer}>
          <h2 className={styles.modalContentTitle}>{content.name}</h2>
          <p className={styles.modalContentPerson}>{content.person}명</p>
          <div className={styles.modalContentProfileWrapper}>
            <Image
              src={content.profileImg || defaultImage}
              alt={`${content.username}의 프로필 이미지`}
              width={100}
              height={100}
              className={styles.modalContentProfileImg}
            />
            <p className={styles.modalContentUsername}>{content.username}</p>
            <p className={styles.modalContentDate}>{content.date}</p>
          </div>
          <div className={styles.modalContentWrapper}>
            <p className={styles.modalContentAddress}>{content.address}</p>
          </div>
          <div className={styles.modalTags}>
            {content.tag.map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
