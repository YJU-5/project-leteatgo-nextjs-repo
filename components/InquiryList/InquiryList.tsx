import { useSelector } from "react-redux"
import styles from "./InquiryList.module.css"
import { RootState } from "@/store/Store";

export default function InquiryList(){

  const user = useSelector((state:RootState)=> state.user.user);

  return(
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>1:1 문의</h1>
      </div>
      <div className={styles.formGroup}>
        <span className={styles.author}>작성자: {user?.name}</span>
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="title" className={styles.label}>제목</label>
        <input 
          type="text" 
          id="title"
          className={styles.input} 
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="content" className={styles.label}>내용</label>
        <textarea 
          id="content"
          placeholder="내용을 입력하세요"
          className={styles.textArea}
           />
      </div>
    </div>
  )
}