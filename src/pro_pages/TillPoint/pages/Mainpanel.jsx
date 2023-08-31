import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from './components/Header'
import Leftbar from './components/Leftbar'
import Rightbar from './components/Rightbar'
import '../styles/pages/Mainpanel.css'
import Alltr from '../modals/All'
import Addmodal from '../modals/Addmodal'
import { FiEdit } from 'react-icons/fi'
import FocusTrap from 'focus-trap-react'
import api from '../Api/api'
import '../styles/pages/Receipt.css'
import moment from 'moment'

const Mainpanel = ({ tellerid, currentUser, setSuccess, user1 }) => {

    const [rate, setRate] = useState(0)

    useEffect(() => {
        api.get('/api/zwl/rate/')
            .then((response) => {
                setRate(
                    response.data.rates.reduce((a, v) => a = a + v.rate).rate)
            })
    }, [])

    const [cursor, setCursor] = useState(0);
    const navigate = useNavigate()

    // Holding Table Data
    const [pending0, setpending0] = useState(JSON.parse(localStorage.getItem('StoredDataPending0')) === null ? [] : JSON.parse(localStorage.getItem('StoredDataPending0')))

    useEffect(() => {
        localStorage.setItem('StoredDataPending0', JSON.stringify(pending0))
    }, [pending0])

    const [getData, setGetData] = useState([{ id: 123456789, name: 'Loading...' }])

    const fetchdata = async () => {
        const response = await api.get(
            '/api/view/'
        )
        setGetData(response.data.product)
    }
    useEffect(() => {
        // const interval = setTimeout(() => {
        fetchdata();
        // }, 5000)
        // return () => clearTimeout(interval)
    }, [pending0])

    const mockdata = getData.map(({ name, ...rest }) => ({ ...rest, product: name }));

    const [showall, setShowall] = useState(false)
    const [zwl, setZwl] = useState(false)
    const [usd, setUsd] = useState(false)
    const [addm, setAddm] = useState(false)
    const [done, setDone] = useState(false)

    const [addeddatas, setAddeddatas] = useState([])
    const adddataToAdded = (toAdddata) => {
        setAddeddatas([...addeddatas, toAdddata])
    }

    const clearadddataToAdded = () => {
        adddataToAdded('');
        setAddeddatas([])
    };

    const [actionsss, setActionsss] = useState([])

    useEffect(() => {
        if (addeddatas.length > 0) {
            const [avvv] = addeddatas
            const prod1 = avvv['product'];
            const id1 = avvv['id'];
            const pric1 = avvv['price'];
            const quan1 = avvv['quantity'];
            const cost1 = avvv['cost'];
            const tax1 = avvv['tax'];
            // const supplierId1 = avvv['supplierId'];
            // const categoryId1 = avvv['categoryId'];
            setcost(cost1)
            settax(tax1)
            // setsupplierId(supplierId1)
            // setcategoryId(categoryId1)
            setproduct0(prod1);
            setId(id1);
            setprice0(pric1);
            setQuantity0(quan1);
        }
    }, [addeddatas]);

    const [idup, setIdup] = useState()
    const [proup, setProup] = useState()
    const [priup, setPriup] = useState()
    const [selup, setSelup] = useState()
    const [totup, setTotup] = useState()
    const handleselupChange = (e) => {
        setSelup(Math.abs(Math.max(Math.min(Number(e.target.value), Quantity0), 0)));
    }

    useEffect(() => {
        if (actionsss.length > 0) {
            const [dataaa] = actionsss
            const { id, product0, price0, selectedQuantity, Total0 } = dataaa
            setIdup(id); setPriup(price0); setProup(product0); setSelup(selectedQuantity); setTotup(Total0)
        }
    }, [actionsss]);

    // ###############################################################

    const [categoryId, setcategoryId] = useState()
    const [cost, setcost] = useState()
    const [supplierId, setsupplierId] = useState()
    const [tax, settax] = useState()

    // ########################################################################

    const [id, setId] = useState();
    const [product0, setproduct0] = useState()
    const [price0, setprice0] = useState()
    const [Quantity0, setQuantity0] = useState()
    const [selectedQuantity, setSelectedQuantity] = useState(null)
    const [Total0, setTotal0] = useState()

    const handleupdate = (e) => {
        var result = pending0.filter((pending01) => pending01.id === idup)
        var [idnew] = result.map((data) => { return (data.id) })
        const adda =
            pending0.map((add1) => {
                return add1.id === idnew ? {
                    ...add1, selectedQuantity: Number(selup),
                    Total0: (Number(selup)) * Number(add1.price0),
                    time: Date.now()
                } : add1
            })
        if (result.length === 1) {
            setpending0(adda);
            setaddd1111(true)
            setTimeout(() => {
                setaddd1111(false)
            }, 200)
        }
        setId('');
        setIdup()
        setPriup()
        setProup()
    }
    const selected = () => { adddataToAdded(''); };

    const clearselectedquantity = () => { setSelectedQuantity(null); }

    const deletependingitem = async (id) => {
        const delete1 = pending0.filter((pending01) => pending01.id !== idup)
        setpending0(delete1)
        const add111 = pending0.filter((pending01) => pending01.selectedQuantity > 0)
        if (pending0.length - add111.length === 1) {
            setpending0(add111)
            setdeelet(true)
            setTimeout(() => {
                setdeelet(false)
            }, 100)
        }
        else {
            setpending0(delete1)
            setdeelet(true)
            setTimeout(() => {
                setdeelet(false)
            }, 100)
        }
    }

    const [deelet, setdeelet] = useState(false)
    const [addd1111, setaddd1111] = useState(false)

    const renderHeader = () => {
        return (
            <>
                <th className='Rightbar-table-header' style={{ width: '5%', marginLeft: 20 }}>ID</th>
                <th className='Rightbar-table-header'>PRODUCT</th>
                <th className='Rightbar-table-header' style={{ width: '7%' }}>PRICE</th>
                <th className='Rightbar-table-header' style={{ width: '5%' }}>QUANTITY</th>
                <th className='Rightbar-table-header' style={{ width: '7%' }}>TOTAL</th>
                <th className='Rightbar-table-header' style={{ width: '3%' }}>EDIT</th>
            </>
        )
    }
    const updateitemsfocus = useRef()
    const updateitemsfocusnow = () => { updateitemsfocus.current.focus() }
    const resetfocus = useRef()
    const inputfocus = () => { resetfocus.current.focus() }

    const senditems = pending0.map((data) => ({ id: data.id, quantity: data.selectedQuantity }))

    const renderBody = () => {
        return pending0.sort(function (a, b) { return b.time - a.time }).map(({
            id,
            product0,
            price0,
            selectedQuantity,
            Total0,
        }, i) => {
            return (
                <tr key={id} style={{
                    color: addd1111 ? "#ffffff" : "black",
                    backgroundColor: addd1111 ? "#164C98" : deelet ? "red" :
                        (i % 2 === 0) ? "rgb(209, 206, 206)" : "rgb(235, 235, 235)",
                    height: addd1111 ? "50px" : deelet ? "50px" : "",
                }} className='Rightbar-rows-container'>
                    <td className='Rightbar-rows-items' style={{ width: '20px' }}>{id}</td>
                    <td className='Rightbar-rows-items'>{product0}</td>
                    <td className='Rightbar-rows-items'>$ {price0}</td>
                    <td className='Rightbar-rows-items'>{selectedQuantity}</td>
                    <td className='Rightbar-rows-items'>$ {Total0.toFixed(2)}</td>
                    <td className='Rightbar-rows-items-icons' >
                        <FiEdit tabIndex='1' className='Rightbar-rows-items-icon tillpoint-onfocus-style'
                            style={{ color: addd1111 ? "#ffffff" : '' }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    const updatedata = pending0.filter((pending01) => pending01.id === id)
                                    let arr = []
                                    var [obj] = updatedata
                                    arr.push(obj)
                                    setActionsss(arr);
                                    inputfocus()
                                }
                            }}
                            onClick={() => {
                                const updatedata = pending0.filter((pending01) => pending01.id === id)
                                let arr = []
                                var [obj] = updatedata
                                arr.push(obj)
                                setActionsss(arr);
                                inputfocus()
                            }} />
                    </td>
                </tr>
            );
        });
    }
    const renderHeader1 = () => {
        return (
            <>
                <th className='Rightbar-table-header'>PRODUCT</th>
                <th className='Rightbar-table-header' style={{ width: '5%' }}>PRICE</th>
                <th className='Rightbar-table-header' style={{ width: '3%' }}>QUANTITY</th>
                <th className='Rightbar-table-header' style={{ width: '5%' }}>TOTAL</th>
            </>
        )
    }
    const [payingusd, setPayingusd] = useState(false)

    const renderBody1 = () => {
        return pending0.map(({
            id,
            product0,
            price0,
            selectedQuantity,
            Total0
        }, i) => {
            return (
                <tr key={id} style={{
                    backgroundColor: addd1111 ? "rgb(72, 192, 240)" : deelet ? "red" :
                        (i % 2 === 0) ? "rgb(209, 206, 206)" : "white",
                    height: addd1111 ? "50px" : deelet ? "50px" : "",
                }} className='Rightbar-rows-container'>
                    <td className='Rightbar-rows-items'>{product0}</td>
                    <td className='Rightbar-rows-items'>$ {payingusd ? <>{price0.toFixed(2)}</> : <>{(price0 * rate).toFixed(2)}</>}</td>
                    <td className='Rightbar-rows-items'>{selectedQuantity}</td>
                    <td className='Rightbar-rows-items'>$ {payingusd ? <>{Total0.toFixed(2)}</> : <>{(Total0 * rate).toFixed(2)}</>}</td>
                </tr>
            );
        });
    }

    const handleproduct0Change = (e) => { setproduct0(e.target.value); }
    const handleprice0Change = (e) => { setprice0(e.target.value); }
    const handleQuantity0Change = (e) => { setQuantity0(e.target.value); }

    const handleselectedQuantityChange = event => { setSelectedQuantity(Math.abs(Math.max(Math.min(Number(event.target.value), Quantity0), 1))); }

    const HandleSubmit = (e) => {
        if (selectedQuantity === null) {
            setpending0(pending0 => [...pending0, {
                id,
                product0,
                price0,
                selectedQuantity: 1,
                Total0: (price0 * 1),
                cost,
                tax,
                categoryId,
                supplierId,
                time: Date.now()
            }]);
            setId(id);
            setproduct0('');
            setprice0();
            setSelectedQuantity(null);
            setTotal0();
            setcategoryId();
            setcost();
            setsupplierId();
            settax();
        }
        if (selectedQuantity === 0) {
            setpending0(pending0 => [...pending0, {
                id,
                product0,
                price0,
                selectedQuantity: 1,
                Total0: (price0 * selectedQuantity),
                cost,
                tax,
                categoryId,
                supplierId,
                time: Date.now()
            }]);
            setId(id);
            setproduct0('');
            setprice0();
            setSelectedQuantity(null);
            setTotal0();
            setcategoryId();
            setcost();
            setsupplierId();
            settax();
        }
        if (selectedQuantity > 0) {
            setpending0(pending0 => [...pending0, {
                id,
                product0,
                price0,
                selectedQuantity,
                Total0: (price0 * selectedQuantity),
                cost,
                tax,
                categoryId,
                supplierId,
                time: Date.now()
            }]);
            setId(id);
            setproduct0('');
            setprice0();
            setSelectedQuantity(null);
            setTotal0();
            setcategoryId();
            setcost();
            setsupplierId();
            settax();
        }
        setaddd1111(true)
        setTimeout(() => {
            setaddd1111(false)
        }, 200)
    }

    const [payed, setPayed] = useState('')
    const handlepayedChange = (e) => { setPayed(e.target.value); }

    const clearpending0 = () => {
        setpending0([]);
        setTotalPrice(0.00)
    };

    const [valueexists, setValueexists] = useState(false)
    const [updateQuantity, setUpdateQuantity] = useState(1)
    const handleupdateQuantityChange = (e) => { setUpdateQuantity(e.target.value); }
    const clearupdateQuantity = () => { setUpdateQuantity(1) };
    const [totalPrice, setTotalPrice] = useState(0.00)

    useEffect(() => {
        setTotalPrice((pending0.reduce((a, v) => a = a + v.Total0, 0)))
    }, [pending0]);

    const rightfocus = useRef()
    const focusright = () => { rightfocus.current.focus() }
    const rightbottomfocus = useRef()
    const focusrightbottom = () => { rightbottomfocus.current.focus() }

    const ReceiptHtml = () => {
        return (
            <div className='receipt-container' id='receipttoprint'>
                <div className='receipt-header-container'>
                    <div className='receipt-header'>Jinga Investments (Pvt) Ltd</div>
                    <div className='receipt-header'>14 Shumba Road</div>
                    <div className='receipt-header'>Masasa Park</div>
                    <div className='receipt-header'>Harare</div>
                    <div className='receipt-header'>Cashier: {user1}</div>
                </div>
                <div className='receipt1' style={{ marginTop: '40px' }}>
                    <div className='receipt11'>
                        <div className='receipt111'>Date:</div>
                        <div className='receipt111'>
                            {moment(Date.now()).utc().format('DD-MM-YYYY[ ]hh:mm:ss')}</div>
                    </div>
                    <div className='receipt11'>
                        <div className='receipt111'>Ref:</div>
                        <div className='receipt111'>1658151701869</div>
                    </div>
                    <div className='receipt11'>
                        <div className='receipt111'>Payment Method</div>
                        <div className='receipt111'>Cash</div>
                    </div>
                </div>
                <table style={{ marginLeft: "50px", marginTop: "20px" }}>
                    <thead>
                        <tr>
                            {renderHeader1()}
                        </tr>
                    </thead>
                    <tbody>
                        {renderBody1()}
                    </tbody>
                </table>
                <div className='receipt1'>
                    <div className='receipt11'>
                        <div className='receipt111'>SUB TOTAL:</div>
                        <div className='receipt111'>$ {totalPrice.toFixed(2)}</div>
                    </div>
                    <div className='receipt11'>
                        <div className='receipt111'>VAT:</div>
                        <div className='receipt111'>$ 0.00</div>
                    </div>
                    <div className='receipt11'>
                        <div className='receipt111'>TOTAL:</div>
                        <div className='receipt111'>$ {totalPrice.toFixed(2)}</div>
                    </div>
                </div>
                <div className='receipt-footer' style={{ marginTop: '40px' }}>
                    Thank you for your valued support.
                </div>
            </div>
        )
    }

    const [currency2, setcurrency2] = useState('')

    return (
        <>
            <FocusTrap  >
                <div className='Mainpanel-container'
                    onKeyDown={(e) => {
                        if (e.key.toLowerCase() === "escape" && e.shiftKey) {
                            setSuccess(false)
                        }
                    }}>
                    <Alltr renderHeader1={renderHeader1} renderBody1={renderBody1} pending0={pending0}
                        zwl={zwl} setZwl={setZwl} usd={usd} setUsd={setUsd} done={done} senditems={senditems}
                        setDone={setDone} totalPrice={totalPrice} rate={rate} setPayingusd={setPayingusd}
                        showall={showall} onCL={() => setShowall(false)} inputfocus={inputfocus}
                        renderHeader={renderHeader} renderBody={renderBody} setPayed={setPayed}
                        handlepayedChange={handlepayedChange} payed={payed} clearpending0={clearpending0}
                        tellerid={tellerid} user1={user1} currency2={currency2} setcurrency2={setcurrency2}
                    />
                    <Addmodal
                        addeddatas={addeddatas} addm={addm} onAdd={() => setAddm(false)} id={id}
                        clearadddataToAdded={clearadddataToAdded} selected={selected}
                        handleselectedQuantityChange={handleselectedQuantityChange}
                        selectedQuantity={selectedQuantity} valueexists={valueexists} setValueexists={setValueexists}
                        Quantity0={Quantity0} handleQuantity0Change={handleQuantity0Change}
                        HandleSubmit={HandleSubmit} product0={product0} price0={price0}
                        updateQuantity={updateQuantity} clearupdateQuantity={clearupdateQuantity}
                        handleupdateQuantityChange={handleupdateQuantityChange}
                        clearselectedquantity={clearselectedquantity}
                        setSelectedQuantity={setSelectedQuantity} pending0={pending0} setCursor={setCursor}
                    />
                    <Header currentUser={currentUser} setSuccess={setSuccess} />
                    <div className='Mainpanel-below'>
                        <Leftbar adddataToAdded={adddataToAdded} setpending0={setpending0} pending0={pending0} id={id}
                            focusright={focusright} cursor={cursor} setCursor={setCursor}
                            Quantity0={Quantity0} resetfocus={resetfocus} setaddd1111={setaddd1111}
                            mockdata={mockdata} setAddm={setAddm} focusrightbottom={focusrightbottom}
                            product0={product0} price0={price0} selectedQuantity={selectedQuantity} Total0={Total0}
                            setDone={setDone} setUsd={setUsd} setZwl={setZwl} pay={() => setShowall(true)} />
                        <Rightbar
                            setcurrency2={setcurrency2}
                            HandleSubmit={HandleSubmit} handleproduct0Change={handleproduct0Change}
                            handleprice0Change={handleprice0Change} handleQuantity0Change={handleQuantity0Change}
                            Total0={Total0} product0={product0} price0={price0} Quantity0={Quantity0} id={id}
                            pending0={pending0} actionsss={actionsss} setActionsss={setActionsss}
                            renderHeader={renderHeader} handleupdate={handleupdate}
                            renderBody={renderBody} focusrightbottom={focusrightbottom}
                            clearadddataToAdded={clearadddataToAdded} focusright={focusright}
                            rightfocus={rightfocus} inputfocus={inputfocus}
                            totalPrice={totalPrice} rightbottomfocus={rightbottomfocus}
                            setDone={setDone} setUsd={setUsd} setZwl={setZwl} pay={() => setShowall(true)}
                            idup={idup} proup={proup} priup={priup} selup={selup} totup={totup}
                            handleselupChange={handleselupChange} setpending0={setpending0}
                            deletependingitem={() => deletependingitem(id)}
                            updateitemsfocusnow={updateitemsfocusnow} updateitemsfocus={updateitemsfocus}
                        />
                    </div>
                </div>
            </FocusTrap >
        </>
    )
}

export default Mainpanel