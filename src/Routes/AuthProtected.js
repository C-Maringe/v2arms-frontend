import React, { useEffect } from "react";
import { Route, useNavigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Login from "../pages/Authentication/Login";
import { Islogged0utTRIGGER } from "../store/Auth/Islogged";

const AuthProtected = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const CheckIfLogged = ([...useSelector(state => state.IsLoggedIn)].map((data) => data.status))[0]
  const IsAdminLogged = ([...useSelector(state => state.IsAdminLogged)].map((data) => data.status))[0]

  useEffect(() => {
    if (CheckIfLogged === true && IsAdminLogged === false) {
      navigate('/tillpoint')
    }
    if (CheckIfLogged === false) {
      navigate('/login')
      dispatch(Islogged0utTRIGGER());
    }
  }, [CheckIfLogged, IsAdminLogged])

  return <>{CheckIfLogged === true && IsAdminLogged === true ? <Outlet /> : <Login />}</>;
};

const AccessRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => {
        return (<> <Component {...props} /> </>);
      }}
    />
  );
};

export { AuthProtected, AccessRoute };