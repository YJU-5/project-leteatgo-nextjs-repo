import { useDaumPostcodePopup } from "react-daum-postcode";
import styles from "./Postcode.module.css";
import { useState } from "react";

interface PostcodeProps {
  onComplete: (
    address: string,
    coordinates?: { lat: number; lng: number }
  ) => void;
}

interface KakaoGeocodeResponse {
  documents: {
    address: {
      x: string;
      y: string;
    };
  }[];
}

export default function Postcode({ onComplete }: PostcodeProps) {
  const open = useDaumPostcodePopup();
  const [selectedAddress, setSelectedAddress] = useState<string>("");

  const convertAddressToCoordinates = async (address: string) => {
    try {
      const response = await fetch(
        `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(
          address
        )}`,
        {
          headers: {
            Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}`,
          },
        }
      );

      if (!response.ok) {
        return null;
      }

      const data: KakaoGeocodeResponse = await response.json();
      const { x, y } = data.documents[0].address;

      return {
        lat: parseFloat(y),
        lng: parseFloat(x),
      };
    } catch (error) {
      console.error("좌표 변환 중 오류 발생:", error);
      return null;
    }
  };

  const handleClick = () => {
    open({
      onComplete: async (data) => {
        const address = data.roadAddress || data.jibunAddress;
        setSelectedAddress(address);
        const coordinates = await convertAddressToCoordinates(address);
        onComplete(address, coordinates || undefined);
      },
      width: 500,
      height: 600,
    });
  };

  return (
    <input
      type="text"
      className={styles.input2}
      onClick={handleClick}
      readOnly
      placeholder="주소 검색"
      value={selectedAddress}
    />
  );
}
