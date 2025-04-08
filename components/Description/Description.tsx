import React from "react";
import Image from "next/image";
import styles from "./Description.module.css";

interface Host {
  id: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  birthday: string | null;
  gender: string | null;
  pictureUrl: string;
  description: string | null;
  role: string;
  socialProvider: string;
  socialId: string;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
}

interface Content {
  id: number; // 아이디
  title: string; // 제목
  description: string; // 설명
  pictureUrl: string; // 이미지
  profileImg: string; // 프로필 이미지
  username: string; // 유저 이름
  name: string; // 이름
  address: string; // 주소
  startDate: string; // 시작일
  // tag?: string[];
  maxParticipants: number; // 최대 참여자 수
  gender: string; // 성별
  minAge: number; // 최소 나이
  maxAge: number; // 최대 나이
  latitude: string; // 위도
  longitude: string; // 경도
  price: number; // 가격
  createdAt: string; // 생성일
  isActive: number; // 활성화 여부
  hostId: Host; // 호스트 아이디
}

interface DescriptionProps {
  content: Content;
  onClose: () => void;
  link: boolean;
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
          alt={`${content.hostId.name}의 이미지`}
          width={1000}
          height={1000}
          className={styles.modalImage}
        />
        <div className={styles.modalContentContainer}>
          <h2 className={styles.modalContentTitle}>{content.title}</h2>
          <p className={styles.modalContentPerson}>
            최대 인원 {content.maxParticipants}명
          </p>
          <div className={styles.modalContentProfileWrapper}>
            <Image
              src={content.hostId.pictureUrl || defaultImage}
              alt={`${content.hostId.name}의 프로필 이미지`}
              width={100}
              height={100}
              className={styles.modalContentProfileImg}
            />
            <p className={styles.modalContentUsername}>{content.hostId.name}</p>
            <p className={styles.modalContentDate}>{content.startDate}</p>
          </div>
          <div className={styles.modalContentWrapper}>
            <p className={styles.modalContentAddress}>{content.address}</p>
            <h2 className={styles.modalContentDescriptionTitle}>내용</h2>
            <hr />
            <p className={styles.modalContentDescription}>
              {content.description}
            </p>
          </div>
          <div className={styles.modalTags}>
            <p className={styles.tag}>
              {content.gender === "M"
                ? "남자"
                : content.gender === "F"
                ? "여자"
                : "무관"}
            </p>
            <p className={styles.tag}>
              {content.minAge} ~ {content.maxAge}세
            </p>
            <p className={styles.tag}>{content.price}원</p>
          </div>
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
