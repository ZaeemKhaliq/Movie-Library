import styles from "./MovieImage.module.scss";

export default function MovieImage(props) {
  const handleFileChange = props.handleFileChange;

  let filteredMovie = props.filteredMovie;

  const getImage = (image) => {
    let splitted = image.split("/");

    let movieNameIndex = splitted.length - 1;
    let movieName = splitted[movieNameIndex];

    let splitMovieName = movieName.split("-");
    let splitExtension = movieName.split(".");

    let finalMovieName = splitMovieName[0] + ".jpg";

    console.log(finalMovieName);

    return finalMovieName;
  };

  return (
    <div className={styles["movie-image-section"]}>
      <label className={styles["input-label"]}>COVER IMAGE</label>
      <div className={styles["cover-image-container"]}>
        <img
          src={
            filteredMovie.length &&
            `/assets/images/movie-images/${getImage(filteredMovie[0].image)}`
          }
          alt="movie-image"
          className={styles["cover-image"]}
        />
      </div>
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
