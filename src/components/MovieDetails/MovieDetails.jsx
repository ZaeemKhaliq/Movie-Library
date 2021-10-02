import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";

import MovieService from "../../services/movie-service";

import styles from "./MovieDetails.module.scss";

import CommentSection from "./CommentSection/CommentSection";

export default function MovieDetails(props) {
  const movies = useSelector((state) => state.movies.movies);
  const movieId = props.match.params.id;

  const filteredMovie = movies.filter((item) => item.id === movieId);
  const movie = filteredMovie[0];
  // console.log(movie);

  const flags = {
    isFetching: useSelector((state) => state.movies.isFetching),
    errorMessage: useSelector((state) => state.movies.errorMessage),
  };

  const splittingDescription = (richDescription) => {
    const splittedArray = richDescription.split(".");

    let string = "";
    let finalArray = [];

    for (var i = 0; i < splittedArray.length; i++) {
      string += splittedArray[i] + ".";
      if (i > 0) {
        if (i % 5 == 0) {
          finalArray.push(string);
          string = "";
        }
      }
      if (i == splittedArray.length - 1) {
        const finalString = string.slice(0, string.length - 1);

        finalArray.push(finalString);
        string = "";
      }
    }

    return finalArray;
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
      <section className={styles["movie-details-section"]}>
        <div className={styles["movie-details-container"]}>
          <div className={styles["movie-details"]}>
            {movie && flags.isFetching === false ? (
              <>
                <div className={styles["movie-overview"]}>
                  <div className={styles["movie-image-container"]}>
                    <img
                      src={`/assets/images/movie-images/${getImage(
                        movie.image
                      )}`}
                      alt="MOVIE"
                      className={styles["movie-image"]}
                    />
                  </div>
                  <div className={styles["movie-detail"]}>
                    <h3>{movie.title}</h3>
                    <div className={styles["movie-genre"]}>
                      <p>Genre - {movie.genre}</p>
                    </div>
                    <div className={styles["movie-release-date"]}>
                      <p>Release Date - {movie.releaseDate}</p>
                    </div>
                    <div className={styles["movie-rating"]}>
                      <p>Rating - {movie.rating}/5</p>
                    </div>
                    <div className={styles["short-description"]}>
                      <p>{movie.description}</p>
                    </div>
                  </div>
                </div>
                <div className={styles["movie-extra-details"]}>
                  <div className={styles["movie-rich-description-container"]}>
                    <h3>PLOT</h3>

                    {splittingDescription(movie.richDescription).map(
                      (item, index) => {
                        return (
                          <div key={index}>
                            <p>{item}</p>
                            <br />
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </>
            ) : flags.isFetching === true ? (
              <h3 style={{ textAlign: "center" }}>LOADING DETAILS...</h3>
            ) : !movie && !flags.errorMessage ? (
              <h3 style={{ textAlign: "center" }}>NO MOVIE FOUND!</h3>
            ) : flags.errorMessage ? (
              <h3 style={{ textAlign: "center" }}>{flags.errorMessage}</h3>
            ) : null}
          </div>
        </div>
        <CommentSection movieId={movieId} />
      </section>
    </>
  );
}
