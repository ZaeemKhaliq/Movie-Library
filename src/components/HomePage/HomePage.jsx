import React from "react";
import { useContext, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { ColContext } from "../Contexts/ColorContext";

import styles from "./HomePage.module.scss";

export default function HomePage() {
  let { theme } = useContext(ColContext);

  const movies = useSelector((state) => state.movies.movies);
  const user = useSelector((state) => state.auth.user);
  const filteredMovies = movies.filter((item) => item.isFeatured === true);
  // console.log(filteredMovies);

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
    <>
      <section
        className={`${styles[`featured-movies-section`]} ${
          theme == "black" ? "whiteText" : "blackText"
        }`}
      >
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
                <div
                  className={`${styles["featured-movie-card"]} ${
                    theme == "black" ? "blackBackground" : "whiteBackground"
                  }`}
                  style={{
                    border:
                      theme == "black" ? "1px solid white" : "1px solid black",
                  }}
                >
                  <div className={styles["movie-image-container"]}>
                    <img
                      src={`/assets/images/movie-images/${getImage(
                        movie.image
                      )}`}
                      className={styles["movie-image"]}
                    />
                  </div>
                  <div className={styles["movie-details"]}>
                    <div className={styles["movie-title"]}>
                      <h3>{movie.title}</h3>
                      {user && parseJwt(user.token).isAdmin === true ? (
                        <p className={styles["edit-movie-text"]}>
                          <Link
                            to={`/edit-movie/${movie.id}`}
                            style={{
                              color: theme == "black" ? "white" : "black",
                            }}
                          >
                            EDIT MOVIE
                          </Link>
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
                          style={{
                            color: theme == "black" ? "white" : "black",
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
