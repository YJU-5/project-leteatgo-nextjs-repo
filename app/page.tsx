"use client";

import Image from "next/image";
import styles from "./page.module.css";
import ImageSlider from "@/components/ImageSlider/ImageSlider";
import ContentSlider from "@/components/ContentSlider/ContentSlider";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/Store";
import { login } from "@/store/UserSlice";

// 별점도 있어야할 듯
interface Review {
  id: number;
  pictureUrl: string;
  description: string;
  comment: string;
}

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

export default function Home() {
  const userState = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [contents, setContents] = useState<Content[]>([]);

  // 로컬 스토리지에서 사용자 정보를 가져와 Redux 스토어에 저장
  useEffect(() => {
    const storedToken = localStorage.getItem("jwtToken");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser && !userState.jwtToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        dispatch(login({ jwtToken: storedToken, user: parsedUser }));
        console.log("로컬 스토리지에서 사용자 정보를 복원했습니다.");
      } catch (error) {
        console.error("사용자 정보 파싱 오류:", error);
      }
    }
  }, [dispatch, userState.jwtToken]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/review`
        );
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error("리뷰 데이터를 가져오는데 실패했습니다.", error);
      }
    };

    const fetchContents = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/chat-room`,
          {
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setContents(data);
      } catch (error) {
        console.error("소셜다이닝 데이터를 가져오는데 실패했습니다:", error);
        // 에러 발생 시 빈 배열 설정
        setContents([]);
      }
    };

    const fetchUser = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user`,
          {
            credentials: "include",
            headers: {
              Authorization: `Bearer ${userState.jwtToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const userData = await response.json();

        // API에서 가져온 사용자 정보로 Redux 스토어 업데이트
        if (userData && userState.jwtToken) {
          dispatch(login({ jwtToken: userState.jwtToken, user: userData }));
        }
      } catch (error) {
        console.error("유저 데이터를 가져오는데 실패했습니다:", error);
      }
    };

    fetchReviews();
    fetchContents();

    // 토큰이 있을 때만 사용자 정보 가져오기
    if (userState.jwtToken) {
      fetchUser();
    }
  }, [dispatch, userState.jwtToken]);

  return (
    <div className={styles.home}>
      <div className={styles.homeBackground}>
        <Image
          src="/home/socialhome.png"
          alt="socialhome"
          width={4000}
          height={2000}
          className={styles.homeImage}
        />
      </div>
      <div className={styles.textContainer1}>
        <h1 className={`${styles.upContent} ${styles.delay1}`}>
          여러 사람들과
          <br />
          함께 하는 식사 자리는 어떠세요?
        </h1>
        <p className={`${styles.upContent} ${styles.delay2}`}>
          나이와 성별을 구분하지 않고 모두 식사를 나누며 대화해보세요.
        </p>
      </div>
      <div className={styles.textContainer2}>
        <h1 className={`${styles.upContent} ${styles.delay2}`}>
          일상에서 지쳤을 때,
          <br />
          새로운 일상을 만들어 보세요.
        </h1>
        <p className={`${styles.upContent} ${styles.delay3}`}>
          새로운 사람들과 새로운 장소에서의 만남이 당신을 기다리고 있습니다.
        </p>
      </div>
      <div className={styles.frontContainer}>
        <div className={styles.popularSocialDiningContainer}>
          <h1 className={`${styles.upContent} ${styles.delay4}`}>
            인기 소셜다이닝 리스트
          </h1>
          <ContentSlider contents={contents} link={true} />
        </div>
        <div className={styles.popularSocialDiningContainer}>
          <h1 className={`${styles.upContent} ${styles.delay5}`}>
            소셜다이닝 후기
          </h1>
          <ImageSlider contents={reviews} />
        </div>

        <hr className={styles.hr} />
        <footer>
          <p>영진전문대학교 JI-A 5조</p>
          <p>경상북도 칠곡군 지천면 금송로 60</p>
          <p>cjhms002@g.yju.ac.kr</p>
          <p>010-9278-1278</p>
        </footer>
      </div>
    </div>
  );
}
