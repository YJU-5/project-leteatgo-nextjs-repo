import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.home}>
      <Image
        src="/home/socialhome.png"
        alt="socialhome"
        width={1728}
        height={623}
        className={styles.home_image}
      />
      <div
        className={styles.text_container_1}
        style={{
          whiteSpace: "pre-wrap" /* 단어별 줄바꿈 적용 */,
          wordBreak: "keep-all" /* 한글의 경우 단어 단위로 줄바꿈 */,
        }}
      >
        <h1>여러 사람들과 함께 식사 어떠세요?</h1>
        <p>나이와 성별을 구분하지 않고 모두 식사를 나누며 대화해보세요.</p>
      </div>
      <div
        className={styles.text_container_2}
        style={{
          whiteSpace: "pre-wrap" /* 단어별 줄바꿈 적용 */,
          wordBreak: "keep-all" /* 한글의 경우 단어 단위로 줄바꿈 */,
        }}
      >
        <h1>일상에서 지쳤을 때, 새로운 일상을 만들어 보세요.</h1>
        <p>새로움이 당신을 기다리고 있습니다.</p>
      </div>
    </div>
  );
}
