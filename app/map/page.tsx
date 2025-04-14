import styles from "./page.module.css";

export default function Map() {
  return (
    <div>
      <h1>지도 페이지</h1>
      <p>아래에서 기본 지도와 필터링 페이지를 선택하세요.</p>
      <ul>
        <li><a href="/map/kakao">기본 지도</a></li>
        <li><a href="/map/filter">필터링 지도</a></li>
      </ul>
    </div>
  );
}
