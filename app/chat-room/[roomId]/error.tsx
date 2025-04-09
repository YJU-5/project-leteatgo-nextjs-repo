"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>에러가 발생했습니다: {error.message}</h2>
      <button onClick={() => reset()}>다시 시도</button>
    </div>
  );
}
