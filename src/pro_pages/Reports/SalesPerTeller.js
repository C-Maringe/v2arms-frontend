import React, { useState, useEffect, useRef } from "react";
import {
    Card, CardBody, Col, Container, Nav, NavItem, NavLink, Row, CardHeader, Button,
    Label, Modal, ModalBody, ModalHeader, Input
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

const SalesPerTeller = () => {
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

    const [UserOptions, setUserOptions] = useState([])
    const [SelectedUser, setSelectedUser] = useState({ value: "" })
    const [SelectMethodOfPayment, setSelectMethodOfPayment] = useState({ value: "" })
    const [selecteddate, setselecteddate] = useState({ startdate: startdate, enddate: enddate })
    const [Salesdata, setSalesdata] = useState([])
    const MethodOfPaymentOptions = [
        { value: "CASH-USD", label: "CASH-USD", id: 1 },
        { value: "CASH-ZWL", label: "CASH-ZWL", id: 2 },
        { value: "SWIPE", label: "SWIPE", id: 3 },
        { value: "MOBILE", label: "ECOCASH", id: 3 }
    ]

    useEffect(() => {
        api.get('/api/employee/')
            .then((response) => {
                if (response.status === 200) {
                    setUserOptions(response.data.map((data) => ({ value: data.id, label: data.firstname + " " + data.lastname })))
                }
                else if (response.data.status !== 200) {
                    setUserOptions([]);
                }
            })
            .catch((error) => {
                setUserOptions([]);
            })
    }, [])

    const sendpostdata = {
        "startdate": selecteddate.startdate,
        "enddate": selecteddate.enddate,
        "id": SelectedUser,
        "channel": SelectMethodOfPayment
    }

    const fetchdata = async () => {
        if (SelectedUser.value !== "" && SelectMethodOfPayment.value !== "") {
            const response = await api.post('/api/view/teller/sales/', sendpostdata)
            if (response.data.status_code === 200) {
                setSalesdata(response.data.sales)
            }
            else if (response.data.status_code === 400) {
                setSalesdata([])
            }
        }
    }

    useEffect(() => {
        fetchdata()
    }, [SelectedUser, SelectMethodOfPayment, selecteddate])

    const { layoutModeType } = useSelector(state => ({ layoutModeType: state.Layout.layoutModeType, }))

    const [activeTab, setActiveTab] = useState('1')

    const toggleTab = (tab) => {
        if (activeTab !== tab) { setActiveTab(tab); }
    }

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
            grow: 2
        },
        {
            name: <span className='font-weight-bold fs-13'>Employee</span>,
            selector: row => row.employee,
            sortable: true,
            grow: 2
        },
        {
            name: <span className='font-weight-bold fs-13'>Product Name</span>,
            selector: row => row.product,
            sortable: true,
            grow: 3
        },
        {
            name: <span className='font-weight-bold fs-13'>Status</span>,
            selector: row => row.status,
            sortable: true,
            grow: 2
        },
        {
            name: <span className='font-weight-bold fs-13'>Channel</span>,
            selector: row => row.channel,
            sortable: true,
            grow: 2
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

    const FailedTransactions = Salesdata.filter(({ status }) => status !== 'COMPLETE')
    const CompleteTransactions = Salesdata.filter(({ status }) => status === 'COMPLETE')

    const ecomWidgets = [
        {
            id: 1,
            cardColor: "primary",
            label: "Complete Transactions Count",
            badge: "ri-arrow-right-up-line",
            badgeClass: "success",
            percentage: "+16.24",
            counter: CompleteTransactions.length,
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
            label: "Completed Transactions Sum",
            badge: "ri-arrow-right-up-line",
            badgeClass: "success",
            percentage: "+29.08",
            counter: CompleteTransactions.reduce((accumulator, object) => {
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
            label: "Failed Transactions Count",
            badge: "ri-arrow-right-down-line",
            badgeClass: "danger",
            percentage: "-3.57",
            counter: FailedTransactions.length,
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
            label: "Failed Transactions Sum",
            badgeClass: "muted",
            percentage: "+0.00",
            counter: FailedTransactions.reduce((accumulator, object) => {
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



    document.title = "Arcs | Dashboard";
    return (
        <React.Fragment>
            <Toast ref={toast} />
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="Sales Per Teller Dashboard" pageTitle="Sales-Per-Teller" />
                    <Row>
                        <Col>
                            <div className="h-100">
                                <Row className="mb-1 pb-1">
                                    <Col xs={12}>
                                        <div className="d-flex align-items-lg-center flex-lg-row flex-column">
                                            <div className="flex-grow-1">
                                                <h4 className="fs-16 mb-1">SALES TRANSACTIONS REPORT</h4>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg={12}> 
                                        <div>
                                            <div >
                                                <div className="animation-nav profile-nav gap-2 gap-lg-3 flex-grow-1 mb-4">
                                                    <div style={layoutModeType === 'light' ? { borderRadius: 5, paddingTop: 5, paddingBottom: 15, backgroundColor: "#405189" } : { borderRadius: 5, paddingTop: 5, paddingBottom: 15 }}>
                                                        <div className="live-preview">
                                                            <Row className="gy-4">
                                                                <Col xxl={3} md={6}>
                                                                    <div>
                                                                        <Label htmlFor="valueInput" className="form-label fs-17" style={{ color: "white" }}>Select Employee</Label>
                                                                        <Select
                                                                            value={SelectedUser.value}
                                                                            onChange={(sortBy) => {
                                                                                setSelectedUser(sortBy.value);
                                                                            }}
                                                                            options={UserOptions}
                                                                            classNamePrefix="js-example-data-array"
                                                                            isLoading={true}
                                                                            menuPortalTarget={document.body}
                                                                            styles={{ menuPortal: base => ({ ...base, zIndex: 999999999 }) }}
                                                                        />
                                                                    </div>
                                                                </Col>
                                                                <Col xxl={3} md={6}>
                                                                    <div>
                                                                        <Label htmlFor="valueInput" className="form-label fs-17" style={{ color: "white" }}>Select Method Of Payment</Label>
                                                                        <Select
                                                                            value={SelectMethodOfPayment.value}
                                                                            onChange={(sortBy) => {
                                                                                setSelectMethodOfPayment(sortBy.value);
                                                                            }}
                                                                            options={MethodOfPaymentOptions}
                                                                            classNamePrefix="js-example-data-array"
                                                                            isLoading={true}
                                                                            menuPortalTarget={document.body}
                                                                            styles={{ menuPortal: base => ({ ...base, zIndex: 999999999 }) }}
                                                                        />
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    </div>
                                                </div>
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

export default SalesPerTeller;
