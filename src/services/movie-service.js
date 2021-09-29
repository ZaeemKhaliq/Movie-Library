import http from "../http-common";

class MovieService {
  getAllMovies() {
    return http.get("/movies");
  }
  getOneMovie(id) {
    return http.get(`/movies/${id}`);
  }
  postMovie(data) {
    return http.post("/movies/add-movie", data);
  }
  updateMovie(id, data) {
    return http.put(`/movies/update-movie/${id}`, data);
  }
  addImages(id, data) {
    return http.put(`/movies/add-images/${id}`, data);
  }
  deleteMovie(id) {
    return http.delete(`/movies/delete-movie/${id}`);
  }
  getComments(id) {
    return http.get(`/comments/get-comments/${id}`);
  }
  postComment(data) {
    return http.post(`/comments/add-comment`, data);
  }
  deleteComment(id) {
    return http.delete(`/comments/delete-comment/${id}`);
  }
  updateComment(id, data) {
    return http.put(`/comments/edit-comment/${id}`, data);
  }
}

export default new MovieService();
