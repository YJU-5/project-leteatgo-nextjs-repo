import { useState } from "react";
import styles from "./food-tag.module.css";

interface FoodTagProps {
  onSelect: (tag: string) => void;
}

export default function FoodTag({ onSelect }: FoodTagProps) {
  const [activeTag, setActiveTag] = useState<string>("");

  const tags = ["한식", "중식", "일식", "양식"];

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
