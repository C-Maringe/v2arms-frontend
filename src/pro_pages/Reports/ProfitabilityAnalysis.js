import React, { useState, useEffect, useRef } from "react";
import {
    Card, CardBody, Col, Container, Nav, NavItem, NavLink, Row, CardHeader, Button,
    Label, Modal, ModalBody, ModalHeader, TabPane, TabContent, Input, Table
} from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import classnames from 'classnames';
import SwiperCore, { Autoplay } from "swiper";
import { useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import moment from 'moment'
import Flatpickr from "react-flatpickr";
import api from "../TillPoint/Api/api";
import { Toast } from 'primereact/toast';
import Select from "react-select";
import CountUp from "react-countup";

const ProfitabilityAnalysis = () => {
    SwiperCore.use([Autoplay])
    const toast = useRef(null);

    var today = new Date();
    const date = new Date(today)
    date.setDate(date.getDate())
    var startdate = date.toISOString().split("T")[0]
    const date1 = new Date(today)
    date1.setDate(date1.getDate() - 7)
    var startdateweek = date1.toISOString().split("T")[0]
    const date2 = new Date(today)
    date2.setDate(date2.getDate() - 30)
    var startdatemonth = date2.toISOString().split("T")[0]
    const date3 = new Date(today)
    date3.setDate(date3.getDate() + 1)
    var enddate = date3.toISOString().split("T")[0]

    const selecteddate1 = {
        startdate: startdate,
        enddate: enddate
    }

    const [selecteddate, setselecteddate] = useState(selecteddate1)
    const [Salesdata, setSalesdata] = useState([])
    const fetchdata = async () => {
        const response = await api.post('/api/view/sales/', selecteddate)
        if (response.data.status_code === 200) {
            setSalesdata(response.data.sales.filter(({ status }) => status === 'COMPLETE').map((data) => ({
                id: data.id, datetime: data.datetime, channel: data.channel, status: data.status, product: data.product, cost_price: data.cost_price, price: data.price, quantity: data.quantity,
                total: data.total, profits: data.total - data.cost_price * data.quantity
            })))
        }
        else if (response.data.status_code === 400) {
            setSalesdata([])
        }
    }

    useEffect(() => {
        fetchdata()
    }, [selecteddate])

    const { layoutModeType } = useSelector(state => ({ layoutModeType: state.Layout.layoutModeType, }))

    const newArr = Salesdata.sort(function (a, b) { return b.id - a.id });
    const columns = [
        {
            name: <span className='font-weight-bold fs-13'>ID</span>,
            selector: row => row.id,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Date</span>,
            selector: row => moment(row.datetime).format('DD-MM-YYYY[ ]HH:mm:ss'),
            sortable: true,
            grow: 2.5
        },
        {
            name: <span className='font-weight-bold fs-13'>Product Name</span>,
            selector: row => row.product,
            sortable: true,
            grow: 3.5
        },
        {
            name: <span className='font-weight-bold fs-13'>Channel</span>,
            selector: row => row.channel,
            sortable: true,
            grow: 1.5
        },
        {
            name: <span className='font-weight-bold fs-13'>Status</span>,
            selector: row => row.status,
            sortable: true,
            grow: 1
        },
        {
            name: <span className='font-weight-bold fs-13'>Cost</span>,
            selector: row => row.cost_price,
            sortable: true,
            grow: 1
        },
        {
            name: <span className='font-weight-bold fs-13'>Unit Price</span>,
            selector: row => row.price,
            sortable: true,
            grow: 1
        },
        {
            name: <span className='font-weight-bold fs-13'>Quantity</span>,
            selector: row => row.quantity,
            sortable: true,
            grow: 1
        },
        {
            name: <span className='font-weight-bold fs-13'>Total Price</span>,
            selector: row => row.total,
            sortable: true,
            grow: 1
        },
        {
            name: <span className='font-weight-bold fs-13'>Profits</span>,
            selector: row => row.profits,
            sortable: true,
            grow: 1
        }
    ];

    const [search, setNewSearch] = useState("");
    const handlesearch = (e) => { setNewSearch(e.target.value) }
    const column = Object.keys(newArr[0] || {});
    const filtered = !search ? newArr : newArr.filter((data) =>
        column.some((column) =>
            data[column] === null ? "" : data[column].toString()
                .toLowerCase().indexOf(search.toString().toLowerCase()) > -1
        )
    )

    const exportExcel = () => {
        import('xlsx').then(xlsx => {
            const worksheet = xlsx.utils.json_to_sheet(filtered);
            const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            saveAsExcelFile(excelBuffer, 'transactions');
        });
    }

    const saveAsExcelFile = (buffer, fileName) => {
        import('file-saver').then(module => {
            if (module && module.default) {
                let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
                let EXCEL_EXTENSION = '.xlsx';
                const data = new Blob([buffer], {
                    type: EXCEL_TYPE
                });
                module.default.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
            }
        });
    }
    const [OpenAdd, setOpenAdd] = useState(false);
    const toggleOpenAdd = () => { setOpenAdd(!OpenAdd); };
    const [selectedRange, setSelectedRange] = useState()
    const [selectedRange2, setSelectedRange2] = useState()

    const [activeTab, setActiveTab] = useState('1')

    const toggleTab = (tab) => { if (activeTab !== tab) { setActiveTab(tab); } }

    const [activePage, setActivePage] = useState('1')
    const togglePage = (tab) => { if (activePage !== tab) { setActivePage(tab); } }

    const SalesDataFilterd = Salesdata

    const ecomWidgets = [
        {
            id: 1,
            cardColor: "primary",
            label: "Number OF Transactions",
            badge: "ri-arrow-right-up-line",
            badgeClass: "success",
            percentage: "+16.24",
            counter: SalesDataFilterd.length,
            link: "Click for more info",
            Link: "/addassets",
            bgcolor: "success",
            icon: "ri-database-2-line",
            decimals: 0,
            prefix: "",
            suffix: ""
        },
        {
            id: 2,
            cardColor: "success",
            label: "SALES IN USD-CASH PROFITS",
            badge: "ri-arrow-right-up-line",
            badgeClass: "success",
            percentage: "+29.08",
            counter: SalesDataFilterd.filter(({ channel }) => channel === 'CASH-USD').reduce((accumulator, object) => {
                return accumulator + object.total;
            }, 0).toFixed(2),
            link: "Click for more info",
            Link: "/products",
            bgcolor: "warning",
            icon: " ri-questionnaire-line",
            decimals: 2,
            prefix: "$",
            suffix: ""
        },
        {
            id: 3,
            cardColor: "secondary",
            label: "SALES IN ZWL-CASH PROFITS",
            badge: "ri-arrow-right-down-line",
            badgeClass: "danger",
            percentage: "-3.57",
            counter: SalesDataFilterd.filter(({ channel }) => channel === 'CASH-ZWL').reduce((accumulator, object) => {
                return accumulator + object.total;
            }, 0).toFixed(2),
            link: "Click for more info",
            Link: "/suppliers",
            bgcolor: "info",
            icon: "ri-chat-follow-up-line",
            decimals: 2,
            prefix: "$",
            separator: "",
            suffix: ""
        },
        {
            id: 4,
            cardColor: "info",
            label: "SALES IN RTGS PROFITS",
            badgeClass: "muted",
            percentage: "+0.00",
            counter: SalesDataFilterd.filter(({ channel }) => channel !== 'CASH-ZWL' && channel !== 'CASH-USD').reduce((accumulator, object) => {
                return accumulator + object.total;
            }, 0).toFixed(2),
            link: "Click for more info",
            Link: "/categories",
            bgcolor: "success",
            icon: "bx bx-user-circle",
            decimals: 2,
            prefix: "$",
            suffix: ""
        }
    ];

    const [productsSelect, setProductsSelect] = useState([{ value: { id: 0, cost: 0, price: 0 } }])
    const fetchdata1 = async () => {
        const response = await api.get('/api/allproducts/')
        if (response.status === 200) { setProductsSelect(response.data.map((data) => ({ value: { id: data.id, cost: data.cost, price: data.price }, label: data.name }))) }
        else if (response.data.status !== 200) {
            setProductsSelect([]);
        }
    }

    useEffect(() => {
        fetchdata1()
    }, [])

    const [SelectedProduct, setSelectedProduct] = useState({ id: 0, cost: 0, price: 0 })

    const [adjustedPrice, setAdjustedPrice] = useState(0)

    const HandleAdjustedPriceChange = (e) => { setAdjustedPrice(e.target.value) }

    document.title = "Arcs | Profitability";
    return (
        <React.Fragment>
            <Toast ref={toast} />
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="Profitability Analysis" pageTitle="Profitability Analysis" />
                    <Row>
                        <Col>
                            <div className="h-100">
                                <Row className="mb-1 pb-1">
                                    <Col xs={12}>
                                        <div className="d-flex align-items-lg-center flex-lg-row flex-column">
                                            <div className="flex-grow-1">
                                                <h4 className="fs-16 mb-1">PROFITABILITY REPORT</h4>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg={12}>
                                        <div>
                                            <div className="d-flex">
                                                <Nav pills className="animation-nav profile-nav gap-2 gap-lg-3 flex-grow-1"
                                                    role="tablist" style={layoutModeType === 'light' ? { borderRadius: 5, paddingTop: 5, paddingBottom: 5, backgroundColor: "#405189" } : { borderRadius: 5, paddingTop: 5, paddingBottom: 5 }}>
                                                    <NavItem>
                                                        <NavLink
                                                            href="#todaysales"
                                                            className={classnames({ active: activePage === '1' })}
                                                            onClick={() => {
                                                                togglePage('1')
                                                            }}
                                                        >
                                                            <i className="ri-list-unordered d-inline-block d-md-none"></i> <span
                                                                className="d-none d-md-inline-block"><div style={{ color: "white" }}>MULTIPLE PRODUCTS PROFITABILITY ANALYSIS</div></span>
                                                        </NavLink>
                                                    </NavItem>
                                                    <NavItem>
                                                        <NavLink
                                                            href="#weeksales"
                                                            className={classnames({ active: activePage === '2' })}
                                                            onClick={() => {
                                                                togglePage('2');
                                                            }}
                                                        >
                                                            <i className="ri-airplay-fill d-inline-block d-md-none"></i> <span
                                                                className="d-none d-md-inline-block"><div style={{ color: "white" }}>SINGLE PRODUCT PROFITABILITY ANALYSIS</div></span>
                                                        </NavLink>
                                                    </NavItem>
                                                </Nav>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                                <TabContent activeTab={activePage} className="mt-4">
                                    <TabPane tabId={"1"}>
                                        <Row>
                                            <Col lg={12}>
                                                <div>
                                                    <div className="d-flex">
                                                        <Nav pills className="animation-nav profile-nav gap-2 gap-lg-3 flex-grow-1"
                                                            role="tablist" style={layoutModeType === 'light' ? { borderRadius: 5, paddingTop: 5, paddingBottom: 5, backgroundColor: "#405189" } : { borderRadius: 5, paddingTop: 5, paddingBottom: 5 }}>
                                                            <NavItem>
                                                                <NavLink
                                                                    href="#todaysales"
                                                                    className={classnames({ active: activeTab === '1' })}
                                                                    onClick={() => {
                                                                        toggleTab('1'); setselecteddate({
                                                                            startdate: startdate,
                                                                            enddate: enddate
                                                                        })
                                                                    }}
                                                                >
                                                                    <i className="ri-list-unordered d-inline-block d-md-none"></i> <span
                                                                        className="d-none d-md-inline-block"><div style={{ color: "white" }}>DAILY</div></span>
                                                                </NavLink>
                                                            </NavItem>
                                                            <NavItem>
                                                                <NavLink
                                                                    href="#weeksales"
                                                                    className={classnames({ active: activeTab === '2' })}
                                                                    onClick={() => {
                                                                        toggleTab('2'); setselecteddate({
                                                                            startdate: startdateweek,
                                                                            enddate: enddate
                                                                        })
                                                                    }}
                                                                >
                                                                    <i className="ri-airplay-fill d-inline-block d-md-none"></i> <span
                                                                        className="d-none d-md-inline-block"><div style={{ color: "white" }}>WEEK TO DATE</div></span>
                                                                </NavLink>
                                                            </NavItem>
                                                            <NavItem>
                                                                <NavLink
                                                                    href="#monthsales"
                                                                    className={classnames({ active: activeTab === '3' })}
                                                                    onClick={() => {
                                                                        toggleTab('3'); setselecteddate({
                                                                            startdate: startdatemonth,
                                                                            enddate: enddate
                                                                        })
                                                                    }}
                                                                >
                                                                    <i className="ri-price-tag-line d-inline-block d-md-none"></i> <span
                                                                        className="d-none d-md-inline-block"><div style={{ color: "white" }}>MONTH TO DATE</div></span>
                                                                </NavLink>
                                                            </NavItem>
                                                            <NavItem>
                                                                <NavLink
                                                                    href="#searchsales"
                                                                    className={classnames({ active: activeTab === '4' })}
                                                                    onClick={() => { toggleTab('4'); toggleOpenAdd(); }}
                                                                >
                                                                    <i className="ri-price-tag-line d-inline-block d-md-none"></i> <span
                                                                        className="d-none d-md-inline-block"><div style={{ color: "white" }}>SEARCH DATE</div></span>
                                                                </NavLink>
                                                            </NavItem>
                                                        </Nav>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row className="mt-4">
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
                                                                                <CountUp
                                                                                    start={0}
                                                                                    prefix={item.prefix}
                                                                                    suffix={item.suffix}
                                                                                    separator={item.separator}
                                                                                    end={item.counter}
                                                                                    decimals={item.decimals}
                                                                                    duration={2}
                                                                                />
                                                                            </span></h4>
                                                                        {/* <Link to={item.Link} className="text-decoration-underline">{item.link}</Link> */}
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
                                        </Row>
                                        <Row className="mt-3 pb-1">
                                            <Col lg={12}>
                                                <Card>
                                                    <CardHeader>
                                                        <h5 className="card-title mb-0">Sales Table</h5>
                                                    </CardHeader>
                                                    <CardBody>
                                                        <Row className="g-4 mb-3">
                                                            <Col className="col-sm-auto">
                                                                <div>
                                                                    <Button onClick={() => { exportExcel() }} color="success" className="add-btn me-1" id="create-btn"><i className="ri-file-excel-2-line align-bottom me-1"></i> Excel</Button>
                                                                </div>
                                                            </Col>
                                                            <Col className="col-sm">
                                                                <div className="d-flex justify-content-sm-end">
                                                                    <div className="search-box ms-2">
                                                                        <input value={search} onChange={handlesearch} type="text" className="form-control search" placeholder="Search..." />
                                                                        <i className="ri-search-line search-icon"></i>
                                                                    </div>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                        <DataTable
                                                            columns={columns}
                                                            data={filtered}
                                                            pagination
                                                            highlightOnHover={true}
                                                            striped={true}
                                                        />
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                        </Row>
                                    </TabPane>
                                    <TabPane tabId={"2"}>
                                        <Row>
                                            <div className="animation-nav profile-nav gap-2 gap-lg-3 flex-grow-1 mb-4">
                                                <div style={layoutModeType === 'light' ? { borderRadius: 5, paddingTop: 5, backgroundColor: "#405189" } : { borderRadius: 5, paddingTop: 5 }}>
                                                    <div className="live-preview">
                                                        <Row className="gy-4">
                                                            <Col xxl={3} md={6}>
                                                                <div>
                                                                    <Label htmlFor="valueInput" className="form-label fs-17" style={{ color: "white" }}>Select Product To analyse</Label>
                                                                    <Select
                                                                        value={SelectedProduct.value}
                                                                        onChange={(sortBy) => {
                                                                            setSelectedProduct(sortBy.value);
                                                                        }}
                                                                        options={productsSelect}
                                                                        classNamePrefix="js-example-data-array"
                                                                        isLoading={true}
                                                                        menuPortalTarget={document.body}
                                                                        styles={{ menuPortal: base => ({ ...base, zIndex: 999999999 }) }}
                                                                    />
                                                                    <Card className="mt-4">
                                                                        <CardBody >
                                                                            <h5 className="card-title">Current Price and Profits</h5>
                                                                            <div >
                                                                                <div style={{ display: "flex" }}>
                                                                                    <div className="table-responsive" style={{ width: "100%" }}>
                                                                                        <Table className="table-borderless mb-0">
                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <th className="ps-0" scope="row"> COST :</th>
                                                                                                    <td className="text-muted">${SelectedProduct.cost.toFixed(2)}</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <th className="ps-0" scope="row">SELLING PRICE :</th>
                                                                                                    <td className="text-muted">${SelectedProduct.price.toFixed(2)}</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <th className="ps-0" scope="row">{SelectedProduct.price - SelectedProduct.cost < 0 ? "LOSS :" : "PROFIT :"}</th>
                                                                                                    <td className="text-muted">${(SelectedProduct.price - SelectedProduct.cost).toFixed(2)}</td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </Table>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </CardBody>
                                                                    </Card>
                                                                </div>
                                                            </Col>
                                                            <Col xxl={3} md={6}>
                                                                <Label htmlFor="valueInput" className="form-label fs-17" style={{ color: "white" }}>Examine Some Adjustments</Label>
                                                                <div>
                                                                    <Label htmlFor="valueInput" className="form-label fs-15" style={{ color: "white" }}>Enter Price</Label>
                                                                    <Input placeholder="Enter Price to examine" type="number" value={adjustedPrice === 0 ? "" : adjustedPrice} onChange={HandleAdjustedPriceChange} />
                                                                    <Card className="mt-4">
                                                                        <CardBody >
                                                                            <h5 className="card-title">Adjusted Price and Profits</h5>
                                                                            <div >
                                                                                <div style={{ display: "flex" }}>
                                                                                    <div className="table-responsive" style={{ width: "100%" }}>
                                                                                        <Table className="table-borderless mb-0">
                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <th className="ps-0" scope="row"> COST :</th>
                                                                                                    <td className="text-muted">${SelectedProduct.cost.toFixed(2)}</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <th className="ps-0" scope="row">SELLING PRICE :</th>
                                                                                                    <td className="text-muted">${adjustedPrice}</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <th className="ps-0" scope="row">{adjustedPrice - SelectedProduct.cost < 0 ? "LOSS :" : "PROFIT :"}</th>
                                                                                                    <td className="text-muted">${(adjustedPrice - SelectedProduct.cost).toFixed(2)}</td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </Table>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </CardBody>
                                                                    </Card>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </div>
                                            </div>
                                        </Row>
                                    </TabPane>
                                </TabContent>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
            <Modal isOpen={OpenAdd} centered
                onClick={(e) => { e.preventDefault() }} modalClassName="flip">
                <ModalHeader className="p-3" toggle={() => { toggleOpenAdd(); }}>
                    Select Date
                </ModalHeader>
                <ModalBody>
                    <div className="live-preview">
                        <Row className="gy-4">
                            <Col xxl={3} md={6}>
                                <div>
                                    <Label htmlFor="labelInput" className="form-label">Select Start Date</Label>
                                    <Flatpickr
                                        className="form-control"
                                        options={{
                                            dateFormat: "Y-m-d"
                                        }}
                                        value={selectedRange ?? ""
                                        }
                                        onChange={([date]) => {
                                            setSelectedRange(moment(date).utc().format('YYYY-MM-DD'));
                                        }}
                                    />
                                </div>
                            </Col>
                            <Col xxl={3} md={6}>
                                <div>
                                    <Label htmlFor="placeholderInput" className="form-label">Select End Date</Label>
                                    <Flatpickr
                                        className="form-control"
                                        options={{
                                            dateFormat: "Y-m-d"
                                        }}
                                        value={selectedRange2 ?? ""
                                        }
                                        onChange={([date]) => {
                                            setSelectedRange2(moment(date).utc().format('YYYY-MM-DD'));
                                        }}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div className="text-end mt-3">
                        <button type="submit" className="btn btn-primary"
                            onClick={(e) => {
                                e.preventDefault();
                                if (selectedRange <= selectedRange2) {
                                    toggleOpenAdd();
                                    setselecteddate({
                                        startdate: selectedRange,
                                        enddate: selectedRange2
                                    })
                                    setSelectedRange(""); setSelectedRange2("")
                                }
                                else toast.current.show({ severity: 'error', summary: 'Invalid input range', life: 3000 });

                            }} >Submit</button>
                    </div>
                </ModalBody>
            </Modal >
        </React.Fragment>
    );
};

export default ProfitabilityAnalysis;
