import { useDaumPostcodePopup } from "react-daum-postcode";
import styles from "./postcode.module.css";
import { useState } from "react";

interface PostcodeProps {
  onComplete: (address: string) => void;
}

export default function Postcode({ onComplete }: PostcodeProps) {
  const open = useDaumPostcodePopup();
  const [selectedAddress, setSelectedAddress] = useState<string>("");

  const handleClick = () => {
    open({
      onComplete: (data) => {
        // 도로명 주소 우선, 없으면 지번 주소 사용
        const address = data.roadAddress || data.jibunAddress;
        setSelectedAddress(address); // 선택한 주소 저장
        onComplete(address);
      },
      width: 500,
      height: 600,
    });
  };

  return (
    <input
      type="text"
      className={styles.input_2}
      onClick={handleClick}
      readOnly
      placeholder="주소 검색"
      value={selectedAddress} // 선택한 주소 표시
    />
  );
}
