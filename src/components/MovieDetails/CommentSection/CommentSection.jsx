import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import MovieService from "../../../services/movie-service";

import styles from "./CommentSection.module.scss";

import ProfileAvatar from "../../../assets/jpeg/profile-avatar.png";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

export default function CommentSection(props) {
  const user = useSelector((state) => state.auth.user);

  let { movieId } = props;

  const [commentBox, setCommentBox] = useState(false);
  const [editCommentBoxValues, setEditCommentBoxValues] = useState();
  console.log("Edit comment box: ", editCommentBoxValues);
  const [details, setDetails] = useState({ userComment: "", editComment: "" });
  console.log(details);

  const [comments, setComments] = useState([]);
  const [fetchingComments, setFetchingComments] = useState(false);
  const [error, setError] = useState("");
  const [postError, setPostError] = useState("");
  console.log("Comments: ", comments);

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
        setFetchingComments(false);
        setComments(result);
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
      console.log(i);
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

    console.log(data);

    const post = () => {
      MovieService.postComment(data)
        .then((response) => {
          alert("Comment posted successfully!");
          getComments();
          setCommentBox(false);
        })
        .catch((err) => {
          console.log(err);
          setPostError(err);
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
  const deleteComment = (id) => {
    if (window.confirm("Delete this comment?")) {
      MovieService.deleteComment(id).then((response) => {
        alert("Comment deleted successfully!");
        getComments();
      });
    }
  };
  /*DELETE COMMENT*/

  /*EDIT COMMENT*/
  const editComment = (id) => {
    const data = { comment: details.editComment };

    if (window.confirm("Update the comment?")) {
      MovieService.updateComment(id, data).then((response) => {
        alert("Comment updated successfully!");
        getComments();
      });
    }
  };
  /*EDIT COMMENT*/

  const totalComments = useMemo(() => {
    const commentsLen = comments.length;
    console.log("Comments Length:", commentsLen);
    return commentsLen;
  }, [comments]);

  const parsedDate = (inputDate) => {
    const correctDate = new Date(inputDate).toLocaleString();

    const [month, day, year] = correctDate.split("/");
    const [hours, minutes, seconds] = year.split(":");
    const date = `${day}/${month}/${year.slice(0, 4)}`;
    const time = `${hours.slice(6, 8)}:${minutes}:${seconds}`;

    const finalDate = `${date} - ${time}`;

    console.log(finalDate);

    return finalDate;
  };

  const memoizedDates = useMemo(() => {
    const commentsArr = [];
    if (comments.length) {
      comments.forEach((item, index) => {
        const date = parsedDate(item.date);
        commentsArr.push(date);
      });

      console.log(commentsArr);

      return commentsArr;
    } else {
      return;
    }
  }, [comments]);

  return (
    <>
      <div className={styles["comment-section-root-container"]}>
        <div className={styles["comment-section-container"]}>
          <div className={styles["comment-section-heading"]}>
            <h3>COMMENTS</h3>
            <h3>TOTAL COMMENTS: {totalComments}</h3>
          </div>
          <div className={styles["comment-section-body"]}>
            <div className={styles["comment-box"]}>
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
                    >
                      Post Comment
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className={styles["comments-container"]}>
              {comments.length ? (
                comments.map((comment, index) => {
                  return (
                    <div className={styles["comment"]} key={index}>
                      <div className={styles["metadata"]}>
                        <div className={styles["image-container"]}>
                          <img
                            src={ProfileAvatar}
                            alt="IMAGE"
                            className={styles["image"]}
                          />
                        </div>
                        <div className={styles["user-info-container"]}>
                          <div className={styles["user-name-date"]}>
                            <div className={styles["user-name"]}>
                              <h6>{comment.user.name}</h6>
                            </div>

                            <p>{memoizedDates[index]}</p>
                          </div>
                          <div className={styles["user-email"]}>
                            <p>{comment.user.email}</p>
                          </div>
                        </div>
                      </div>
                      <div className={styles["comment-text"]}>
                        <p>{comment.comment}</p>
                      </div>

                      {editCommentBoxValues[index] && (
                        <div className={styles["edit-comment-box-container"]}>
                          <textarea
                            name="editComment"
                            className={styles["edit-comment-box"]}
                            onChange={handleChange}
                            value={details.editComment}
                          ></textarea>
                          <div className={styles["post-edit-button-container"]}>
                            <button
                              className={styles["post-edit-button"]}
                              onClick={() => editComment(comment.id)}
                            >
                              POST EDIT
                            </button>
                          </div>
                        </div>
                      )}
                      {user && comment.user.email == user.user.email && (
                        <div className={styles["buttons-container"]}>
                          <div className={styles["delete-button"]}>
                            <p onClick={() => deleteComment(comment.id)}>
                              DELETE
                            </p>
                          </div>
                          <div className={styles["separator"]}>
                            <FiberManualRecordIcon
                              className={styles["circle"]}
                            />
                          </div>
                          <div className={styles["edit-button"]}>
                            <p
                              onClick={() => toggleEditCommentBoxValues(index)}
                            >
                              {editCommentBoxValues[index]
                                ? "CANCEL EDIT"
                                : "EDIT"}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : !comments.length && fetchingComments == true ? (
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
