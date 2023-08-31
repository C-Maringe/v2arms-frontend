import BreadCrumb from '../../Components/Common/BreadCrumb';
import React, { useState, useEffect, useRef } from "react";
import {
    Card, CardBody, Col, Container, Nav, NavItem, NavLink, Row, CardHeader, Button,
    Label, Modal, ModalBody, ModalHeader, Input, Form
} from 'reactstrap';
import classnames from 'classnames';
import SwiperCore, { Autoplay } from "swiper";
import { useSelector, useDispatch } from "react-redux";
import DataTable from "react-data-table-component";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import moment from 'moment'
import Flatpickr from "react-flatpickr";
import { Toast } from 'primereact/toast';
import api from '../TillPoint/Api/api';
import { FiEdit } from 'react-icons/fi';
import { CLOSELOADER, OPENLOADER } from '../../store/Loader/OpenLoader';

const AuditTrailMain = () => {
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
    const [Salesdata, setSalesdata] = useState([])
    const [selecteddate, setselecteddate] = useState(selecteddate1)
    const fetchdata = async () => {
        const response = await api.post('/api/logs/view/', selecteddate)
        if (response.status === 200) { setSalesdata(response.data.logs) }
        else if (response.data.status !== 200) {
            setSalesdata([]);
        }
    }

    useEffect(() => {
        fetchdata()
    }, [selecteddate])

    const { layoutModeType } = useSelector(state => ({ layoutModeType: state.Layout.layoutModeType, }))

    const [activeTab, setActiveTab] = useState('1')

    const toggleTab = (tab) => {
        if (activeTab !== tab) { setActiveTab(tab); }
    }

    const newArr = Salesdata !== undefined ? Salesdata.sort(function (a, b) { return b.id - a.id }) : []
    const columns = [
        {
            name: <span className='font-weight-bold fs-13'>ID</span>,
            selector: row => row.id,
            sortable: true,
            grow: 1
        },
        {
            name: <span className='font-weight-bold fs-13'>DATE</span>,
            selector: row => moment(row.createed_at).format('DD-MM-YYYY[ ]HH:mm:ss'),
            sortable: true,
            grow: 2
        },
        {
            name: <span className='font-weight-bold fs-13'>Name</span>,
            selector: row => row.username,
            sortable: true,
            // grow: 3
        },
        {
            name: <span className='font-weight-bold fs-13'>ACTION</span>,
            selector: row => row.action,
            sortable: true,
            grow: 1
        },
        {
            name: <span className='font-weight-bold fs-13'>DESCRIPTION</span>,
            selector: row => row.description,
            sortable: true,
            grow: 2
        },
        {
            name: <span className='font-weight-bold fs-13'>Narration</span>,
            selector: row => row.item,
            sortable: true,
            grow: 5
        }
    ];

    const [search, setNewSearch] = useState("");
    const handlesearch = (e) => { setNewSearch(e.target.value) }
    const column = newArr !== undefined ? Object.keys(newArr[0] || {}) : ""
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

    const ExpandedComponent = ({ data }) => <pre>{JSON.stringify(JSON.parse(data.item), null, 2)}</pre>;

    document.title = "Arcs | Categories";
    return (
        <React.Fragment>
            <Toast ref={toast} />
            <div className="page-content ">
                <Container fluid className='pagecooooo'>
                    <BreadCrumb title="Audit Trail" pageTitle="Audit Trail" />
                    <Row>
                        <Col>
                            <div className="h-100">
                                <Row className="mb-1 pb-1">
                                    <Col xs={12}>
                                        <div className="d-flex align-items-lg-center flex-lg-row flex-column">
                                            <div className="flex-grow-1">
                                                <h4 className="fs-16 mb-1">SYSTEM AUDIT TRAIL</h4>
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
                                                                className="d-none d-md-inline-block"><div style={{ color: "white" }}>SEARCH</div></span>
                                                        </NavLink>
                                                    </NavItem>
                                                </Nav>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                                <Row className="mt-3 pb-1">
                                    <Col lg={12}>
                                        <Card>
                                            <CardHeader>
                                                <h5 className="card-title mb-0">Audit trail Table</h5>
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
                                                    expandableRows
                                                    expandableRowsComponent={ExpandedComponent}
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
        </React.Fragment >
    )
}

export default AuditTrailMain