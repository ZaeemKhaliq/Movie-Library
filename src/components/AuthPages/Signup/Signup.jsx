import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router";

import styles from "./Signup.module.scss";

import AuthService from "../../../services/auth-service";

import Spinner from "react-bootstrap/Spinner";

export default function Signup() {
  const history = useHistory();

  const user = useSelector((state) => state.auth.user);

  const [details, setDetails] = useState({ name: "", email: "", password: "" });
  const [flag, setFlag] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    e.preventDefault();

    const { name, value } = e.target;

    setDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      details.email === "" ||
      details.password === "" ||
      details.name === ""
    ) {
      alert("Enter all fields!");
    } else {
      setFlag(true);
      setError("");

      AuthService.signup(details)
        .then((response) => {
          console.log(response);
          setFlag(false);

          alert("Account created successfully! You can login now.");
          history.push("/login");
        })
        .catch((error) => {
          setFlag(false);
          const resMessage = error.response.data;

          setError(resMessage);
        });
    }
  };

  return (
    <>
      {user ? (
        <Redirect to="/" />
      ) : (
        <section className={styles["signup-page-container"]}>
          <div className={styles["signup-page-heading"]}>
            <h2>SIGNUP</h2>
          </div>
          <div className={styles["signup-box-container"]}>
            <div className={styles["signup-box"]}>
              <div className={styles["signup-form-container"]}>
                <form className={styles["signup-form"]} onSubmit={handleSubmit}>
                  <label className={styles["input-label"]}>
                    USERNAME
                    <br />
                    <br />
                    <input
                      type="text"
                      placeholder="Enter Username..."
                      className={styles["input-username"]}
                      name="name"
                      onChange={handleChange}
                      value={details.name}
                    />
                  </label>

                  <br />
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
                      type="password"
                      placeholder="Enter Password..."
                      className={styles["input-password"]}
                      name="password"
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
                      "SIGNUP"
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
