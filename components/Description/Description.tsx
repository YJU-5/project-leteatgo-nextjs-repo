import React from "react";
import Image from "next/image";
import styles from "./Description.module.css";

interface DescriptionProps {
  content: Content;
  onClose: () => void;
  link: boolean;
}

interface Content {
  id: number;
  title: string;
  description: string;
  pictureUrl: string;
  profileImg: string;
  username: string;
  name: string;
  address: string;
  startDate: string;
  maxParticipants: number;
  gender: string;
  minAge: number;
  maxAge: number;
  latitube: string;
  longitude: string;
  maxPrice: number;
  minPrice: number;
  createdAt: string;
  isActive: number;
}

interface DescriptionProps {
  content: Content;
  onClose: () => void;
}

export default function Description({
  content,
  onClose,
  link,
}: DescriptionProps) {
  const defaultImage = "/foods/kr-food.jpg"; // 기본 이미지 경로 설정

  const handleJoin = () => {
    console.log("참여");
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          ✕
        </button>
        <Image
          src={content.pictureUrl || defaultImage}
          alt={`${content.name}의 이미지`}
          width={1000}
          height={1000}
          className={styles.modalImage}
        />
        <div className={styles.modalContentContainer}>
          <h2 className={styles.modalContentTitle}>{content.title}</h2>
          <p className={styles.modalContentPerson}>
            최대 {content.maxParticipants}명
          </p>
          <div className={styles.modalContentProfileWrapper}>
            <Image
              src={content.profileImg || defaultImage}
              alt={`${content.username}의 프로필 이미지`}
              width={100}
              height={100}
              className={styles.modalContentProfileImg}
            />
            <p className={styles.modalContentUsername}>{content.username}</p>
            <p className={styles.modalContentDate}>{content.startDate}</p>
          </div>
          <div className={styles.modalContentWrapper}>
            <p className={styles.modalContentAddress}>{content.address}</p>
            <p className={styles.modalContentDescription}>
              {content.description}
            </p>
          </div>
          {/* <div className={styles.modalTags}>
            <p className={styles.contentTag}>
              {(content.tag || []).map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </p>
          </div> */}
          {link ? (
            <button className={styles.modalContentButton} onClick={handleJoin}>
              참여
            </button>
          ) : (
            <button className={styles.modalContentButton}>확인</button>
          )}
        </div>
      </div>
    </div>
  );
}
