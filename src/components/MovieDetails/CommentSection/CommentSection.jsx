import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import MovieService from "../../../services/movie-service";

import { ColContext } from "../../Contexts/ColorContext";

import styles from "./CommentSection.module.scss";

import ProfileAvatar from "../../../assets/jpeg/profile-avatar.png";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import Comment from "./Comment/Comment";
import Pagination from "../../Pagination/Pagination";

export default function CommentSection(props) {
  let { theme } = useContext(ColContext);

  const user = useSelector((state) => state.auth.user);

  let { movieId } = props;

  const [commentBox, setCommentBox] = useState(false);
  const [editCommentBoxValues, setEditCommentBoxValues] = useState();
  // console.log("Edit comment box: ", editCommentBoxValues);
  const [details, setDetails] = useState({ userComment: "", editComment: "" });
  // console.log(details);

  const [comments, setComments] = useState([]);
  const [fetchingComments, setFetchingComments] = useState(false);
  const [error, setError] = useState("");
  const [postError, setPostError] = useState("");
  const [postFlag, setPostFlag] = useState(false);
  const [spinnerFlag, setSpinnerFlag] = useState(false);
  // console.log("Comments: ", comments);

  useEffect(() => {
    getComments();
  }, []);

  useEffect(() => {
    commentBoxValuesSetter();
  }, [comments]);

  const getComments = () => {
    setFetchingComments(true);
    MovieService.getComments(movieId)
      .then((response) => {
        const result = response.data;
        const reversedResult = result.reverse();
        setFetchingComments(false);
        setComments(reversedResult);
      })
      .catch((err) => {
        setFetchingComments(false);
        if (err.response) {
          setError(err.response.data.message);
        } else {
          setError("Server is down! Can't fetch comments!");
        }
      });
  };

  const toggleCommentBox = () => {
    setCommentBox((commentBox) => !commentBox);
  };

  const commentBoxValuesSetter = (index) => {
    let valuesObject = {};
    for (var i = 0; i < comments.length; i++) {
      // console.log(i);
      valuesObject[`${i}`] = false;
    }
    setEditCommentBoxValues(valuesObject);
  };

  const toggleEditCommentBoxValues = (index) => {
    let valuesObject = {};
    for (var i = 0; i < comments.length; i++) {
      if (i == index) {
        if (editCommentBoxValues[`${i}`] == true) {
          valuesObject[`${i}`] = false;
        } else {
          valuesObject[`${i}`] = true;
        }
      } else {
        valuesObject[`${i}`] = false;
      }
    }
    setEditCommentBoxValues(valuesObject);

    setDetails((prev) => ({
      ...prev,
      editComment: comments[index].comment,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /*POST COMMENT*/
  const postComment = () => {
    const data = {
      comment: details.userComment,
      user: user.user.userId,
      movieId: movieId,
    };

    // console.log(data);

    const post = () => {
      setPostFlag(true);

      MovieService.postComment(data)
        .then((response) => {
          alert("Comment posted successfully!");
          getComments();
          setPostFlag(false);
          setCommentBox(false);
        })
        .catch((err) => {
          setPostFlag(false);

          if (err.response) {
            const errorMessage = err.response.data.message;
            alert(errorMessage);
          } else {
            const errorMessage = err.message;
            alert(errorMessage);
            setPostError(errorMessage);
          }
        });
    };

    if (details.userComment == "") {
      alert("Enter something to post a comment!");
    } else {
      if (commentBox === false) {
        setCommentBox(true);
        setTimeout(() => {
          if (window.confirm("Post this comment?")) {
            post();
          }
        }, 500);
      } else {
        if (window.confirm("Post this comment?")) {
          post();
        }
      }
    }
  };
  /*POST COMMENT*/

  /*DELETE COMMENT*/
  const deleteComment = (id, setDeleteLocalFlag) => {
    if (window.confirm("Delete this comment?")) {
      setPostFlag(true);
      setDeleteLocalFlag(true);

      MovieService.deleteComment(id)
        .then((response) => {
          alert("Comment deleted successfully!");
          setPostFlag(false);
          setDeleteLocalFlag(false);
          getComments();
        })
        .catch((err) => {
          setPostFlag(false);
          setDeleteLocalFlag(false);

          if (err.response) {
            const errorMessage = err.response.data.message;
            alert(errorMessage);
          } else {
            const errorMessage = err.message;
            alert(errorMessage);
          }
        });
    }
  };
  /*DELETE COMMENT*/

  /*EDIT COMMENT*/
  const editComment = (id) => {
    const data = { comment: details.editComment };

    if (window.confirm("Update the comment?")) {
      setPostFlag(true);
      setSpinnerFlag(true);

      MovieService.updateComment(id, data)
        .then((response) => {
          alert("Comment updated successfully!");
          setPostFlag(false);
          setSpinnerFlag(false);
          getComments();
        })
        .catch((err) => {
          setPostFlag(false);
          setSpinnerFlag(false);

          if (err.response) {
            const errorMessage = err.response.data.message;
            alert(errorMessage);
          } else {
            const errorMessage = err.message;
            alert(errorMessage);
          }
        });
    }
  };
  /*EDIT COMMENT*/

  /*MEMOIZE COMMENTS*/
  const totalComments = useMemo(() => {
    const commentsLen = comments.length;
    console.log("Comments Length:", commentsLen);
    return commentsLen;
  }, [comments]);
  /*MEMOIZE COMMENTS*/

  /*CREATE DATE FORMAT*/
  const parsedDate = (inputDate) => {
    const correctDate = new Date(inputDate).toLocaleString();

    const [month, day, year] = correctDate.split("/");
    const [hours, minutes, seconds] = year.split(":");
    const date = `${day}/${month}/${year.slice(0, 4)}`;
    const time = `${hours.slice(6, 8)}:${minutes}:${seconds}`;

    const finalDate = `${date} - ${time}`;

    // console.log(finalDate);

    return finalDate;
  };
  /*CREATE DATE FORMAT*/

  /*MEMOIZE DATES*/
  const memoizedDates = useMemo(() => {
    const commentsArr = [];
    if (comments.length) {
      comments.forEach((item, index) => {
        const date = parsedDate(item.date);
        commentsArr.push(date);
      });

      // console.log(commentsArr);

      return commentsArr;
    } else {
      return;
    }
  }, [comments]);
  /*MEMOIZE DATES*/

  return (
    <>
      <div
        className={`${styles["comment-section-root-container"]} ${
          theme == "black"
            ? "whiteText blackBackground"
            : "blackText whiteBackground"
        }`}
        style={{
          border: theme == "black" ? "1px solid white" : "1px solid black",
        }}
      >
        <div className={styles["comment-section-container"]}>
          <div
            className={styles["comment-section-heading"]}
            style={{
              borderBottom:
                theme == "black" ? "5px solid white" : "5px solid black",
            }}
          >
            <h3>COMMENTS</h3>
            <h3>TOTAL COMMENTS: {totalComments}</h3>
          </div>
          <div className={styles["comment-section-body"]}>
            <div
              className={styles["comment-box"]}
              style={{
                borderBottom:
                  theme == "black" ? "1px solid white" : "1px solid black",
              }}
            >
              {!user ? (
                <p>
                  You must be logged in to add a comment!{" "}
                  <Link to="/login" className={styles["login-now-text"]}>
                    {" "}
                    Login Now!
                  </Link>
                </p>
              ) : (
                <>
                  {commentBox && (
                    <textarea
                      name="userComment"
                      className={styles["user-comment"]}
                      onChange={handleChange}
                      value={details.userComment}
                    ></textarea>
                  )}

                  <div className={styles["button-container"]}>
                    {!commentBox ? (
                      <ControlPointIcon
                        className={styles["add-comment-icon"]}
                        onClick={toggleCommentBox}
                      />
                    ) : (
                      <RemoveCircleOutlineIcon
                        className={styles["remove-comment-icon"]}
                        onClick={toggleCommentBox}
                      />
                    )}
                    <button
                      className={styles["post-button"]}
                      onClick={postComment}
                      disabled={postFlag == true ? true : false}
                    >
                      Post Comment
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className={styles["comments-container"]}>
              {comments.length ? (
                <Pagination
                  data={comments}
                  handleChange={handleChange}
                  details={details}
                  editCommentBoxValues={editCommentBoxValues}
                  editComment={editComment}
                  deleteComment={deleteComment}
                  toggleEditCommentBoxValues={toggleEditCommentBoxValues}
                  memoizedDates={memoizedDates}
                  user={user}
                  isComments={true}
                  dataLimit={4}
                  pageLimit={2}
                  postFlag={postFlag}
                  spinnerFlag={spinnerFlag}
                />
              ) : // comments.map((comment, index) => {
              //   return (

              //     // <Comment
              //     //   comment={comment}
              //     //   index={index}
              //     //   handleChange={handleChange}
              //     //   details={details}
              //     //   editCommentBoxValues={editCommentBoxValues}
              //     //   editComment={editComment}
              //     //   deleteComment={deleteComment}
              //     //   toggleEditCommentBoxValues={toggleEditCommentBoxValues}
              //     //   memoizedDates={memoizedDates}
              //     //   user={user}
              //     // />
              //   );
              // })
              !comments.length && fetchingComments == true ? (
                <h5 style={{ textAlign: "center" }}>LOADING COMMENTS...</h5>
              ) : error ? (
                <h5 style={{ textAlign: "center" }}>{error}</h5>
              ) : (
                <h5 style={{ textAlign: "center" }}>NO COMMENTS FOUND!</h5>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
