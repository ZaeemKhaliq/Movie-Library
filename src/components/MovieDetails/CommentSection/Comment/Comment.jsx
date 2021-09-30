import { useMemo, useState } from "react";

import styles from "./Comment.module.scss";

import ProfileAvatar from "../../../../assets/jpeg/profile-avatar.png";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { Spinner } from "react-bootstrap";

export default function Comment(props) {
  const {
    comment,
    handleChange,
    details,
    editCommentBoxValues,
    editComment,
    deleteComment,
    toggleEditCommentBoxValues,
    user,
    index,
    postFlag,
    spinnerFlag,
  } = props;

  const [deleteLocalFlag, setDeleteLocalFlag] = useState(false);

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

  const memoizedDate = useMemo(() => {
    const date = parsedDate(comment.date);
    return date;
  }, [comment]);

  return (
    <div className={styles["comment"]}>
      <div className={styles["metadata"]}>
        <div className={styles["image-container"]}>
          <img src={ProfileAvatar} alt="IMAGE" className={styles["image"]} />
        </div>
        <div className={styles["user-info-container"]}>
          <div className={styles["user-name-date"]}>
            <div className={styles["user-name"]}>
              <h6>{comment.user.name}</h6>
            </div>

            <p>{memoizedDate}</p>
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
              disabled={postFlag == true ? true : false}
            >
              {!spinnerFlag ? (
                "POST EDIT"
              ) : (
                <Spinner animation="border" variant="light" />
              )}
            </button>
          </div>
        </div>
      )}
      {user && comment.user.email == user.user.email && postFlag == false ? (
        <div className={styles["buttons-container"]}>
          <div className={styles["delete-button"]}>
            <p onClick={() => deleteComment(comment.id, setDeleteLocalFlag)}>
              DELETE
            </p>
          </div>
          <div className={styles["separator"]}>
            <FiberManualRecordIcon className={styles["circle"]} />
          </div>
          <div className={styles["edit-button"]}>
            <p onClick={() => toggleEditCommentBoxValues(index)}>
              {editCommentBoxValues[index] ? "CANCEL EDIT" : "EDIT"}
            </p>
          </div>
        </div>
      ) : deleteLocalFlag == true ? (
        <p>DELETING COMMENT...</p>
      ) : null}
    </div>
  );
}
