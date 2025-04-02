import Image from "next/image";

export default function Loading() {
  return (
    <div>
      <Image
        src="/restaurant.jpg"
        alt="restaurant"
        width={1728}
        height={1023}
        priority
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -1,
          position: "absolute",
          top: 0,
          left: 0,
          opacity: 0.3,
          filter: "blur(5px)",
        }}
      />
    </div>
  );
}
