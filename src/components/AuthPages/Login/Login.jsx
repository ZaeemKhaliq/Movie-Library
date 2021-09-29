import { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory, useLocation } from "react-router";

import AuthService from "../../../services/auth-service";
import { setUser } from "../../../store/reducers/auth";

import { LocContext } from "../../Contexts/LocationContext";

import styles from "./Login.module.scss";

import CircularProgress from "@mui/material/CircularProgress";
import Spinner from "react-bootstrap/Spinner";

export default function Login() {
  const dispatch = useDispatch();
  const history = useHistory();

  const user = useSelector((state) => state.auth.user);

  const [details, setDetails] = useState({ email: "", password: "" });
  const [flag, setFlag] = useState(false);
  const [error, setError] = useState("");

  const { locations } = useContext(LocContext);

  const handleChange = (e) => {
    e.preventDefault();

    const { name, value } = e.target;

    setDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (details.email === "" || details.password === "") {
      alert("Enter both fields!");
    } else {
      setFlag(true);
      setError("");

      AuthService.login(details)
        .then((response) => {
          console.log(response);
          setFlag(false);

          const data = response.data;
          dispatch(setUser(data));

          localStorage.setItem(
            "user",
            JSON.stringify({
              user: data.user,
              token: data.token,
            })
          );

          history.push(locations.from);
          window.location.reload();
        })
        .catch((error) => {
          setFlag(false);
          if (error.response) {
            const resMessage =
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString();

            console.log(resMessage);

            setError(resMessage);
          } else {
            const errorValue = new Promise((resolve, reject) => {
              reject(new Error("Server is down!"));
            });
            errorValue
              .then((response) => {
                console.log(response);
              })
              .catch((err) => {
                console.log(err);
                setError(err.message);
              });
          }
        });
    }
  };

  return (
    <>
      {user ? (
        <Redirect to="/" />
      ) : (
        <section className={styles["login-page-container"]}>
          <div className={styles["login-page-heading"]}>
            <h2>LOGIN</h2>
          </div>
          <div className={styles["login-box-container"]}>
            <div className={styles["login-box"]}>
              <div className={styles["login-form-container"]}>
                <form className={styles["login-form"]} onSubmit={handleSubmit}>
                  <label className={styles["input-label"]}>
                    EMAIL
                    <br />
                    <br />
                    <input
                      type="email"
                      placeholder="Enter email address..."
                      className={styles["input-email"]}
                      name="email"
                      onChange={handleChange}
                      value={details.email}
                    />
                  </label>
                  <br />
                  <label className={styles["input-label"]}>
                    PASSWORD
                    <br />
                    <br />
                    <input
                      name="password"
                      type="password"
                      placeholder="Enter Password..."
                      className={styles["input-password"]}
                      onChange={handleChange}
                      value={details.password}
                    />
                  </label>
                  <br />
                  <br />
                  <p
                    className={styles["error-text"]}
                    style={{ visibility: error ? "visible" : "hidden" }}
                  >
                    {error ? error : "I am hidden"}
                  </p>

                  <button
                    type="submit"
                    className={styles["submit-button"]}
                    disabled={flag == true ? true : false}
                  >
                    {!flag ? (
                      "LOGIN"
                    ) : (
                      <Spinner
                        animation="border"
                        variant="light"
                        className={styles["spinner"]}
                      />
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
