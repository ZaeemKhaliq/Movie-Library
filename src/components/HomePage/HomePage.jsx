import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import styles from "./HomePage.module.scss";

export default function HomePage() {
  const movies = useSelector((state) => state.movies.movies);
  const user = useSelector((state) => state.auth.user);
  const filteredMovies = movies.filter((item) => item.isFeatured === true);
  console.log(filteredMovies);

  const flags = {
    isFetching: useSelector((state) => state.movies.isFetching),
    errorMessage: useSelector((state) => state.movies.errorMessage),
  };

  const parseJwt = (token) => {
    try {
      const secret = JSON.parse(atob(token.split(".")[1]));
      return secret;
    } catch (e) {
      return null;
    }
  };

  return (
    <>
      <section className={styles["featured-movies-section"]}>
        <div className={styles["featured-movies-heading"]}>
          <h2>FEATURED MOVIES</h2>
        </div>
        <div className={styles["featured-movies-container"]}>
          {flags.isFetching === true ? (
            <h3 style={{ textAlign: "center" }}>LOADING...</h3>
          ) : null}
          {flags.isFetching === false && movies.length ? (
            filteredMovies.map((movie, index) => {
              return (
                <div className={styles["featured-movie-card"]} key={movie.id}>
                  <div className={styles["movie-image-container"]}>
                    <img src={movie.image} className={styles["movie-image"]} />
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
            })
          ) : flags.isFetching === false &&
            !movies.length &&
            !flags.errorMessage ? (
            <h3 style={{ textAlign: "center" }}>NO MOVIES FOUND!</h3>
          ) : flags.isFetching === false &&
            !movies.length &&
            flags.errorMessage ? (
            <h3 style={{ textAlign: "center" }}>{flags.errorMessage}</h3>
          ) : null}
        </div>
      </section>
    </>
  );
}
