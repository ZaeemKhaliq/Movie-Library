import { Link } from "react-router-dom";

import styles from "./Movie.module.scss";

export default function Movie(props) {
  let { movie, user, parseJwt } = props;

  const getImage = (image) => {
    let splitted = image.split("/");

    let movieNameIndex = splitted.length - 1;
    let movieName = splitted[movieNameIndex];

    let splitMovieName = movieName.split("-");
    let splitExtension = movieName.split(".");

    let finalMovieName = splitMovieName[0] + ".jpg";

    return finalMovieName;
  };

  return (
    <div className={styles["movie-card"]} key={movie.id}>
      <div className={styles["movie-image-container"]}>
        <img
          src={`/assets/images/movie-images/${getImage(movie.image)}`}
          className={styles["movie-image"]}
        />
      </div>
      <div className={styles["movie-details"]}>
        <div className={styles["movie-title"]}>
          <h3>{movie.title}</h3>
          {user && parseJwt(user.token).isAdmin === true ? (
            <p className={styles["edit-movie-text"]}>
              <Link to={`/edit-movie/${movie.id}`}>EDIT MOVIE</Link>
            </p>
          ) : null}
        </div>
        <div className={styles["movie-genre"]}>
          <p>Genre - {movie.genre}</p>
        </div>
        <div className={styles["movie-rating"]}>
          <p>Rating - {movie.rating}/5</p>
        </div>
        <div className={styles["movie-description"]}>
          <p>{movie.description}</p>
        </div>
        <div className={styles["view-details"]}>
          <p>
            <Link
              to={{
                pathname: `/movies/${movie.id}`,
              }}
            >
              VIEW DETAILS...
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
