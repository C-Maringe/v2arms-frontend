import BreadCrumb from '../../Components/Common/BreadCrumb';
import React, { useState, useEffect, useRef } from "react";
import {
    Card, CardBody, Col, Container, Nav, NavItem, NavLink, Row, CardHeader, Button,
    Label, Modal, ModalBody, ModalHeader, Input, Form, TabPane, TabContent
} from 'reactstrap';
import classnames from 'classnames';
import SwiperCore, { Autoplay } from "swiper";
import { useSelector, useDispatch } from "react-redux";
import DataTable from "react-data-table-component";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import Select from "react-select";
import { Toast } from 'primereact/toast';
import api from '../TillPoint/Api/api';
import { FiEdit } from 'react-icons/fi';
import { CLOSELOADER, OPENLOADER } from '../../store/Loader/OpenLoader';
import { read, utils } from 'xlsx';
import { IsTableNotLoading } from '../../store/Auth/tableloadingStore';

const ProductsMain = () => {
    SwiperCore.use([Autoplay])
    const dispatch = useDispatch()
    const toast = useRef(null);

    const storedTableloadingStatus = ([...useSelector(state => state.IsTableLoadingStore)].map((data) => data.status)[0])
    const { layoutModeType } = useSelector(state => ({ layoutModeType: state.Layout.layoutModeType }))
    const [activeTab, setActiveTab] = useState('1')
    const toggleTab = (tab) => { if (activeTab !== tab) { setActiveTab(tab); } }

    const UserlnfoStored = ([...useSelector(state => state.UserlnfoStored)].map((data) => data.status))[0]

    const [OpenAdd, setOpenAdd] = useState(false);
    const toggleOpenAdd = () => { setOpenAdd(!OpenAdd); }
    const [OpenEdit, setOpenEdit] = useState(false)

    const [Selectedrow, setSelectedrow] = useState(
        {
            id: "", categories_description: "", categories_type: "", suppliers_id: { id: "", suppliers_name: "" },
            categories_id: { id: "", categories_type: "" }
        })

    const [Salesdata, setSalesdata] = useState([])
    const [rerunfetch, setrerunfetch] = useState(false)
    const togglererunfetch = () => { setrerunfetch(!rerunfetch); }
    const [totaloutofstock, settotaloutofstock] = useState([])

    const [stocknothing, setStocknothing] = useState(false)
    const fetchdata = async () => {
        const response = await api.get('/api/allproducts/')
        if (response.status === 200) { setSalesdata(response.data); dispatch(IsTableNotLoading()) }
        else if (response.data.status !== 200) {
            setSalesdata([]);
        }
        api.get('/api/outofstock/')
            .then((response) => {
                settotaloutofstock(response.data.outofstock)
                dispatch(IsTableNotLoading())
            })
    }

    useEffect(() => {
        fetchdata()
    }, [rerunfetch])
    const newArr = stocknothing ? totaloutofstock : Salesdata

    const columns = [
        {
            name: <span className='font-weight-bold fs-13'>ID</span>,
            selector: row => row.id,
            sortable: true,
            grow: 1
        },
        {
            name: <span className='font-weight-bold fs-13'> Product Name </span>,
            selector: row => row.name,
            sortable: true,
            grow: 3
        },
        {
            name: <span className='font-weight-bold fs-13'>Category</span>,
            selector: row => row.categories_id.categories_type,
            sortable: true,
            // grow: 3
        },
        {
            name: <span className='font-weight-bold fs-13'>Supplier</span>,
            selector: row => row.suppliers_id.suppliers_name,
            sortable: true,
            grow: 1
        },
        {
            name: <span className='font-weight-bold fs-13'>Cost</span>,
            selector: row => row.cost,
            sortable: true,
            // grow: 3
        },
        {
            name: <span className='font-weight-bold fs-13'>Selling Price</span>,
            selector: row => row.price,
            sortable: true,
            // grow: 3
        },
        {
            name: <span className='font-weight-bold fs-13'>Stock</span>,
            selector: row => row.quantity,
            sortable: true,
            // grow: 3
        },
        {
            name: <span className='font-weight-bold fs-13'>Order Level</span>,
            selector: row => row.order_level,
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
    // console.log(newArr[0] === undefined ? "musosro" : "imbwa")
    const column = newArr[0] === undefined ? { "empty": "empty" } : Object.keys(newArr[0]);
    const filtered = !search ? newArr : newArr.filter((data) =>
        column.some((column) =>
            data[column] === null ? "" : data[column].toString()
                .toLowerCase().indexOf(search.toString().toLowerCase()) > -1
        )
    )

    const exportExcel = () => {
        import('xlsx').then(xlsx => {
            const worksheet = xlsx.utils.json_to_sheet(filtered.map((data) => ({
                barcode: data.barcode, categories_id: data.categories_id.id, cost: data.cost, description: data.description,
                id: data.id, name: data.name, order_level: data.order_level, price: data.price, quantity: data.quantity,
                suppliers_id: data.suppliers_id.id,
            })));
            const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            saveAsExcelFile(excelBuffer, 'products');
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


    const [productbarcode, setproductbarcode] = useState(null)
    const [productname, setproductname] = useState(null)
    const [productdescription, setproductdescription] = useState(null)
    const [productcost, setproductcost] = useState(null)
    const [productprice, setproductprice] = useState(null)
    const [productquantity, setproductquantity] = useState(null)
    const [producttax, setproducttax] = useState(null)
    const [productOrderlevel, setproductOrderlevel] = useState(null)
    const [productsupplier, setproductsupplier] = useState(null)
    const [productcategory, setproductcategory] = useState(null)
    const [role, setrole] = useState({ value: "" })
    const [status, setstatus] = useState({ value: "" })

    const handleproductbarcodeChange = (e) => { setproductbarcode(e.target.value) }
    const handleproductnameChange = (e) => { setproductname(e.target.value) }
    const handleproductdescriptionChange = (e) => { setproductdescription(e.target.value) }
    const handleproductcostChange = (e) => { setproductcost(e.target.value) }
    const handleproductpriceChange = (e) => { setproductprice(e.target.value) }
    const handleproductquantityChange = (e) => { setproductquantity(e.target.value) }
    const handleproducttaxChange = (e) => { setproducttax(e.target.value) }
    const handleproductOrderlevelChange = (e) => { setproductOrderlevel(e.target.value) }

    const ResetStatesToDefault = () => {
        setproductbarcode(null)
        setproductname(null)
        setproductdescription(null)
        setproductcost(null)
        setproductprice(null)
        setproductquantity(null)
        setproducttax(null)
        setproductsupplier(null)
        setproductcategory(null)
        setrole({ value: "" })
        setstatus({ value: "" })
        setcategoriesid("")
        setproductOrderlevel(null)
        setSelectedrow({
            id: "", categories_description: "", categories_type: "",
            suppliers_id: { id: "", suppliers_name: "" }, categories_id: { id: "", categories_type: "" }
        })
    }

    useEffect(() => {
        if (Selectedrow !== { id: "", categories_description: "", categories_type: "", suppliers_id: { id: "", suppliers_name: "" }, categories_id: { id: "", categories_type: "" } }) {
            setcategoriesType(Selectedrow.categories_type)
            setcategoriesDescription(Selectedrow.categories_description)
            setcategoriesid(Selectedrow.id)
            setproductsupplier(Selectedrow.suppliers_id.id)
            setproductcategory(Selectedrow.categories_id.id)
            setproductbarcode(Selectedrow.barcode)
            setproductname(Selectedrow.name)
            setproductdescription(Selectedrow.description)
            setproductcost(Selectedrow.cost)
            setproductprice(Selectedrow.price)
            setproductquantity(Selectedrow.quantity)
            setproducttax(Selectedrow.tax)
            setproductOrderlevel(Selectedrow.order_level)
        }
    }, [Selectedrow])

    const productsdata = {
        barcode: productbarcode,
        cost: productcost,
        description: productdescription,
        name: productname,
        price: productprice,
        quantity: productquantity,
        tax: producttax,
        categories_id: status,
        suppliers_id: role,
        order_level: productOrderlevel
    }

    const productsdataupdate = {
        id: categoriesid,
        barcode: productbarcode,
        cost: productcost,
        description: productdescription,
        name: productname,
        price: productprice,
        quantity: productquantity,
        tax: producttax,
        categories_id: status.value === '' ? productcategory : status,
        suppliers_id: role.value === '' ? productsupplier : role,
        order_level: productOrderlevel
    }

    const handleupdateemploye = () => {
        if (categoriesid !== "") {
            api.put(`/api/update/products23/${categoriesid}/`, productsdataupdate)
                .then((response) => {
                    if (response.status === 201) {
                        api.post("/api/logs/create/", {
                            "username": UserlnfoStored.username,
                            "user_id": UserlnfoStored.id,
                            "item": JSON.stringify(productsdataupdate),
                            "quantity": 1,
                            "action": "UPDATED",
                            "description": "UPDATED PRODUCT"
                        }).then((response) => { })
                            .catch((error) => { })
                        setOpenEdit(false)
                        dispatch(CLOSELOADER())
                        togglererunfetch()
                        setcategoriesType("")
                        setcategoriesDescription("")
                        toggleOpenAdd()
                        ResetStatesToDefault()
                        toast.current.show({ severity: 'success', summary: 'Product Updated Successfully', life: 6000 })
                    }
                })
                .catch((error) => {
                    dispatch(CLOSELOADER())
                    toast.current.show({ severity: 'error', summary: 'Error!!!, Please Check your network and try again', life: 6000 })
                })
        }
        else {
            api.post("/api/create/", productsdata)
                .then((response) => {
                    if (response.status === 201) {
                        api.post("/api/logs/create/", {
                            "username": UserlnfoStored.username,
                            "user_id": UserlnfoStored.id,
                            "item": JSON.stringify(productsdata),
                            "quantity": 1,
                            "action": "CREATED",
                            "description": "CREATED PRODUCT"
                        })
                        dispatch(CLOSELOADER())
                        togglererunfetch()
                        setOpenEdit(false)
                        setcategoriesType("")
                        setcategoriesDescription("")
                        toggleOpenAdd()
                        ResetStatesToDefault()
                        toast.current.show({ severity: 'success', summary: 'Product Created Successfully', life: 6000 })
                    }
                })
                .catch((error) => {
                    dispatch(CLOSELOADER())
                    toast.current.show({ severity: 'error', summary: 'Error!!!, Please Check your network and try again', life: 6000 })
                })
        }
    }

    const HandleDelete = () => {
        api.delete(`/api/product/delete/${categoriesid}/`)
            .then((response) => {
                if (response.status === 200) {
                    api.post("/api/logs/create/", {
                        "username": UserlnfoStored.username,
                        "user_id": UserlnfoStored.id,
                        "item": JSON.stringify(productsdataupdate),
                        "quantity": 1,
                        "action": "DELETED",
                        "description": "DELETED PRODUCT"
                    })
                    dispatch(CLOSELOADER())
                    togglererunfetch()
                    setOpenEdit(false)
                    setcategoriesType("")
                    setcategoriesDescription("")
                    toggleOpenAdd()
                    ResetStatesToDefault()
                    toast.current.show({ severity: 'success', summary: 'Product Deleted Successfully', life: 6000 })
                }
            })
            .catch((error) => {
                dispatch(CLOSELOADER())
                toast.current.show({ severity: 'error', summary: 'Error!!!, Please Check your network and try again', life: 6000 })
            })
    }

    const [CategoriesOptions, setCategoriesOptions] = useState([])
    const [SuppliersOptions, setSuppliersOptions] = useState([])

    useEffect(() => {
        api.get('/api/categories/')
            .then((response) => {
                if (response.data.status === 200) {
                    setCategoriesOptions(response.data.categories.map((data) => ({ value: data.id, label: data.categories_type })))
                }
                else if (response.data.status !== 200) {
                    setCategoriesOptions([]);
                }
            })
            .catch((error) => {
                setCategoriesOptions([]);
            })
        api.get('/api/suppliers/')
            .then((response) => {
                if (response.data.status === 200) {
                    setSuppliersOptions(response.data.suppliers.map((data) => ({ value: data.id, label: data.suppliers_name })))
                }
                else if (response.data.status !== 200) {
                    setSuppliersOptions([]);
                }
            })
            .catch((error) => {
                setSuppliersOptions([]);
            })
    }, [])

    const SuppliersOptionsData = [{ options: SuppliersOptions },]
    const CategoriesOptionsData = [{ options: CategoriesOptions },]


    // const [importedData, setImportedData] = useState([]);
    const [importedCols, setImportedCols] = useState([{ field: '', header: 'Header' }]);

    const toCapitalize = (s) => { return s.charAt(0).toUpperCase() + s.slice(1); }

    const [importeddata, setimporteddata] = useState([])

    const handleImport = ($event) => {
        const files = $event.target.files;
        if (files.length) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                const wb = read(event.target.result);
                const sheets = wb.SheetNames;
                if (sheets.length) {
                    const rows = utils.sheet_to_json(wb.Sheets[sheets[0]]);
                    setimporteddata(rows)
                }
            }
            reader.readAsArrayBuffer(file);
        }
    } 

    const [openModalTable, setOpenModalTable] = useState(false)

    useEffect(() => {
        if (importeddata.length > 0) {
            setOpenModalTable(true)
        }
    }, [importeddata])

    const HandleUploadProducts = async () => {
        dispatch(OPENLOADER())
        api.post("/api/create/", importeddata)
            .then((response) => {
                if (response.status === 201) {
                    api.post("/api/logs/create/", {
                        "username": UserlnfoStored.username,
                        "user_id": UserlnfoStored.id,
                        "item": JSON.stringify({ data: "Created many Products" }),
                        "quantity": 1,
                        "action": "CREATED",
                        "description": `CREATED ${importeddata.length} PRODUCTS`
                    })
                    dispatch(CLOSELOADER())
                    togglererunfetch()
                    setOpenModalTable(false)
                    setimporteddata([])
                    toast.current.show({ severity: 'success', summary: 'Multiiple Products Created Successfully', life: 6000 })
                }
            })
            .catch((error) => {
                dispatch(CLOSELOADER())
                toast.current.show({ severity: 'error', summary: 'Error!!!, Please Check your network and try again', life: 6000 })
            })
    }

    const columns1 = [
        {
            name: <span className='font-weight-bold fs-13'>ID</span>,
            selector: row => row.id,
            sortable: true,
            grow: 1
        },
        {
            name: <span className='font-weight-bold fs-13'> Product Name </span>,
            selector: row => row.name,
            sortable: true,
            grow: 3
        },
        {
            name: <span className='font-weight-bold fs-13'>Category ID</span>,
            selector: row => row.categories_id,
            sortable: true,
            // grow: 3
        },
        {
            name: <span className='font-weight-bold fs-13'>Supplier ID</span>,
            selector: row => row.suppliers_id,
            sortable: true,
            grow: 1
        },
        {
            name: <span className='font-weight-bold fs-13'>Cost</span>,
            selector: row => row.cost,
            sortable: true,
            // grow: 3
        },
        {
            name: <span className='font-weight-bold fs-13'>Selling Price</span>,
            selector: row => row.price,
            sortable: true,
            // grow: 3
        },
        {
            name: <span className='font-weight-bold fs-13'>Stock</span>,
            selector: row => row.quantity,
            sortable: true,
            // grow: 3
        },
        {
            name: <span className='font-weight-bold fs-13'>Order Level</span>,
            selector: row => row.order_level,
            sortable: true,
            // grow: 3
        }
    ];

    document.title = "Arcs | Products";
    return (
        <React.Fragment>
            <Toast ref={toast} />
            <div className="page-content ">
                <Container fluid className='pagecooooo'>
                    <BreadCrumb title="Products" pageTitle="Products" />
                    <Row>
                        <Col>
                            <div className="h-100">
                                <Row className="mb-1 pb-1">
                                    <Col xs={12}>
                                        <div className="d-flex align-items-lg-center flex-lg-row flex-column">
                                            <div className="flex-grow-1">
                                                <h4 className="fs-16 mb-1">PRODUCTS STORED</h4>
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
                                                            href="#view"
                                                            className={classnames({ active: activeTab === '1' })}
                                                            onClick={() => {
                                                                toggleTab('1');
                                                                setStocknothing(false)
                                                            }}
                                                        >
                                                            <i className="ri-list-unordered d-inline-block d-md-none"></i> <span
                                                                className="d-none d-md-inline-block"><div style={{ color: "white" }}
                                                                >VIEW PRODUCTS</div></span>
                                                        </NavLink>
                                                    </NavItem>
                                                    <NavItem>
                                                        <NavLink
                                                            href="#add"
                                                            className={classnames({ active: activeTab === '2' })}
                                                            onClick={() => {
                                                                toggleTab('2');
                                                                setStocknothing(false)
                                                            }}
                                                        >
                                                            <i className="ri-list-unordered d-inline-block d-md-none"></i> <span
                                                                className="d-none d-md-inline-block"><div style={{ color: "white" }}
                                                                    onClick={() => {
                                                                        toggleOpenAdd(); setOpenEdit(false); setcategoriesType("")
                                                                        setcategoriesid(""); setcategoriesDescription(""); ResetStatesToDefault()
                                                                    }}>ADD NEW PRODUCT</div></span>
                                                        </NavLink>
                                                    </NavItem>
                                                    <NavItem>
                                                        <NavLink
                                                            href="#outofstock"
                                                            className={classnames({ active: activeTab === '3' })}
                                                            onClick={() => {
                                                                toggleTab('3');
                                                                setStocknothing(true)
                                                            }}
                                                        >
                                                            <i className="ri-list-unordered d-inline-block d-md-none"></i> <span
                                                                className="d-none d-md-inline-block"><div style={{ color: "white" }}
                                                                >PRODUCTS OUT OF STOCK</div></span>
                                                        </NavLink>
                                                    </NavItem>
                                                    <NavItem>
                                                        <NavLink
                                                            href="#outofstock"
                                                            className={classnames({ active: activeTab === '4' })}
                                                            onClick={() => {
                                                                toggleTab('4'); setStocknothing(false)
                                                            }}
                                                        >
                                                            <input type="file" accept='xlsx,xsl,xls,csv'
                                                                className='custom-file-input'
                                                                onChange={handleImport}
                                                            />
                                                        </NavLink>
                                                    </NavItem>
                                                </Nav>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                                <TabContent activeTab={activeTab} className="pt-4">
                                    <TabPane tabId={"1"}>
                                        <Row className="mt-3 pb-1">
                                            <Col lg={12}>
                                                <Card>
                                                    <CardHeader>
                                                        <h5 className="card-title mb-0">Products Table</h5>
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
                                                            progressPending={storedTableloadingStatus}
                                                        />
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                        </Row>
                                    </TabPane>
                                    <TabPane tabId={"2"}>
                                        <Row className="mt-3 pb-1">
                                            <Col lg={12}>
                                                <Card>
                                                    <CardHeader>
                                                        <h5 className="card-title mb-0">Products Table</h5>
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
                                    <TabPane tabId={"4"}>
                                        <Row className="mt-3 pb-1">
                                            <Col lg={12}>
                                                <Card>
                                                    <CardHeader>
                                                        <h5 className="card-title mb-0">Products Table</h5>
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
                                    <TabPane tabId={"3"}>
                                        <Row className="mt-3 pb-1">
                                            <Col lg={12}>
                                                <Card>
                                                    <CardHeader>
                                                        <h5 className="card-title mb-0">Products Out of Stock Table</h5>
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
                                                            progressPending={storedTableloadingStatus}
                                                        />
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                        </Row>
                                    </TabPane>
                                </TabContent>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
            <Modal isOpen={OpenAdd} centered className="modal-lg"
                onClick={(e) => { e.preventDefault() }} modalClassName="zoomIn">
                <ModalHeader className="p-3" toggle={() => { toggleOpenAdd(); ResetStatesToDefault() }}>
                    {OpenEdit ? "UPDATE PRODUCT" : "ADD NEW PRODUCT"}
                </ModalHeader>
                <ModalBody>
                    <Form action="#">
                        <div className="live-preview">
                            <Row className="gy-4">
                                <Col xxl={3} md={6}>
                                    <div>
                                        <Label htmlFor="labelInput" className="form-label">Product Name</Label>
                                        <Input type="text" className="form-control" id="labelInput" placeholder="Enter Product Name"
                                            value={productname ?? ""} onChange={handleproductnameChange} required
                                        />
                                    </div>
                                </Col>
                                <Col xxl={3} md={6}>
                                    <div>
                                        <Label htmlFor="valueInput" className="form-label">Product Cost</Label>
                                        <Input type="number" className="form-control" id="valueInput" placeholder="Enter Product Cost"
                                            value={productcost ?? ""} onChange={handleproductcostChange} required
                                        />
                                    </div>
                                </Col>
                                <Col xxl={4} md={6}>
                                    <div>
                                        <Label htmlFor="basiInput" className="form-label">Product Price</Label>
                                        <Input type="number" className="form-control" id="basiInput" placeholder="Enter Product Price"
                                            value={productprice ?? ""} onChange={handleproductpriceChange} required
                                        />
                                    </div>
                                </Col>
                                <Col xxl={3} md={6}>
                                    <div>
                                        <Label htmlFor="labelInput" className="form-label">Product Quantity</Label>
                                        <Input type="number" className="form-control" id="labelInput" placeholder="Enter Product Quantity"
                                            value={productquantity ?? ""} onChange={handleproductquantityChange} required
                                        />
                                    </div>
                                </Col>
                                <Col xxl={3} md={6}>
                                    <div>
                                        <Label htmlFor="placeholderInput" className="form-label">Product Barcode</Label>
                                        <Input type="number" className="form-control" id="placeholderInput" placeholder="Scan Product Barcode"
                                            value={productbarcode ?? ""} onChange={handleproductbarcodeChange} required
                                        />
                                    </div>
                                </Col>
                                <Col xxl={3} md={6}>
                                    <div>
                                        <Label htmlFor="valueInput" className="form-label">Product Description</Label>
                                        <Input type="text" className="form-control" id="valueInput" placeholder="Enter Product Description"
                                            value={productdescription ?? ""} onChange={handleproductdescriptionChange} required
                                        />
                                    </div>
                                </Col>
                                <Col xxl={3} md={6}>
                                    <div>
                                        <Label htmlFor="valueInput" className="form-label">Select Supplier</Label>
                                        <Select
                                            value={role.value}
                                            onChange={(sortBy) => {
                                                setrole(sortBy.value);
                                            }}
                                            defaultInputValue={Selectedrow !== { id: "", categories_description: "", categories_type: "", suppliers_id: { id: "", suppliers_name: "" }, categories_id: { id: "", categories_type: "" } } ?
                                                Selectedrow.suppliers_id.suppliers_name : ""}
                                            options={SuppliersOptionsData}
                                            classNamePrefix="js-example-data-array"
                                            isLoading={true}
                                        />
                                    </div>
                                </Col>
                                <Col xxl={3} md={6}>
                                    <div>
                                        <Label htmlFor="placeholderInput" className="form-label">Select Product Category</Label>
                                        <Select
                                            value={status.value}
                                            onChange={(sortBy) => {
                                                setstatus(sortBy.value);
                                            }}
                                            defaultInputValue={Selectedrow !== { id: "", categories_description: "", categories_type: "", suppliers_id: { id: "", suppliers_name: "" }, categories_id: { id: "", categories_type: "" } } ?
                                                Selectedrow.categories_id.categories_type : ""}
                                            options={CategoriesOptionsData}
                                            classNamePrefix="js-example-data-array"
                                            isLoading={true}
                                        />
                                    </div>
                                </Col>
                                <Col xxl={3} md={6}>
                                    <div>
                                        <Label htmlFor="valueInput" className="form-label">Enter Order level{/*(*initial (10))*/}</Label>
                                        <Input type="number" className="form-control" id="valueInput" placeholder="Enter Product Order Level"
                                            value={productOrderlevel ?? ""} onChange={handleproductOrderlevelChange} required
                                        />
                                    </div>
                                </Col>
                                <Col xxl={3} md={6}>
                                    <div>
                                        <Label htmlFor="valueInput" className="form-label">Product Tax (*optional)</Label>
                                        <Input type="number" className="form-control" id="valueInput" placeholder="Enter Product Tax"
                                            value={producttax ?? ""} onChange={handleproducttaxChange} required
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
                                    if (productbarcode,
                                        productname,
                                        productdescription,
                                        productcost,
                                        productprice,
                                        productquantity,
                                        producttax,
                                        productOrderlevel !== undefined) {
                                        handleupdateemploye()
                                        dispatch(OPENLOADER())
                                    }
                                    return false;
                                }}>Submit</Button>
                        </div>
                    </Form>
                </ModalBody>
            </Modal >
            <Modal isOpen={openModalTable} centered className="modal-lg"
                onClick={(e) => { e.preventDefault() }} modalClassName="zoomIn">
                <ModalHeader className="p-3" toggle={() => { setOpenModalTable(false); setimporteddata([]) }}>
                    Import Products
                </ModalHeader>
                <ModalBody>
                    <Row className="mt-3 pb-1">
                        <Col lg={12}>

                            <Row className="g-4 mb-3">
                                <Col className="col-sm-auto">
                                    <div>
                                        <Button onClick={() => { HandleUploadProducts() }} color="success" className="add-btn me-1" id="create-btn">Upload Products</Button>
                                    </div>
                                </Col>
                            </Row>
                            <DataTable
                                columns={columns1}
                                data={importeddata}
                                pagination
                                highlightOnHover={true}
                                striped={true}
                            />
                        </Col>
                    </Row>
                </ModalBody>
            </Modal >
        </React.Fragment >
    )
}

export default ProductsMain