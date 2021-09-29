import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter,
} from "react-router-dom";
import { useDispatch } from "react-redux";

import "./App.scss";

import { authChecker } from "./helpers/authChecker";

import { setUser } from "./store/reducers/auth";

import LocationContext from "./components/Contexts/LocationContext";

import HomePage from "./components/HomePage/HomePage";
import Header from "./components/Header/Header";
import Movies from "./components/Movies/Movies";
import MovieDetails from "./components/MovieDetails/MovieDetails";
import MovieStore from "./components/MovieStore/MovieStore";
import Login from "./components/AuthPages/Login/Login";
import Signup from "./components/AuthPages/Signup/Signup";
import AddMovie from "./components/AddMovie/AddMovie";
import EditMovie from "./components/EditMovie/EditMovie";
import Footer from "./components/Footer/Footer";

function App(props) {
  let location = props.location.pathname;
  const dispatch = useDispatch();

  useEffect(() => {
    authChecker();
  }, [location]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      dispatch(setUser(user));
    }
  }, []);

  return (
    <main className="root-container">
      <LocationContext>
        <Header />
        <MovieStore />
        <Switch>
          <Route path="/" exact component={HomePage} />
          <Route path="/movies" exact component={Movies} />
          <Route path="/movies/:id" exact component={MovieDetails} />
          <Route path="/login" exact component={Login} />
          <Route path="/signup" exact component={Signup} />
          <Route path="/add-movie" exact component={AddMovie} />
          <Route path="/edit-movie/:id" exact component={EditMovie} />
        </Switch>
        <Footer />
      </LocationContext>
    </main>
  );
}

export default withRouter(App);
