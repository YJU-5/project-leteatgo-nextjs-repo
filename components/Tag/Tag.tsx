import { useState } from "react";
import styles from "./Tag.module.css";

interface TagProps {
  tags: string[]; // 태그 목록을 props로 받음
  onSelect: (tag: string) => void;
}

export default function Tag({ tags, onSelect }: TagProps) {
  const [activeTag, setActiveTag] = useState<string>("");

  const handleClick = (tag: string) => {
    if (activeTag === tag) {
      setActiveTag("");
      onSelect("");
    } else {
      setActiveTag(tag);
      onSelect(tag);
    }
  };

  return (
    <div className={styles.tagContainer}>
      {tags.map((tag) => (
        <button
          key={tag}
          className={`${styles.tagButton} ${
            activeTag === tag ? styles.active : ""
          }`}
          onClick={() => handleClick(tag)}
          type="button"
          aria-pressed={activeTag === tag}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
