import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Row } from 'reactstrap';
import { useSelector } from 'react-redux';

const Section = () => {

    const sidebar = () => {
        const element = document.getElementById("layout-rightside-coll");
        element.classList.toggle("d-none");
    };

    const UserlnfoStored = ([...useSelector(state => state.UserlnfoStored)].map((data) => data.status))[0]

    return (
        <React.Fragment>
            <Row className="mb-3 pb-1">
                <Col xs={12}>
                    <div className="d-flex align-items-lg-center flex-lg-row flex-column">
                        <div className="flex-grow-1">
                            <h4 className="fs-16 mb-1">Good {(new Date().getHours()) < 12 ? <>Morning</> : (new Date().getHours()) < 18 ? <>Afternoon</> : <>Evening</>}, {UserlnfoStored.username}!</h4>
                            <p className="text-muted mb-0">Here's what's up with your shop.</p>
                        </div>
                        <div className="mt-3 mt-lg-0">
                            <form action="#">
                                <Row className="g-3 mb-0 align-items-center">
                                    <div className="col-auto">
                                        <Link to="/products">
                                            <button type="button" className="btn btn-soft-success"><i className="ri-add-circle-line align-middle me-1"></i> Add New Product</button></Link>
                                    </div>
                                    <div className="col-auto">
                                        <button type="button" className="btn btn-soft-info btn-icon waves-effect waves-light layout-rightside-btn" onClick={() => sidebar()} ><i className="ri-pulse-line"></i></button>
                                    </div>
                                </Row>
                            </form>
                        </div>
                    </div>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default Section;