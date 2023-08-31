import React, { useEffect, useState } from 'react';
import CountUp from "react-countup";
import { Link } from 'react-router-dom';
import { Card, CardBody, Col } from 'reactstrap';
import api from '../../Apis/Apis'

const Widgets = () => {

    const [totalrate, settotalrate] = useState()
    const [totalcategories, settotalcategories] = useState()
    const [totalsuppliers, settotalsuppliers] = useState()
    const [totaloutofstock, settotaloutofstock] = useState()

    useEffect(() => {
        api.get('/api/zwl/rate/')
            .then((response) => {
                settotalrate(
                    response.data.rates.reduce((a, v) => a = a + v.rate).rate)
            })
        api.get('/api/categories/')
            .then((response) => {
                settotalcategories(response.data.categories.length)
            })
        api.get('/api/suppliers/')
            .then((response) => {
                settotalsuppliers(response.data.suppliers.length)
            })
        api.get('/api/outofstock/')
            .then((response) => {
                settotaloutofstock(response.data.outofstock.length)
            })
    }, [])

    const ecomWidgets = [
        {
            id: 1,
            cardColor: "primary",
            label: "Current Exchange Rate",
            badge: "ri-arrow-right-up-line",
            badgeClass: "success",
            percentage: "+16.24",
            counter: "0",
            countervalue: totalrate !== undefined ? <>$1 USD = ${totalrate} RTGS</> : "",
            link: "Click for more info",
            Link: "/exchangerate",
            bgcolor: "success",
            icon: "ri-database-2-line",
            decimals: 0,
            prefix: "",
            suffix: ""
        },
        {
            id: 2,
            cardColor: "success",
            label: "Products Out of Stock",
            badge: "ri-arrow-right-up-line",
            badgeClass: "success",
            percentage: "+29.08",
            counter: "0",
            countervalue: totaloutofstock !== undefined ? <>{totaloutofstock}</> : "",
            link: "Click for more info",
            Link: "/products",
            bgcolor: "warning",
            icon: " ri-questionnaire-line",
            decimals: 0,
            prefix: "",
            suffix: ""
        },
        {
            id: 3,
            cardColor: "secondary",
            label: "Total Suppliers",
            badge: "ri-arrow-right-down-line",
            badgeClass: "danger",
            percentage: "-3.57",
            counter: "0",
            countervalue: totalsuppliers !== undefined ? <>{totalsuppliers}</> : "",
            link: "Click for more info",
            Link: "/suppliers",
            bgcolor: "info",
            icon: "ri-chat-follow-up-line",
            decimals: 0,
            prefix: "",
            separator: ",",
            suffix: ""
        },
        {
            id: 4,
            cardColor: "info",
            label: "Total Categories",
            badgeClass: "muted",
            percentage: "+0.00",
            counter: "0",
            countervalue: totalcategories !== undefined ? <>{totalcategories}</> : "",
            link: "Click for more info",
            Link: "/categories",
            bgcolor: "success",
            icon: "bx bx-user-circle",
            decimals: 0,
            prefix: "",
            suffix: ""
        }
    ];

    return (
        <React.Fragment>
            {ecomWidgets.map((item, key) => (
                <Col xl={3} md={6} key={key}>
                    <Card className="card-animate">
                        <CardBody>
                            <div className="d-flex align-items-center">
                                <div className="flex-grow-1 overflow-hidden">
                                    <p className="text-uppercase fw-medium text-muted text-truncate mb-0">{item.label}</p>
                                </div>
                            </div>
                            <div className="d-flex align-items-end justify-content-between mt-4">
                                <div>
                                    <h4 className="fs-17 fw-semibold ff-secondary mb-4">
                                        <span className="counter-value" data-target="559.25">
                                            {item.countervalue !== "" ? item.countervalue : <CountUp
                                                start={0}
                                                prefix={item.prefix}
                                                suffix={item.suffix}
                                                separator={item.separator}
                                                end={item.counter}
                                                decimals={item.decimals}
                                                duration={2}
                                            />}
                                        </span></h4>
                                    <Link to={item.Link} className="text-decoration-underline">{item.link}</Link>
                                </div>
                                <div className="avatar-sm flex-shrink-0">
                                    <span className={"avatar-title rounded fs-3 bg-soft-" + item.bgcolor}>
                                        <i className={`text-${item.bgcolor} ${item.icon}`}></i>
                                    </span>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>))}
        </React.Fragment>
    );
};

export default Widgets;