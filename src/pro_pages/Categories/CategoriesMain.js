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

const CategoriesMain = () => {
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
        const response = await api.get('/api/categories/')
        if (response.data.status === 200) { setSalesdata(response.data.categories) }
        else if (response.data.status !== 200) {
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
            name: <span className='font-weight-bold fs-13'>TYPE</span>,
            selector: row => row.categories_type,
            sortable: true,
            // grow: 3
        },
        {
            name: <span className='font-weight-bold fs-13'>DESCRIPTION</span>,
            selector: row => row.categories_description,
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

    const HandleCategoryTypeChange = (e) => { setcategoriesType(e.target.value) }
    const HandleCategoryDescriptionChange = (e) => { setcategoriesDescription(e.target.value) }

    useEffect(() => {
        if (Selectedrow !== { id: "", categories_description: "", categories_type: "" }) {
            setcategoriesType(Selectedrow.categories_type)
            setcategoriesDescription(Selectedrow.categories_description)
            setcategoriesid(Selectedrow.id)
        }
    }, [Selectedrow])

    const createcategory = {
        "categories_type": categoriesType,
        "categories_description": categoriesDescription
    }
    const updatecategory = {
        "id": categoriesid,
        "categories_type": categoriesType,
        "categories_description": categoriesDescription
    }

    const StateKeeper = {
        "id": Selectedrow.id,
        "categories_type": Selectedrow.categories_type,
        "categories_description": Selectedrow.categories_description
    }

    // const UpdateStateHolder = `from ${JSON.stringify(StateKeeper)} to ${JSON.stringify(updatecategory)}`

    const handleupdateemploye = () => {
        if (categoriesid !== "") {
            api.post("/api/update/categories/", [updatecategory])
                .then((response) => {
                    if (response.data.message === "Success") {
                        api.post("/api/logs/create/", {
                            "username": UserlnfoStored.username,
                            "user_id": UserlnfoStored.id,
                            "item": JSON.stringify(updatecategory),
                            "quantity": 1,
                            "action": "UPDATED",
                            "description": "UPDATED CATEGORY"
                        }).then((response) => { })
                            .catch((error) => { console.log(error) })
                        setOpenEdit(false)
                        dispatch(CLOSELOADER())
                        togglererunfetch()
                        setcategoriesType("")
                        setcategoriesDescription("")
                        toggleOpenAdd()
                        toast.current.show({ severity: 'success', summary: 'Category Updated Successfully', life: 6000 })
                    }
                })
                .catch((error) => {
                    dispatch(CLOSELOADER())
                    toast.current.show({ severity: 'error', summary: 'Error!!!, Please Check your network and try again', life: 6000 })
                })
        }
        else {
            api.post("/api/categories/create/", createcategory)
                .then((response) => {
                    if (response.data.status === 200) {
                        api.post("/api/logs/create/", {
                            "username": UserlnfoStored.username,
                            "user_id": UserlnfoStored.id,
                            "item": JSON.stringify(createcategory),
                            "quantity": 1,
                            "action": "CREATED",
                            "description": "CREATED CATEGORY"
                        })
                        dispatch(CLOSELOADER())
                        togglererunfetch()
                        setOpenEdit(false)
                        setcategoriesType("")
                        setcategoriesDescription("")
                        toggleOpenAdd()
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
        api.delete(`/api/categories/delete/${categoriesid}/`)
            .then((response) => {
                if (response.status === 200) {
                    api.post("/api/logs/create/", {
                        "username": UserlnfoStored.username,
                        "user_id": UserlnfoStored.id,
                        "item": JSON.stringify(updatecategory),
                        "quantity": 1,
                        "action": "DELETED",
                        "description": "DELETED CATEGORY"
                    })
                    dispatch(CLOSELOADER())
                    togglererunfetch()
                    setOpenEdit(false)
                    setcategoriesType("")
                    setcategoriesDescription("")
                    toggleOpenAdd()
                    toast.current.show({ severity: 'success', summary: 'Record Deleted Successfully', life: 6000 })
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
                    <BreadCrumb title="Categories" pageTitle="Categories" />
                    <Row>
                        <Col>
                            <div className="h-100">
                                <Row className="mb-1 pb-1">
                                    <Col xs={12}>
                                        <div className="d-flex align-items-lg-center flex-lg-row flex-column">
                                            <div className="flex-grow-1">
                                                <h4 className="fs-16 mb-1">PRODUCT CATEGORIES AVAILABLE</h4>
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
                                                                    }}>ADD NEW CATEGORY</div></span>
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
                                                <h5 className="card-title mb-0">Categories Table</h5>
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
                    {OpenEdit ? "UPDATE CATEGORY" : "ADD NEW CATEGORY"}
                </ModalHeader>
                <ModalBody>
                    <Form action="#">
                        <Row className="gy-4">
                            <Col xxl={3} md={12}>
                                <div>
                                    <Label htmlFor="labelInput" className="form-label">Category Type</Label>
                                    <Input type="text" className="form-control" id="labelInput" placeholder="Enter Category Type"
                                        value={categoriesType ?? ""} onChange={HandleCategoryTypeChange}
                                    />
                                </div>
                            </Col>
                            <Col xxl={3} md={12}>
                                <div>
                                    <Label htmlFor="placeholderInput" className="form-label">Category Description</Label>
                                    <Input type="text" className="form-control" id="labelInput" placeholder="Enter Category Description"
                                        value={categoriesDescription ?? ""} onChange={HandleCategoryDescriptionChange}
                                    />
                                </div>
                            </Col>
                        </Row>
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

export default CategoriesMain