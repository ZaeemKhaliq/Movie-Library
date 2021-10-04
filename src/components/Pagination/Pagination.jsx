import { useEffect, useRef, useState } from "react";
import Comment from "../MovieDetails/CommentSection/Comment/Comment";
import Movie from "../Movies/Movie/Movie";

import "./Pagination.scss";

export default function Pagination(props) {
  const {
    data,
    pageLimit,
    dataLimit,
    user,
    parseJwt,
    isComments,
    isMovies,
    handleChange,
    details,
    editCommentBoxValues,
    editComment,
    deleteComment,
    toggleEditCommentBoxValues,
    memoizedDates,
    postFlag,
    spinnerFlag,
  } = props;

  const [pages] = useState(Math.ceil(data.length / dataLimit));
  const [currentPage, setCurrentPage] = useState(1);
  let indexRange = [];

  // console.log("Pages: ", pages);
  // console.log("Current Page: ", currentPage);

  const isInitialMount = useRef(true);

  useEffect(() => {
    let header = document.getElementById("header");
    let movieDetailsContainer = document.getElementById(
      "movie-details-container"
    );

    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      if (isMovies === true) {
        window.scrollTo({
          behavior: "smooth",
          top: header.offsetHeight,
        });
      }
    }
  }, [currentPage]);

  function goToNextPage() {
    setCurrentPage((page) => page + 1);
  }

  function goToPreviousPage() {
    setCurrentPage((page) => page - 1);
  }

  function changePage(event) {
    const pageNumber = Number(event.target.textContent);
    setCurrentPage(pageNumber);
  }

  const getPaginatedData = () => {
    const startIndex = currentPage * dataLimit - dataLimit;
    const endIndex = startIndex + dataLimit;
    for (var i = startIndex; i < endIndex; i++) {
      indexRange.push(i);
    }

    return data.slice(startIndex, endIndex);
  };

  const getPaginationGroup = () => {
    let start = Math.floor((currentPage - 1) / pageLimit) * pageLimit;
    let dataLength = getPaginatedData().length;

    if (currentPage % pageLimit == 0) {
      return new Array(pageLimit).fill().map((_, idx) => start + idx + 1);
    } else {
      if (currentPage > pageLimit) {
        let currentPageValue;
        let currentValue = currentPage / pageLimit;
        let convertToString = currentValue.toString().split(".")[1];
        let stringValue = "." + convertToString;
        let getFractionalPart = stringValue * pageLimit;
        if (getFractionalPart > 1) {
          let firstValue = getFractionalPart - 1;
          currentPageValue = currentPage - firstValue;
        } else {
          currentPageValue = currentPage;
        }

        if (currentPageValue + pageLimit > pages && pages % pageLimit != 0) {
          let size = pages / pageLimit;

          let splitSize = size.toString().split(".")[1];
          let modifiedSplitSize = "." + splitSize;

          let calculatedSize = modifiedSplitSize * pageLimit;
          console.log(calculatedSize);

          return new Array(calculatedSize)
            .fill()
            .map((_, idx) => start + idx + 1);
        } else {
          return new Array(pageLimit).fill().map((_, idx) => start + idx + 1);
        }
      } else {
        if (pages < pageLimit) {
          return new Array(pages).fill().map((_, idx) => start + idx + 1);
        } else {
          return new Array(pageLimit).fill().map((_, idx) => start + idx + 1);
        }
      }
    }
  };

  return (
    <>
      <div className="dataContainer">
        {getPaginatedData().map((item, index) => {
          return isMovies == true ? (
            <Movie key={index} user={user} parseJwt={parseJwt} movie={item} />
          ) : (
            isComments == true && (
              <Comment
                key={index}
                comment={item}
                index={indexRange[index]}
                handleChange={handleChange}
                details={details}
                editCommentBoxValues={editCommentBoxValues}
                editComment={editComment}
                deleteComment={deleteComment}
                toggleEditCommentBoxValues={toggleEditCommentBoxValues}
                memoizedDates={memoizedDates}
                user={user}
                postFlag={postFlag}
                spinnerFlag={spinnerFlag}
              />
            )
          );
        })}
      </div>

      <div className="pagination">
        <button
          onClick={goToPreviousPage}
          className={`prev ${currentPage === 1 ? "disabled" : ""}`}
        >
          Previous
        </button>

        {getPaginationGroup().map((item, index) => {
          return (
            <button
              key={index}
              onClick={changePage}
              className={`paginationItem ${
                currentPage === item ? "active" : null
              }`}
            >
              <span>{item}</span>
            </button>
          );
        })}

        <button
          onClick={goToNextPage}
          className={`next ${currentPage === pages ? "disabled" : ""}`}
        >
          Next
        </button>
      </div>
      <div className="page-count-container">
        <p>
          Page {currentPage} of {pages}
        </p>
      </div>
    </>
  );
}
