import styles from "./MovieImage.module.scss";

export default function MovieImage(props) {
  const handleFileChange = props.handleFileChange;

  return (
    <div className={styles["movie-image-section"]}>
      <label className={styles["input-label"]}>COVER IMAGE</label>

      <div className={styles["upload-button-container"]}>
        <input
          type="file"
          name="image"
          className={styles["input-image"]}
          onChange={handleFileChange}
          accept="image/*"
        />
      </div>
    </div>
  );
}
