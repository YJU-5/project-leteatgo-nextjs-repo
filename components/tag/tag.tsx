import { useState } from "react";
import styles from "./tag.module.css";

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
    <div className={styles.tag_container}>
      {tags.map((tag) => (
        <button
          key={tag}
          className={`${styles.tag_button} ${
            activeTag === tag ? styles.active : ""
          }`}
          onClick={() => handleClick(tag)}
          type="button"
          aria-pressed={activeTag === tag}
        >
          {tag}
          {activeTag === tag && <span className={styles.check_icon}>✓</span>}
        </button>
      ))}
    </div>
  );
}
