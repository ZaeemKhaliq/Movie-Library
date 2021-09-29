import { useEffect } from "react";
import { useDispatch } from "react-redux";

import MovieService from "../../services/movie-service";
import { setMovies } from "../../store/reducers/movies";

import { getMovies } from "../../store/reducers/movies";

const MovieStore = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMovies());
  }, []);

  // const getMovie = () => {
  //   return async (dispatch, getState) => {
  //     MovieService.getAllMovies()
  //       .then((response) => {
  //         console.log(response);
  //         const movies = response.data;
  //         dispatch(setMovies(movies));
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   };
  // };

  return <></>;
};

export default MovieStore;
