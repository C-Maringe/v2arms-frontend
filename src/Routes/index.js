import React, { useEffect } from "react";
import { Route, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Routes } from "react-router-dom";
import NonAuthLayout from "../Layouts/NonAuthLayout";
import VerticalLayout from "../Layouts/index";
import { authProtectedRoutes, publicRoutes, TillPointRoute } from "./allRoutes";
import { AuthProtected } from './AuthProtected';
import Login from "../pages/Authentication/Login";
import TillpointContainer from "../pro_pages/TillPoint/TillpointContainer";

const Index = () => {

    const navigate = useNavigate()

    const CheckIfLogged = ([...useSelector(state => state.IsLoggedIn)].map((data) => data.status))[0]
    const IsAdminLogged = ([...useSelector(state => state.IsAdminLogged)].map((data) => data.status))[0]

    useEffect(() => {
        if (CheckIfLogged === false) { navigate("/login") }
    }, [CheckIfLogged])

    return (
        <React.Fragment>
            <Routes>
                <Route element={<NonAuthLayout />}>
                    {publicRoutes.map((route, idx) => (
                        <Route
                            path={route.path}
                            element={route.component}
                            key={idx}
                            exact={true}
                        />
                    ))}
                </Route>
                <Route >
                    {CheckIfLogged === true && IsAdminLogged === false ?
                        TillPointRoute.map((route, idx) => (
                            <Route
                                path={route.path}
                                element={route.component}
                                key={idx}
                                exact={true}
                            />
                        ))
                        : CheckIfLogged === true && IsAdminLogged === true ?
                            <Route element={<AuthProtected />}>
                                <Route element={<VerticalLayout />}>
                                    {authProtectedRoutes.map((route, idx) => (
                                        <Route
                                            path={route.path}
                                            element={route.component}
                                            key={idx}
                                            exact={true}
                                        />
                                    ))}
                                </Route>
                                <Route path="/tillpoint" element={<TillpointContainer />} />
                            </Route>
                            : <Route path="/login" element={<Login />} />}
                </Route>
                <Route element={<AuthProtected />}>
                    <Route element={<VerticalLayout />}>
                        {authProtectedRoutes.map((route, idx) => (
                            <Route
                                path={route.path}
                                element={route.component}
                                key={idx}
                                exact={true}
                            />
                        ))}
                    </Route>
                </Route>
            </Routes>
        </React.Fragment >
    );
};

export default Index;