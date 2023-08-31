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
import Select from "react-select";
import Flatpickr from "react-flatpickr";
import { Toast } from 'primereact/toast';
import api from '../TillPoint/Api/api';
import { FiEdit } from 'react-icons/fi';
import { CLOSELOADER, OPENLOADER } from '../../store/Loader/OpenLoader';

const EmployeesMain = () => {
    SwiperCore.use([Autoplay])
    const dispatch = useDispatch()
    const toast = useRef(null);
    const { layoutModeType } = useSelector(state => ({ layoutModeType: state.Layout.layoutModeType }))
    const [activeTab, setActiveTab] = useState('1')
    const toggleTab = (tab) => { if (activeTab !== tab) { setActiveTab(tab); } }

    const UserlnfoStored = ([...useSelector(state => state.UserlnfoStored)].map((data) => data.status))[0]

    const [OpenAdd, setOpenAdd] = useState(false);
    const toggleOpenAdd = () => { setOpenAdd(!OpenAdd); }
    const [OpenEdit, setOpenEdit] = useState(false)

    const [Selectedrow, setSelectedrow] = useState({ id: "", categories_description: "", categories_type: "" })

    const [Salesdata, setSalesdata] = useState([])
    const [rerunfetch, setrerunfetch] = useState(false)
    const togglererunfetch = () => { setrerunfetch(!rerunfetch); }
    const fetchdata = async () => {
        const response = await api.get('/api/employee/')
        if (response.status === 200) { setSalesdata(response.data) }
        else if (response.status !== 200) {
            setSalesdata([]);
        }
    }

    useEffect(() => {
        fetchdata()
    }, [rerunfetch])
    const newArr = Salesdata

    const columns = [
        {
            name: <span className='font-weight-bold fs-13'>ID</span>,
            selector: row => row.id,
            sortable: true,
            grow: 1
        },
        {
            name: <span className='font-weight-bold fs-13'>FIRST NAME</span>,
            selector: row => row.firstname,
            sortable: true,
            // grow: 3
        },
        {
            name: <span className='font-weight-bold fs-13'>LAST NAME</span>,
            selector: row => row.lastname,
            sortable: true,
            // grow: 3
        },
        {
            name: <span className='font-weight-bold fs-13'>PHONE</span>,
            selector: row => row.phone,
            sortable: true,
            grow: 1
        },
        {
            name: <span className='font-weight-bold fs-13'>EMAIL</span>,
            selector: row => row.email,
            sortable: true,
            grow: 3
        },
        {
            name: <span className='font-weight-bold fs-13'>EMPLOYEE</span>,
            selector: row => row.employee_status,
            sortable: true,
            grow: 1
        },
        {
            name: <span className='font-weight-bold fs-13'>Role</span>,
            selector: row => row.role,
            sortable: true,
            // grow: 3
        },
        {
            name: <span className='font-weight-bold fs-13'>Status</span>,
            selector: row => row.status,
            sortable: true,
            // grow: 3
        },
        {
            name: <span className='font-weight-bold fs-13'>Edit</span>,
            selector: row => <div style={{ width: 50, height: 30, borderRadius: 5, display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "rgb(223, 221, 221)" }}
                onClick={() => {
                    setSelectedrow(row)
                    setOpenEdit(true)
                    toggleOpenAdd()
                }}>
                <FiEdit style={{ fontSize: 18 }} />
            </div>,
            sortable: true,
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

    const [categoriesType, setcategoriesType] = useState("")
    const [categoriesDescription, setcategoriesDescription] = useState("")
    const [categoriesid, setcategoriesid] = useState("")

    const [address, setAddress] = useState("")
    const [email, setEmail] = useState("")
    const [firstname, setFirstname] = useState("")
    const [lastname, setLastname] = useState("")
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("")
    const [phone, setPhone] = useState("")
    const [supervisorcode, setSupervisorcode] = useState("")
    const [role, setrole] = useState({ value: "" })
    const [status, setstatus] = useState({ value: "" })

    const handleaddressChange = (e) => { setAddress(e.target.value) }
    const handlesetemailChange = (e) => { setEmail(e.target.value) }
    const handlefirstnameChange = (e) => { setFirstname(e.target.value) }
    const handlelastnameChange = (e) => { setLastname(e.target.value) }
    const handlepasswordChange = (e) => { setPassword(e.target.value) }
    const handleusernameChange = (e) => { setUsername(e.target.value) }
    const handlephoneChange = (e) => { setPhone(e.target.value) }
    const handlesupervisorcodeChange = (e) => { setSupervisorcode(e.target.value) }

    const UserStatusOptions = [{ options: [{ label: "ACTIVE", value: "ACTIVE" }, { label: "INACTIVE", value: "INACTIVE" }] },]
    const UserRoleOptions = [{ options: [{ label: "TELLER", value: "TELLER" }, { label: "ADMIN", value: "ADMIN" }] },]


    const createemploye = {
        "address": address,
        "email": email,
        "firstname": firstname,
        "status": "OFFLINE",
        "lastname": lastname,
        "password": password,
        "phone": phone,
        "employee_status": status,
        "supervisorcode": supervisorcode,
        "role": role,
        "username": username
    }

    const updateEmmpolyee = {
        "id": categoriesid,
        "address": address,
        "email": email,
        "firstname": firstname,
        "lastname": lastname,
        "password": password,
        "phone": phone,
        "employee_status": status,
        "supervisorcode": supervisorcode,
        "role": role,
        "username": username
    }


    useEffect(() => {
        if (Selectedrow !== { id: '', categories_description: '', categories_type: '' }) {
            setcategoriesid(Selectedrow.id)
            setEmail(Selectedrow.email)
            setFirstname(Selectedrow.firstname)
            setLastname(Selectedrow.lastname)
            setPassword(Selectedrow.password)
            setUsername(Selectedrow.username)
            setPhone(Selectedrow.phone)
            setrole({ value: Selectedrow.role })
            setstatus({ value: Selectedrow.status })
        }
    }, [Selectedrow])

    const resetStates = () => {
        setAddress("")
        setEmail("")
        setFirstname("")
        setLastname("")
        setPassword("")
        setUsername("")
        setPhone("")
        setSupervisorcode("")
        setrole({ value: "" })
        setstatus({ value: "" })
    }

    const handleupdateemploye = () => {
        if (categoriesid !== "") {
            api.post("/api/update/employee/", [updateEmmpolyee])
                .then((response) => {
                    if (response.data.message === "Success") {
                        api.post("/api/logs/create/", {
                            "username": UserlnfoStored.username,
                            "user_id": UserlnfoStored.id,
                            "item": JSON.stringify(updateEmmpolyee),
                            "quantity": 1,
                            "action": "UPDATED",
                            "description": "UPDATED EMPLOYEE"
                        }).then((response) => { })
                            .catch((error) => { console.log(error) })
                        setOpenEdit(false)
                        dispatch(CLOSELOADER())
                        togglererunfetch()
                        setcategoriesType("")
                        setcategoriesDescription("")
                        toggleOpenAdd()
                        resetStates()
                        toast.current.show({ severity: 'success', summary: 'Employee Updated Successfully', life: 6000 })
                    }
                })
                .catch((error) => {
                    dispatch(CLOSELOADER())
                    toast.current.show({ severity: 'error', summary: 'Error!!!, Please Check your network and try again', life: 6000 })
                })
        }
        else {
            api.post("/api/employee/create/", createemploye)
                .then((response) => {
                    if (response.status === 201) {
                        api.post("/api/logs/create/", {
                            "username": UserlnfoStored.username,
                            "user_id": UserlnfoStored.id,
                            "item": JSON.stringify(createemploye),
                            "quantity": 1,
                            "action": "CREATED",
                            "description": "CREATED EMPLOYEE"
                        })
                        dispatch(CLOSELOADER())
                        togglererunfetch()
                        setOpenEdit(false)
                        setcategoriesType("")
                        setcategoriesDescription("")
                        toggleOpenAdd()
                        resetStates()
                        toast.current.show({ severity: 'success', summary: 'Category Created Successfully', life: 6000 })
                    }
                })
                .catch((error) => {
                    dispatch(CLOSELOADER())
                    toast.current.show({ severity: 'error', summary: 'Error!!!, Please Check your network and try again', life: 6000 })
                })
        }
    }

    const HandleDelete = () => {
        api.delete(`/api/employee/delete/${categoriesid}/`)
            .then((response) => {
                if (response.status === 200) {
                    api.post("/api/logs/create/", {
                        "username": UserlnfoStored.username,
                        "user_id": UserlnfoStored.id,
                        "item": JSON.stringify(updateEmmpolyee),
                        "quantity": 1,
                        "action": "DELETED",
                        "description": "DELETED EMPLOYEE"
                    })
                    dispatch(CLOSELOADER())
                    togglererunfetch()
                    setOpenEdit(false)
                    setcategoriesType("")
                    setcategoriesDescription("")
                    toggleOpenAdd()
                    resetStates()
                    toast.current.show({ severity: 'success', summary: 'EMPLOYEE Deleted Successfully', life: 6000 })
                }
            })
            .catch((error) => {
                dispatch(CLOSELOADER())
                toast.current.show({ severity: 'error', summary: 'Error!!!, Please Check your network and try again', life: 6000 })
            })
    }

    document.title = "Arcs | Categories";
    return (
        <React.Fragment>
            <Toast ref={toast} />
            <div className="page-content ">
                <Container fluid className='pagecooooo'>
                    <BreadCrumb title="Employees" pageTitle="Employees" />
                    <Row>
                        <Col>
                            <div className="h-100">
                                <Row className="mb-1 pb-1">
                                    <Col xs={12}>
                                        <div className="d-flex align-items-lg-center flex-lg-row flex-column">
                                            <div className="flex-grow-1">
                                                <h4 className="fs-16 mb-1">EMPLOYEE MANAGEMENT</h4>
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
                                                            href="#cat"
                                                            className={classnames({ active: activeTab === '1' })}
                                                            onClick={() => {
                                                                toggleTab('1');
                                                            }}
                                                        >
                                                            <i className="ri-list-unordered d-inline-block d-md-none"></i> <span
                                                                className="d-none d-md-inline-block"><div style={{ color: "white" }}
                                                                    onClick={() => {
                                                                        toggleOpenAdd(); setOpenEdit(false); setcategoriesType("")
                                                                        setcategoriesid(""); setcategoriesDescription("")
                                                                    }}>ADD NEW EMPLOYEE</div></span>
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
                                                <h5 className="card-title mb-0">Employees Table</h5>
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
            <Modal isOpen={OpenAdd} centered className="modal-lg"
                onClick={(e) => { e.preventDefault() }} modalClassName="zoomIn">
                <ModalHeader className="p-3" toggle={() => { toggleOpenAdd(); }}>
                    {OpenEdit ? "UPDATE EMPLOYEE" : "ADD NEW EMPLOYEE"}
                </ModalHeader>
                <ModalBody>
                    <Form action="#">
                        <div className="live-preview">
                            <Row className="gy-4">
                                <Col xxl={4} md={6}>
                                    <div>
                                        <Label htmlFor="basiInput" className="form-label">First Name</Label>
                                        <Input type="text" className="form-control" id="basiInput" placeholder="Enter first Name"
                                            value={firstname ?? ""} onChange={handlefirstnameChange} required />
                                    </div>
                                </Col>
                                <Col xxl={3} md={6}>
                                    <div>
                                        <Label htmlFor="labelInput" className="form-label">Last Name</Label>
                                        <Input type="text" className="form-control" id="labelInput" placeholder="Enter last name"
                                            value={lastname ?? ""} onChange={handlelastnameChange} required />
                                    </div>
                                </Col>
                                <Col xxl={3} md={6}>
                                    <div>
                                        <Label htmlFor="valueInput" className="form-label">User Name</Label>
                                        <Input type="text" className="form-control" id="valueInput" placeholder="Enter user name"
                                            value={username ?? ""} onChange={handleusernameChange} required />
                                    </div>
                                </Col>
                                <Col xxl={4} md={6}>
                                    <div>
                                        <Label htmlFor="basiInput" className="form-label">Password</Label>
                                        <Input type="text" className="form-control" id="basiInput" placeholder="Enter password"
                                            value={password ?? ""} onChange={handlepasswordChange} required />
                                    </div>
                                </Col>

                                <Col xxl={3} md={6}>
                                    <div>
                                        <Label htmlFor="labelInput" className="form-label">Email</Label>
                                        <Input type="email" className="form-control" id="labelInput" placeholder="Enter email"
                                            value={email ?? ""} onChange={handlesetemailChange} required />
                                    </div>
                                </Col>
                                <Col xxl={3} md={6}>
                                    <div>
                                        <Label htmlFor="placeholderInput" className="form-label">Phone</Label>
                                        <Input type="number" className="form-control" id="placeholderInput" placeholder="Enter phone"
                                            value={phone ?? ""} onChange={handlephoneChange} required />
                                    </div>
                                </Col>
                                <Col xxl={3} md={6}>
                                    <div>
                                        <Label htmlFor="valueInput" className="form-label">Address</Label>
                                        <Input type="text" className="form-control" id="valueInput" placeholder="Enter address"
                                            value={address ?? ""} onChange={handleaddressChange} required />
                                    </div>
                                </Col>
                                <Col xxl={3} md={6}>
                                    <div>
                                        <Label htmlFor="valueInput" className="form-label">Assign Supervisor Code (*optional)</Label>
                                        <Input type="text" className="form-control" id="valueInput" placeholder="Assgn supervisor code"
                                            value={supervisorcode ?? ""} onChange={handlesupervisorcodeChange} />
                                    </div>
                                </Col>
                                <Col xxl={3} md={6}>
                                    <div>
                                        <Label htmlFor="valueInput" className="form-label">Select Role</Label>
                                        <Select
                                            value={role.value}
                                            onChange={(sortBy) => {
                                                setrole(sortBy.value);
                                            }}
                                            options={UserRoleOptions}
                                            classNamePrefix="js-example-data-array"
                                            isLoading={true}
                                        />
                                    </div>
                                </Col>
                                <Col xxl={3} md={6}>
                                    <div>
                                        <Label htmlFor="placeholderInput" className="form-label">Select Employee Status</Label>
                                        <Select
                                            value={status.value}
                                            onChange={(sortBy) => {
                                                setstatus(sortBy.value);
                                            }}
                                            options={UserStatusOptions}
                                            classNamePrefix="js-example-data-array"
                                            isLoading={true}
                                        />
                                    </div>
                                </Col>
                            </Row>
                        </div>
                        <div className="text-end mt-3">
                            {OpenEdit ? <Button className="btn btn-soft-danger" style={{ marginRight: "20px" }}
                                onClick={() => { HandleDelete(); dispatch(OPENLOADER()) }}
                            ><i className="ri-delete-bin-2-line"></i></Button> : <></>}
                            <Button className="btn btn-primary" type="submit"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleupdateemploye()
                                    dispatch(OPENLOADER())
                                    return false;
                                }}>Submit</Button>
                        </div>
                    </Form>
                </ModalBody>
            </Modal >
        </React.Fragment >
    )
}

export default EmployeesMain