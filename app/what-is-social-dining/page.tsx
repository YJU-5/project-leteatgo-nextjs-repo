import styles from "./page.module.css";
import Image from "next/image";

export default function WhatIsSocialDining() {
  return (
    <div className={styles.whatIsSocialDining}>
      <Image
        src="/restaurant.jpg"
        alt="restaurant"
        width={1728}
        height={1023}
        className={styles.whatIsSocialDiningImage}
        priority
      />
      <div className={styles.whatIsSocialDiningTextContainer}>
        <h1
          className={`${styles.whatIsSocialDiningTitle} ${styles.upContent} ${styles.delay1}`}
        >
          소셜다이닝이란?
        </h1>
        <p
          className={`${styles.whatIsSocialDiningText} ${styles.upContent} ${styles.delay2}`}
        >
          소셜다이닝(Social Dining)은 공통의 관심사를 가진 사람들이 모여 식사를
          즐기고 이야기를 나누는 문화를 의미합니다. &apos;사회적인&apos;을
          의미하는 Social과 &apos;식사&apos;를 뜻하는 Dining을 합쳐서 부르는
          말입니다.
        </p>
        <p
          className={`${styles.whatIsSocialDiningText} ${styles.upContent} ${styles.delay3}`}
        >
          소셜다이닝은 단순히 끼니를 해결하는 것 이상으로, 사람들과 교류하며
          식사를 즐기고 새로운 인연을 만들 수 있다는 장점 이 있습니다. 또한,
          취미를 함께 즐기거나 타인의 정보를 배울 수도 있습니다.
        </p>
        <ul>
          <p
            className={`${styles.whatIsSocialDiningText} ${styles.upContent} ${styles.delay4}`}
          >
            소셜다이닝의 예로는 다음과 같은 것들이 있습니다.
          </p>
          <li className={`${styles.upContent} ${styles.delay5}`}>
            요리를 배우고 싶은 사람들이 유명 요리 선생님의 집에 모여 함께 요리를
            배우고 만든 음식을 나누어 먹는 것
          </li>
          <li className={`${styles.upContent} ${styles.delay5}`}>
            레스토랑 창업을 고려하고 있는 예비 창업자나 아마추어 쉐프가 자신의
            요리를 사람들에게 선보이는 기회를 마련하는 것
          </li>
        </ul>
      </div>
    </div>
  );
}
