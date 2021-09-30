import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { Redirect } from "react-router";

import MovieService from "../../services/movie-service";

import styles from "./EditMovie.module.scss";

import Spinner from "react-bootstrap/Spinner";
import MovieDetails from "./MovieDetails/MovieDetails";
import MovieImage from "./MovieImage/MovieImage";

export default function EditMovie(props) {
  const history = props.history;
  const movieId = props.match.params.id;

  const user = useSelector((state) => state.auth.user);
  const movies = useSelector((state) => state.movies.movies);

  const filteredMovie = movies.filter((movie) => {
    return movie.id == movieId;
  });

  // console.log(filteredMovie);

  const flags = {
    moviesFetching: useSelector((state) => state.movies.moviesFetching),
  };

  // console.log(flags);

  const [details, setDetails] = useState({
    title: "",
    genre: "",
    releaseDate: "",
    description: "",
    richDescription: "",
    rating: 0,
    image: "",
  });
  const [flag, setFlag] = useState(false);
  const [deleteFlag, setDeleteFlag] = useState(false);
  const [error, setError] = useState("");

  // console.log(details);

  useEffect(() => {
    if (filteredMovie.length) {
      setDetails((prev) => ({
        ...prev,
        title: filteredMovie[0].title,
        genre: filteredMovie[0].genre,
        releaseDate: filteredMovie[0].releaseDate,
        description: filteredMovie[0].description,
        richDescription: filteredMovie[0].richDescription,
        rating: filteredMovie[0].rating,
        image: filteredMovie[0].image,
      }));
    }
  }, [movies]);

  const computeMaxYear = useMemo(() => {
    let date = new Date();
    return date.getFullYear();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setDetails((prev) => ({
      ...prev,
      [name]:
        [name] == "rating" || [name] == "releaseDate" ? parseInt(value) : value,
    }));
  };

  const handleFileChange = (e) => {
    console.log(e);
    const { name, value, files } = e.target;

    setDetails((prev) => ({
      ...prev,
      [name]: files[0],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (details.title == "" || details.genre == "") {
      alert("Title and genre are required fields!");
    } else if (
      details.releaseDate < 1900 ||
      details.releaseDate > computeMaxYear
    ) {
      alert("Enter release date between range!");
    } else {
      if (window.confirm("Update movie?")) {
        setFlag(true);
        setError("");

        let form = document.getElementById("edit-movie-form");
        let formData = new FormData(form);

        MovieService.updateMovie(movieId, formData)
          .then((response) => {
            console.log(response);
            alert("Movie updated successfully!");
            setFlag(false);
            history.push("/movies");
            window.location.reload();
          })
          .catch((err) => {
            setFlag(false);
            if (err.response) {
              setError(err.response.data.message);
            } else {
              setError(err.message);
            }
          });
      }
    }
  };

  const handleDelete = () => {
    if (window.confirm("Delete this movie?")) {
      setDeleteFlag(true);
      setError("");

      MovieService.deleteMovie(movieId)
        .then((response) => {
          setDeleteFlag(false);
          alert("The movie has been deleted successfully!");
          history.push("/movies");
          window.location.reload();
        })
        .catch((err) => {
          setDeleteFlag(false);
          if (err.response) {
            setError(err.response.data.message);
          } else {
            setError(err.message);
          }
        });
    }
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
      {flags.moviesFetching == true && !filteredMovie.length ? (
        <Redirect to="/movies" />
      ) : (
        <>
          <Helmet>
            <title>EDIT MOVIE</title>
          </Helmet>
          <section className={styles["edit-movie-root-container"]}>
            <div className={styles["edit-movie-container"]}>
              <div className={styles["edit-movie-container-heading"]}>
                <h3>EDIT MOVIE</h3>
              </div>
              <div className={styles["edit-movie-container-body"]}>
                {user && parseJwt(user.token).isAdmin === true ? (
                  <div className={styles["edit-movie-form-container"]}>
                    <form
                      className={styles["edit-movie-form"]}
                      id="edit-movie-form"
                      name="edit-movie-form"
                    >
                      <div className={styles["form-fields"]}>
                        <MovieDetails
                          handleChange={handleChange}
                          details={details}
                        />
                        <MovieImage
                          handleFileChange={handleFileChange}
                          filteredMovie={filteredMovie}
                        />
                      </div>
                      <div className={styles["error-text-container"]}>
                        {error && (
                          <p className={styles["error-text"]}>{error}</p>
                        )}
                      </div>
                      <div className={styles["form-submit-container"]}>
                        <button
                          className={styles["submit-button"]}
                          type="submit"
                          onClick={handleSubmit}
                          disabled={
                            flag == true || deleteFlag == true ? true : false
                          }
                        >
                          {!flag ? (
                            "SUBMIT"
                          ) : (
                            <Spinner
                              animation="border"
                              variant="light"
                              className={styles["spinner"]}
                            />
                          )}
                        </button>
                        <button
                          className={styles["delete-button"]}
                          type="button"
                          onClick={handleDelete}
                          disabled={
                            deleteFlag == true || flag == true ? true : false
                          }
                        >
                          {!deleteFlag ? (
                            "DELETE MOVIE"
                          ) : (
                            <Spinner
                              animation="border"
                              variant="light"
                              className={styles["spinner"]}
                            />
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                ) : user && parseJwt(user.token).isAdmin === false ? (
                  <Redirect to="/movies" />
                ) : (
                  <div className={styles["info-para"]}>
                    <h5>You must be logged in as an Admin to edit a movie!</h5>
                  </div>
                )}
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}
