import { useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { Redirect } from "react-router";

import MovieService from "../../services/movie-service";

import styles from "./AddMovie.module.scss";

import Spinner from "react-bootstrap/Spinner";
import MovieImage from "./MovieImage/MovieImage";
import MovieDetails from "./MovieDetails/MovieDetails";

export default function AddMovie(props) {
  const history = props.history;

  const user = useSelector((state) => state.auth.user);

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

  // console.log(details);

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
      setFlag(true);

      let form = document.getElementById("add-movie-form");
      let formData = new FormData(form);

      MovieService.postMovie(formData)
        .then((response) => {
          console.log(response);
          alert("Movie added successfully!");
          setFlag(false);
          history.push("/movies");
          window.location.reload();
        })
        .catch((err) => {
          console.log(err.response);
          setFlag(false);
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
      <Helmet>
        <title>ADD MOVIE</title>
      </Helmet>
      <section className={styles["add-movie-root-container"]}>
        <div className={styles["add-movie-container"]}>
          <div className={styles["add-movie-container-heading"]}>
            <h3>ADD MOVIE</h3>
          </div>
          <div className={styles["add-movie-container-body"]}>
            {user && parseJwt(user.token).isAdmin === true ? (
              <div className={styles["add-movie-form-container"]}>
                <form
                  className={styles["add-movie-form"]}
                  id="add-movie-form"
                  name="add-movie-form"
                >
                  <div className={styles["form-fields"]}>
                    <MovieDetails
                      handleChange={handleChange}
                      details={details}
                    />
                    <MovieImage handleFileChange={handleFileChange} />
                  </div>
                  <div className={styles["form-submit-container"]}>
                    <button
                      className={styles["submit-button"]}
                      type="submit"
                      onClick={handleSubmit}
                      disabled={flag == true ? true : false}
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
                  </div>
                </form>
              </div>
            ) : (
              <div className={styles["info-para"]}>
                <h5>You must be logged in as an Admin to add a movie!</h5>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
