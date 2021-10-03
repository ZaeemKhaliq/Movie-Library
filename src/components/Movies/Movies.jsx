import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet";

import { ColContext } from "../Contexts/ColorContext";

import styles from "./Movies.module.scss";

import Movie from "./Movie/Movie";
import Pagination from "../Pagination/Pagination";

export default function Movies(props) {
  let { theme } = useContext(ColContext);

  const movies = useSelector((state) => state.movies.movies);
  const user = useSelector((state) => state.auth.user);
  const flags = {
    isFetching: useSelector((state) => state.movies.isFetching),
    errorMessage: useSelector((state) => state.movies.errorMessage),
  };
  // console.log(movies);

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
      <Helmet>
        <title>MOVIES</title>
      </Helmet>
      <section
        className={`${styles["movies-list-section"]} ${
          theme == "black" ? "whiteText" : "blackText"
        }`}
      >
        <div className={styles["movies-list-heading"]}>
          <h2>ALL MOVIES</h2>
        </div>
        <div className={styles["movies-list-container"]}>
          {flags.isFetching === true ? (
            <h3 style={{ textAlign: "center" }}>LOADING...</h3>
          ) : null}
          {flags.isFetching === false && movies.length ? (
            // movies.map((movie, index) => {
            //   return <Movie user={user} movie={movie} parseJwt={parseJwt} />;
            // })
            <Pagination
              data={movies}
              pageLimit={2}
              dataLimit={4}
              user={user}
              parseJwt={parseJwt}
              isMovies={true}
            />
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
