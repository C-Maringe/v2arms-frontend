import React, { useEffect, useState } from 'react';
import { Card, CardBody, Col, Container, Input, Label, Row, Button, Form } from 'reactstrap';
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
import { useNavigate } from 'react-router-dom'
import { Link } from "react-router-dom";
import logoblue from '../../assets/Pictures/logoblue.png'
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { IsAdminLogedOut, IsAdminLogedIn } from '../../store/Auth/IsAdmin';
import { IsloggedInTRIGGER } from '../../store/Auth/Islogged';
import { isExpired, decodeToken } from "react-jwt";
import { OPENPAYMENTWARNING } from '../../store/Loader/PaymentWarning';

const Login = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const IsAdminLogged = ([...useSelector(state => state.IsAdminLogged)].map((data) => data.status))[0]
    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")
    const handleemailChange = (e) => { setemail(e.target.value) }
    const handlepasswordChange = (e) => { setpassword(e.target.value) }

    const handlelogindata = {
        username: email,
        password: password
    };

    const errornotify = () => toast("Error ! An error occurred.", { position: "top-center", hideProgressBar: true, closeOnClick: false, className: 'bg-danger text-white' });
    const createnotify = () => toast("You Have Successfully Logged In", { position: "top-center", hideProgressBar: true, className: 'bg-success text-white' });

    const [datalogs, setdatalogs] = useState("")

    console.log((Date.now() / 1000))

    const HandlePoisonous_api = () => {
        axios.get("http://127.0.0.1:8000/api/poisonous/view/")
            .then((response) => {
                if (response.status === 200) {
                    if (isExpired(response.data.poisonous_data[0].token) === true) {
                        navigate("/payup")
                    }
                    else {
                        if (IsAdminLogged === true) {
                            navigate("/")
                            if (decodeToken(response.data.poisonous_data[0].token).exp - (Date.now() / 1000) < 259200000) {
                                dispatch(OPENPAYMENTWARNING())
                            }
                        }
                        else {
                            navigate("/tillpoint")
                            if (decodeToken(response.data.poisonous_data[0].token).exp - (Date.now() / 1000) < 259200000) {
                                dispatch(OPENPAYMENTWARNING())
                            }
                        }
                    }
                }
                else {
                    toast("Connection Error.", { position: "top-center", hideProgressBar: true, closeOnClick: false, className: 'bg-danger text-white' });
                }
            })
            .catch((error) => { errornotify() })
    }


    const handlelogin = () => {
        axios.post("http://127.0.0.1:8000/api/login/", handlelogindata)
            .then((response) => {
                if (response.data.status_code === 200) {
                    dispatch({ type: "USER_INFO_STORED", payload: response.data.user[0] })
                    setdatalogs(response.data.user[0])
                    if (response.data.user[0].employee_status === 'ACTIVE') {
                        if (response.data.user[0].role === 'ADMIN') {
                            createnotify()
                            dispatch(IsAdminLogedIn())
                            dispatch(IsloggedInTRIGGER())
                            setTimeout(() => {
                                HandlePoisonous_api()
                            }, 2000)
                        }
                        else {
                            dispatch(IsAdminLogedOut())
                            dispatch(IsloggedInTRIGGER())
                            createnotify()
                            setTimeout(() => {
                                HandlePoisonous_api()
                            }, 2000)
                        }
                    }
                }
                else errornotify()
            })
            .catch((error) => { errornotify() })
    }

    const [passwordType, setPasswordType] = useState(false)
    const [PasswordSeverity, setPasswordSeverity] = useState('password')
    const TogglePasswordType = (e) => { setPasswordType(!passwordType) }

    useEffect(() => {
        if (passwordType === false) {
            setPasswordSeverity('password')
        }
        else if (passwordType === true) {
            setPasswordSeverity('text')
        }
    }, [passwordType])

    document.title = "Arcs | SignIn ";
    return (
        <React.Fragment>
            <ToastContainer />
            <ParticlesAuth>
                <div className="auth-page-content">
                    <Container>
                        <Row>
                            <Col lg={12}>
                                <div className="text-center mt-sm-5 mb-4 text-white-50">
                                    <div>
                                        <img src={logoblue} alt="" height="100" />
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row className="justify-content-center">
                            <Col md={8} lg={6} xl={5}>
                                <Card className="mt-4">
                                    <CardBody className="p-4">
                                        <div className="text-center mt-2">
                                            <h5 className="text-primary">Welcome Back !</h5>
                                            <p className="text-muted">Sign in to continue to Arcs Retail System.</p>
                                        </div>
                                        <div className="p-2 mt-4">
                                            <Form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    handlelogin()
                                                    return false;
                                                }}
                                                action="#">
                                                <div className="mb-3">
                                                    <Label htmlFor="email" className="form-label">User Name</Label>
                                                    <Input
                                                        name="email" required
                                                        className="form-control"
                                                        placeholder="Enter User Name"
                                                        type="text" value={email ?? ""} onChange={handleemailChange}
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <div className="float-end">
                                                        <Link to="/forgot-password" className="text-muted">Forgot password?</Link>
                                                    </div>
                                                    <Label className="form-label" htmlFor="password-input">Password</Label>
                                                    <div className="position-relative auth-pass-inputgroup mb-3">
                                                        <Input
                                                            name="password" required
                                                            type={PasswordSeverity}
                                                            className="form-control pe-5"
                                                            placeholder="Enter Password" value={password ?? ""} onChange={handlepasswordChange}
                                                        />
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault()
                                                                TogglePasswordType()
                                                            }}

                                                            className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted" type="button" id="password-addon"><i className="ri-eye-fill align-middle"></i></button>
                                                    </div>
                                                </div>
                                                <div className="form-check">
                                                    <Input className="form-check-input" type="checkbox" value="" id="auth-remember-check" />
                                                    <Label className="form-check-label" htmlFor="auth-remember-check">Remember me</Label>
                                                </div>

                                                <div className="mt-4">
                                                    <Button color="success" className="btn btn-success w-100" type="submit" style={{ backgroundColor: "#204887" }}>Sign In</Button>
                                                </div>
                                            </Form>
                                        </div>
                                    </CardBody>
                                </Card>

                                <div className="mt-4 text-center">
                                    <p className="mb-0">Don't have an account ? <Link to="/register" className="fw-semibold text-primary text-decoration-underline"> Signup </Link> </p>
                                </div>

                            </Col>
                        </Row>
                    </Container>
                </div>
            </ParticlesAuth>
        </React.Fragment>
    );
};

export default (Login);