import React, { useEffect, useState } from 'react';
import { Card, CardBody, Col, Container, Input, Label, Alert, Row, Button, Form } from 'reactstrap';
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
import { useNavigate } from 'react-router-dom'
import { Link } from "react-router-dom";
import logoblue from '../../assets/Pictures/logoblue.png'
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { IsAdminLogedOut, IsAdminLogedIn } from '../../store/Auth/IsAdmin';
import { IsloggedInTRIGGER } from '../../store/Auth/Islogged';

import { useJwt, isExpired, decodeToken } from "react-jwt";

export const Poisonous_Api = () => {

    const navigate = useNavigate()
    const IsAdminLogged = ([...useSelector(state => state.IsAdminLogged)].map((data) => data.status))[0]
    const [token, settoken] = useState("")
    const handletokenChange = (e) => { settoken(e.target.value) }

    const isMyTokenExpired = isExpired(token);

    // useEffect(()=>{

    // })

    const errornotify = () => toast("Invalid Token Entered", { position: "top-center", hideProgressBar: true, closeOnClick: false, className: 'bg-danger text-white' });
    const createnotify = () => toast("You Have Successfully Updated Your Authorization Token", { position: "top-center", hideProgressBar: true, className: 'bg-success text-white' });

    const Poisonous_data = {
        "id": 1,
        "token": token,
        "change_baseCurrency": 1
    }

    const HandlePoisonous_api_update = () => {
        if (isMyTokenExpired === false) {
            axios.post("http://127.0.0.1:8000/api/poisonous/", Poisonous_data)
                .then((response) => {
                    if (response.data.message === "Success") {
                        createnotify()
                        if (IsAdminLogged === true) {
                            navigate("/")
                        }
                        else { navigate("/tillpoint") }
                    }
                })
                .catch((error) => {
                    console.log(error)
                    toast("Connection Error, Check your internet and retry!!!", { position: "top-center", hideProgressBar: true, closeOnClick: false, className: 'bg-danger text-white' });
                })
        }
        else {
            errornotify()
        }
    }

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
                                            <Alert className="alert-borderless alert-warning text-center mb-2 mx-2" role="alert">
                                                <h5 className="text-primary">Your Authorization Token Has Expired !!</h5>
                                                <p className="alert-borderless alert-warning text-center mb-2 mx-2" role="alert">Contact Poscloud to purchase new authorization Token.</p>
                                            </Alert>
                                        </div>
                                        <div className="p-2 mt-4">
                                            <Form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    HandlePoisonous_api_update()
                                                    return false;
                                                }}
                                                action="#">
                                                <div className="mb-3">
                                                    <Label className="form-label" htmlFor="password-input">Enter New Token</Label>
                                                    <div className="position-relative auth-pass-inputgroup mb-3">
                                                        <Input
                                                            name="Token" required
                                                            type='text'
                                                            className="form-control pe-5"
                                                            placeholder="Enter Token" value={token ?? ""} onChange={handletokenChange}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mt-4">
                                                    <Button color="success" className="btn btn-success w-100" type="submit" style={{ backgroundColor: "#204887" }}>Submit</Button>
                                                </div>
                                            </Form>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </ParticlesAuth>
        </React.Fragment>
    )
}