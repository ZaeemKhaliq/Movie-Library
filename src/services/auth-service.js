import http from "../http-common";

class AuthService {
  signup(data) {
    return http.post("/auth/signup", data);
  }

  login(data) {
    return http.post("/auth/login", data);
  }

  logout() {
    localStorage.removeItem("user");
  }
}

export default new AuthService();
