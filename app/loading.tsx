import Image from "next/image";

export default function Loading() {
  return (
    <div
      style={{
        overflow: "auto",
        height: "100vh",
        scrollbarWidth: "thin",
        scrollbarColor: "#888 #f1f1f1",
      }}
    >
      <div
        style={{
          position: "fixed",
          width: "100%",
          top: 0,
          left: 0,
          zIndex: -1,
        }}
      >
        <Image
          src="/home/socialhome.png"
          alt="socialhome"
          width={4000}
          height={2000}
          style={{
            width: "100%",
            height: "623px",
            objectFit: "cover",
            opacity: 0.6,
          }}
        />
      </div>
    </div>
  );
}
