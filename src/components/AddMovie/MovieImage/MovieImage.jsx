import { useContext } from "react";

import styles from "./MovieImage.module.scss";

import { ColContext } from "../../Contexts/ColorContext";

export default function MovieImage(props) {
  let { theme } = useContext(ColContext);

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
          style={{
            border: theme == "black" ? "1px solid white" : "1px solid black",
          }}
        />
      </div>
    </div>
  );
}
