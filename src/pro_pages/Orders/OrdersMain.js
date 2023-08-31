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
import Select from "react-select";
import { Toast } from 'primereact/toast';
import api from '../TillPoint/Api/api';
import { CLOSELOADER, OPENLOADER } from '../../store/Loader/OpenLoader';

const OrdersMain = () => {
    SwiperCore.use([Autoplay])
    const dispatch = useDispatch()
    const toast = useRef(null);
    const { layoutModeType } = useSelector(state => ({ layoutModeType: state.Layout.layoutModeType }))
    const [activeTab, setActiveTab] = useState('1')
    const toggleTab = (tab) => { if (activeTab !== tab) { setActiveTab(tab); } }
    const [activePage, setActivePage] = useState('1')
    const togglePage = (tab) => { if (activePage !== tab) { setActivePage(tab); } }
    const UserlnfoStored = ([...useSelector(state => state.UserlnfoStored)].map((data) => data.status))[0]

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

    const [selecteddate, setselecteddate] = useState({ startdate: startdate, enddate: enddate })


    const [OpenAdd, setOpenAdd] = useState(false);
    const toggleOpenAdd = () => { setOpenAdd(!OpenAdd); }

    const [OpenAdd1, setOpenAdd1] = useState(false);
    const toggleOpenAdd1 = () => { setOpenAdd1(!OpenAdd1); }

    const [selectedRange, setSelectedRange] = useState()
    const [selectedRange2, setSelectedRange2] = useState()

    const [Salesdata, setSalesdata] = useState([])
    const [rerunfetch, setrerunfetch] = useState(false)
    const togglererunfetch = () => { setrerunfetch(!rerunfetch); }
    const fetchdata = async () => {
        const response = await api.post('/api/orders/view/', selecteddate)
        if (response.data.status_code === 200) { setSalesdata(response.data.orders) }
        else if (response.data.status_code !== 200) {
            setSalesdata([]);
        }
    }

    useEffect(() => {
        fetchdata()
    }, [rerunfetch, selecteddate])
    const newArr = Salesdata.sort(function (a, b) { return b.id - a.id });
    const columns = [
        {
            name: <span className='font-weight-bold fs-13'>ID</span>,
            selector: row => row.id,
            sortable: true,
            grow: 1
        },
        {
            name: <span className='font-weight-bold fs-13'>Date</span>,
            selector: row => moment(row.createed_at).format('DD-MM-YYYY[ ]HH:mm:ss'),
            sortable: true,
            grow: 3
        },
        {
            name: <span className='font-weight-bold fs-13'>Product Name</span>,
            selector: row => row.name,
            sortable: true,
            grow: 3
        },
        {
            name: <span className='font-weight-bold fs-13'>Category</span>,
            selector: row => row.categories_id.categories_type,
            sortable: true,
            grow: 2
        },
        {
            name: <span className='font-weight-bold fs-13'>Supplier</span>,
            selector: row => row.suppliers_id.suppliers_name,
            sortable: true,
            // grow: 3
        },
        {
            name: <span className='font-weight-bold fs-13'>Cost</span>,
            selector: row => row.cost,
            sortable: true,
            // grow: 3
        },
        {
            name: <span className='font-weight-bold fs-13'>Price</span>,
            selector: row => row.price,
            sortable: true,
            // grow: 3
        },
        {
            name: <span className='font-weight-bold fs-13'>Quantity</span>,
            selector: row => row.quantity,
            sortable: true,
            // grow: 3
        },
        {
            name: <span className='font-weight-bold fs-13'>Description</span>,
            selector: row => row.description,
            sortable: true,
            // grow: 3
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

    const [categoriesid, setcategoriesid] = useState({ id: 11111, cost: 0, price: 0, quantity: 0, tax: 0, product: "" })
    const [productname, setproductname] = useState(null)
    const [productdescription, setproductdescription] = useState(null)
    const [productcost, setproductcost] = useState(null)
    const [productprice, setproductprice] = useState(null)
    const [productquantity, setproductquantity] = useState(null)
    const [producttax, setproducttax] = useState(null)

    const handleproductdescriptionChange = (e) => { setproductdescription(e.target.value) }
    const handleproductcostChange = (e) => { setproductcost(e.target.value) }
    const handleproductpriceChange = (e) => { setproductprice(e.target.value) }
    const handleproductquantityChange = (e) => { setproductquantity(e.target.value) }
    const handleproducttaxChange = (e) => { setproducttax(e.target.value) }

    const [SelectedProduct, setSelectedProduct] = useState({ id: 0, cost: 0, price: 0, product: "", tax: 0, description: "" })

    const ResetStatesToDefault = () => {
        setproductname(null)
        setproductdescription(null)
        setproductcost(null)
        setproductprice(null)
        setproductquantity(null)
        setproducttax(null)
        setcategoriesid({ id: 11111, cost: 0, price: 0, quantity: 0, tax: 0, product: "" })
    }

    const productsdata = {
        cost: parseInt(productcost),
        description: productdescription,
        name: categoriesid.product,
        price: parseInt(productprice),
        quantity: parseInt(productquantity),
        tax: parseInt(producttax),
        categories_id: categoriesid.categories_id,
        suppliers_id: categoriesid.suppliers_id,
    }

    const productsdataupdate = {
        id: categoriesid.id,
        cost: productcost === 0 ? categoriesid.cost : parseInt(productcost),
        price: productprice === 0 ? categoriesid.price : parseInt(productprice),
        quantity: productquantity === null ? 0 : parseInt(productquantity),
        tax: producttax === 0 ? categoriesid.tax : parseInt(producttax),
    }

    const handleupdateemploye = () => {
        api.post("/api/orders/create/", productsdata)
            .then((response) => {
                if (response.status === 201) {
                    api.post("/api/orders/products/update/", [productsdataupdate])
                        .then((response) => {
                            api.post("/api/logs/create/", {
                                "username": UserlnfoStored.username,
                                "user_id": UserlnfoStored.id,
                                "item": JSON.stringify(productsdataupdate),
                                "quantity": 1,
                                "action": "UPDATED",
                                "description": "UPDATED A PRODUCT BY CREATING A NEW ORDER"
                            })
                        })
                    api.post("/api/logs/create/", {
                        "username": UserlnfoStored.username,
                        "user_id": UserlnfoStored.id,
                        "item": JSON.stringify(productsdata),
                        "quantity": 1,
                        "action": "CREATED",
                        "description": "CREATED AN ORDER"
                    })
                    dispatch(CLOSELOADER())
                    togglererunfetch()
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

    const [getProducts, setGetProducts] = useState([])

    useEffect(() => {
        setproductdescription(categoriesid.description)
        setproductcost(categoriesid.cost)
        setproductprice(categoriesid.price)
        setproducttax(categoriesid.tax)
    }, [categoriesid])

    useEffect(() => {
        api.get('/api/allproducts/')
            .then((response) => {
                if (response.status === 200) {
                    setGetProducts(response.data.map((data) => ({
                        value: {
                            id: data.id, suppliers_id: data.suppliers_id.id, description: data.description,
                            categories_id: data.categories_id.id, product: data.name, cost: data.cost,
                            price: data.price, quantity: data.quantity, tax: data.tax
                        }, label: data.name
                    })))
                }
                else if (response.status !== 200) {
                    setGetProducts([]);
                }
            })
            .catch((error) => {
                setGetProducts([]);
            })
    }, [])

    document.title = "Arcs | Orders";
    return (
        <React.Fragment>
            <Toast ref={toast} />
            <div className="page-content ">
                <Container fluid className='pagecooooo'>
                    <BreadCrumb title="Orders" pageTitle="Orders" />
                    <Row>
                        <Col>
                            <div className="h-100">
                                <Row className="mb-1 pb-1">
                                    <Col xs={12}>
                                        <div className="d-flex align-items-lg-center flex-lg-row flex-column">
                                            <div className="flex-grow-1">
                                                <h4 className="fs-16 mb-1">ORDERS MANAGEMENT</h4>
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
                                                            className={classnames({ active: activePage === '1' })}
                                                            onClick={() => {
                                                                togglePage('1');
                                                            }}
                                                        >
                                                            <i className="ri-list-unordered d-inline-block d-md-none"></i> <span
                                                                className="d-none d-md-inline-block"><div style={{ color: "white" }}
                                                                    onClick={() => {
                                                                        toggleOpenAdd();
                                                                    }}>ADD NEW ORDER</div></span>
                                                        </NavLink>
                                                    </NavItem>
                                                </Nav>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>

                                <Row className='mt-4'>
                                    <Col lg={12}>
                                        <div>
                                            <div >
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
                                                            onClick={() => { toggleTab('4'); toggleOpenAdd1(); }}
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


                                <Row className="mt-3 pb-1">
                                    <Col lg={12}>
                                        <Card>
                                            <CardHeader>
                                                <h5 className="card-title mb-0">Orders Table</h5>
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
                    </Row >
                </Container >
            </div >
            <Modal isOpen={OpenAdd} centered className="modal-lg"
                onClick={(e) => { e.preventDefault() }} modalClassName="zoomIn">
                <ModalHeader className="p-3" toggle={() => { toggleOpenAdd(); ResetStatesToDefault() }}>
                    ADD NEW ORDER
                </ModalHeader>
                <ModalBody>
                    <Form action="#">
                        <div className="live-preview">
                            <Row className="gy-4">
                                <Col xxl={3} md={6}>
                                    <div>
                                        <Label htmlFor="labelInput" className="form-label">Select Product</Label>
                                        <Select
                                            value={SelectedProduct.value}
                                            onChange={(sortBy) => {
                                                setSelectedProduct(sortBy.label);
                                                setcategoriesid(sortBy.value)
                                            }}
                                            options={getProducts}
                                            classNamePrefix="js-example-data-array"
                                            isLoading={true}
                                            menuPortalTarget={document.body}
                                            styles={{ menuPortal: base => ({ ...base, zIndex: 999999999 }) }}
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
                                        <Label htmlFor="valueInput" className="form-label">Product Description</Label>
                                        <Input type="text" className="form-control" id="valueInput" placeholder="Enter Product Description"
                                            value={productdescription ?? ""} onChange={handleproductdescriptionChange} required
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
                            <Button className="btn btn-primary" type="submit"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (productname,
                                        productdescription,
                                        productcost,
                                        productprice,
                                        productquantity,
                                        producttax !== undefined) {
                                        handleupdateemploye()
                                        dispatch(OPENLOADER())
                                    }
                                    return false;
                                }}>Submit</Button>
                        </div>
                    </Form>
                </ModalBody>
            </Modal >
            <Modal isOpen={OpenAdd1} centered
                onClick={(e) => { e.preventDefault() }} modalClassName="flip">
                <ModalHeader className="p-3" toggle={() => { toggleOpenAdd1(); }}>
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
                                    toggleOpenAdd1();
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

export default OrdersMain