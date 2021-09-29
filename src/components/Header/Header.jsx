import { useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";

import AuthService from "../../services/auth-service";

import "./Header.scss";

export default function Header() {
  const user = useSelector((state) => state.auth.user);
  console.log(user);

  const logout = () => {
    AuthService.logout();

    window.location.reload();
  };

  return (
    <header>
      <div className="header">
        <div className="header-fields">
          <div className="left"></div>
          <div className="middle">
            <div className="title-container">
              <h2 className="title">MOVIE LIBRARY</h2>
            </div>
          </div>
          <div className="right">
            <div className="auth-links-container">
              {!user ? (
                <>
                  <div className="auth-link">
                    <p>
                      <NavLink to="/login" exact activeClassName="active">
                        LOGIN
                      </NavLink>
                    </p>
                  </div>
                  <div className="auth-link">
                    <p>
                      <NavLink to="/signup" exact activeClassName="active">
                        SIGNUP
                      </NavLink>
                    </p>
                  </div>
                </>
              ) : (
                <div className="auth-link">
                  <p onClick={logout}>LOGOUT</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <nav className="nav-container">
        <div className="nav-links">
          <NavLink to="/" exact activeClassName="active">
            <div className="nav-link">HOME</div>
          </NavLink>

          <NavLink to="/movies" activeClassName="active">
            <div className="nav-link">MOVIES</div>
          </NavLink>
          <NavLink to="/add-movie" activeClassName="active">
            <div className="nav-link">ADD MOVIE</div>
          </NavLink>
        </div>
        {user && (
          <div className="logged-in-user">
            <h4>WELCOME</h4>
            <p>{user.user.name}</p>
          </div>
        )}
      </nav>
    </header>
  );
}
