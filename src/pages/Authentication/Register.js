import React, { useState } from "react";
import { Row, Col, CardBody, Card, Container, Input, Label, Form } from "reactstrap";
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
import logoblue from '../../assets/Pictures/logoblue.png'
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'
import api from "../../pro_pages/TillPoint/Api/api";

const Register = () => {

    const navigate = useNavigate()
    const errornotify = () => toast("Error ! An error occurred.", { position: "top-center", hideProgressBar: true, closeOnClick: false, className: 'bg-danger text-white' });
    const createnotify = () => toast("You Have Successfully created your Account", { position: "top-center", hideProgressBar: true, className: 'bg-success text-white' });

    const [job, setJob] = useState("")
    const [email, setEmail] = useState("")
    const [firstname, setFirstname] = useState("")
    const [lastname, setLastname] = useState("")
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("")
    const [phone, setPhone] = useState("")
    const [department, setdepartment] = useState("")
    const [locationId, setlocationId] = useState(1)

    const handlesetemailChange = (e) => { setEmail(e.target.value) }
    const handlefirstnameChange = (e) => { setFirstname(e.target.value) }
    const handlelastnameChange = (e) => { setLastname(e.target.value) }
    const handlepasswordChange = (e) => { setPassword(e.target.value) }
    const handleusernameChange = (e) => { setUsername(e.target.value) }
    const handlephoneChange = (e) => { setPhone(e.target.value) }

    const handleemployeedata = {
        "email": email,
        "firstname": firstname,
        "status": "PENDING",
        "lastname": lastname,
        "password": password,
        "phone": phone,
        "employee_status": "PENDING",
        "supervisorcode": "#$%%$%^&@&^&%%%$^#",
        "role": "PENDING",
        "username": username,
    }

    const handleaddemployee = () => {
        api.post("/api/employee/create/", handleemployeedata)
            .then((response) => {
                if (response.status === 201) {
                    createnotify()
                    setJob(""); setEmail(""); setFirstname(""); setLastname(""); setPassword(""); setUsername(""); setPhone(""); setdepartment(""); setlocationId("");
                    setTimeout(() => {
                        navigate("/login")
                    }, 2000)
                }
                else errornotify()
            })
            .catch((error) => { errornotify(); console.log(error) })
    }

    document.title = "Arms | Create Account ";
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
                                        <Link to="/" className="d-inline-block auth-logo">
                                            <img src={logoblue} alt="" height="100" />
                                        </Link>
                                    </div>
                                </div>
                            </Col>
                        </Row>

                        <Row className="justify-content-center">
                            <Col md={8} lg={6} xl={5}>
                                <Card className="mt-1">

                                    <CardBody className="p-2">
                                        <div className="text-center mt-2">
                                            <h5 className="text-primary">Create New Account</h5>
                                        </div>
                                        <div className="p-1 mt-8">
                                            <Form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    handleaddemployee()
                                                    return false;
                                                }}
                                                className="needs-validation" action="#">
                                                <Row className="gy-4">
                                                    <Col xxl={4} md={6}>
                                                        <div>
                                                            <Label htmlFor="basiInput" className="form-label">Enter Email Address</Label>
                                                            <Input type="email" className="form-control" id="basiInput" placeholder=" Email" required
                                                                value={email ?? ""} onChange={handlesetemailChange} />
                                                        </div>
                                                    </Col>
                                                    <Col xxl={3} md={6}>
                                                        <div>
                                                            <Label htmlFor="labelInput" className="form-label">Enter First Name</Label>
                                                            <Input type="text" className="form-control" id="labelInput" placeholder=" First Name" required
                                                                value={firstname ?? ""} onChange={handlefirstnameChange} />
                                                        </div>
                                                    </Col>
                                                    <Col xxl={3} md={6}>
                                                        <div>
                                                            <Label htmlFor="valueInput" className="form-label">Enter Last Name</Label>
                                                            <Input type="text" className="form-control" id="valueInput" placeholder=" Last Name" required
                                                                value={lastname ?? ""} onChange={handlelastnameChange} />
                                                        </div>
                                                    </Col>
                                                    <Col xxl={4} md={6}>
                                                        <div>
                                                            <Label htmlFor="basiInput" className="form-label">Enter User Name</Label>
                                                            <Input type="text" className="form-control" id="basiInput" placeholder=" User Name" required
                                                                value={username ?? ""} onChange={handleusernameChange} />
                                                        </div>
                                                    </Col>

                                                    <Col xxl={3} md={6}>
                                                        <div>
                                                            <Label htmlFor="labelInput" className="form-label">Enter New Password</Label>
                                                            <Input type="text" className="form-control" id="labelInput" placeholder=" Password" required
                                                                value={password ?? ""} onChange={handlepasswordChange} />
                                                        </div>
                                                    </Col>

                                                    <Col xxl={3} md={6}>
                                                        <div>
                                                            <Label htmlFor="placeholderInput" className="form-label">Enter Phone Number</Label>
                                                            <Input type="number" className="form-control" id="placeholderInput" placeholder=" Phone" required
                                                                value={phone ?? ""} onChange={handlephoneChange} />
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <div className="mb-4" style={{ marginTop: 10 }}>
                                                    <p className="mb-0 fs-12 text-muted fst-italic">By registering you agree to the Arms_
                                                        <Link to="#" className="text-primary text-decoration-underline fst-normal fw-medium">Terms of Use</Link></p>
                                                </div>

                                                <div className="mt-4">
                                                    <button className="btn btn-success w-100" type="submit" style={{ backgroundColor: "#204887" }}>Sign Up</button>
                                                </div>
                                            </Form>
                                        </div>
                                    </CardBody>
                                </Card>
                                <div className="mt-4 text-center">
                                    <p className="mb-0">Already have an account ? <Link to="/login" className="fw-semibold text-primary text-decoration-underline"> Signin </Link> </p>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </ParticlesAuth>
        </React.Fragment>
    );
};

export default Register;
