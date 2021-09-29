import { useMemo } from "react";
import styles from "./MovieDetails.module.scss";

export default function MovieDetails(props) {
  const handleChange = props.handleChange;
  let details = props.details;

  const computeMaxYear = useMemo(() => {
    let date = new Date();
    return date.getFullYear();
  }, []);

  return (
    <div className={styles["movie-details-section"]}>
      <label className={styles["input-label"]}>
        TITLE
        <br />
        <input
          type="text"
          name="title"
          className={styles["input-title"]}
          placeholder="Enter title..."
          value={details.title}
          onChange={handleChange}
          required
        />
      </label>
      <br />
      <br />
      <label className={styles["input-label"]}>
        GENRE
        <br />
        <input
          type="text"
          name="genre"
          className={styles["input-genre"]}
          placeholder="Enter genre..."
          onChange={handleChange}
          value={details.genre}
          required
        />
      </label>
      <br />
      <br />
      <label className={styles["input-label"]}>
        RELEASE DATE
        <br />
        <input
          type="number"
          name="releaseDate"
          min="1900"
          max={computeMaxYear}
          className={styles["input-releaseDate"]}
          placeholder="Enter release date..."
          onChange={handleChange}
          value={details.releaseDate}
        />
      </label>
      <br />
      <br />
      <label className={styles["input-label"]}>
        RATING
        <br />
        <input
          type="range"
          name="rating"
          className={styles["input-rating"]}
          min="0"
          max="5"
          value={details.rating}
          onChange={handleChange}
        />
        <label>{details.rating}/5</label>
      </label>
      <br />
      <br />
      <label className={styles["input-label"]}>
        DESCRIPTION
        <br />
        <textarea
          name="description"
          className={styles["input-description"]}
          placeholder="Enter description..."
          onChange={handleChange}
          value={details.description}
        ></textarea>
      </label>
      <br />
      <br />
      <label className={styles["input-label"]}>
        DETAILED DESCRIPTION
        <br />
        <textarea
          name="richDescription"
          className={styles["input-richDescription"]}
          placeholder="Enter detailed description..."
          onChange={handleChange}
          value={details.richDescription}
        ></textarea>
      </label>
      <br />
      <br />
    </div>
  );
}
