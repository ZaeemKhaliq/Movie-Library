import AuthService from "../services/auth-service";

export function authChecker() {
  const user = JSON.parse(localStorage.getItem("user"));

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  };

  const logout = () => {
    AuthService.logout();
  };

  if (user) {
    const decodedJwt = parseJwt(user.token);

    if (decodedJwt.exp * 1000 < Date.now()) {
      console.log("Log me out!");
      logout();
    } else {
      console.log("Keep me logged in !");
    }
  }
}
