import { motion, AnimatePresence } from 'framer-motion'
import React, { useRef, useState, useEffect } from 'react'
import '../styles/modals/All.css'
import FocusTrap from 'focus-trap-react'
import axios from 'axios'
import { FcCancel } from 'react-icons/fc'
import Spinner from '../pages/components/Spinner'
import api from '../Api/api'
import moment from 'moment'

const Alltr = ({ totalPrice, rate, inputfocus, setPayed, senditems, tellerid, user1,
    showall, onCL, zwl, setZwl, usd, setUsd, done, setDone, setPayingusd, pending0,
    renderHeader1, renderBody1, handlepayedChange, payed, clearpending0,
    currency2, setcurrency2 }) => {

    const top1 = useRef()
    const top11 = () => { top1.current.focus() }
    const top2 = useRef()
    const top22 = () => { top2.current.focus() }
    const top3 = useRef()
    const top33 = () => { top3.current.focus() }
    const top4 = useRef()
    const top44 = () => { top4.current.focus() }
    const top5 = useRef()
    const top55 = () => { top5.current.focus() }
    const top6 = useRef()
    const top66 = () => { top6.current.focus() }
    const [payusd, setPayusd] = useState(false)

    const [spinner, setSpinner] = useState(false)
    const [faileds, setfaileds] = useState(false)
    const [spinner1, setSpinner1] = useState(false)
    const [faileds1, setfaileds1] = useState(false)
    const [tenderType, setTenderType] = useState(null)
    const [rrn, setRrn] = useState(null)
    const [refn, setrefn] = useState(null)
    const [imei, setImei] = useState(null)
    const [pan, setPan] = useState(null)
    const [description, setdescription] = useState('Cash ZWL Approved')

    const [stoptransaction, setstoptransaction] = useState(false)
    const [perfomaction, setperfomaction] = useState(false)

    const handleclick = () => { setstoptransaction(true); setTenderType("MOBILE"); setperfomaction(true) }
    const handleclick1 = () => { setstoptransaction(true); setTenderType("SWIPE"); setperfomaction(true) }
    const handleclick2 = () => { setstoptransaction(true); setTenderType("CASH-ZWL"); setperfomaction(true) }
    const handleclick3 = () => { setstoptransaction(true); setTenderType("CASH-USD"); setdescription("Cash USD Approved"); setperfomaction(true) }

    const [invoicereturn, setinvoicereturn] = useState({})
    const [returnedid, setreturnedid] = useState("")
    const [buttonloading, setbuttonloading] = useState(false)

    const sendsalesitems = pending0.map((data) => ({
        base_currency: "USD", channel: tenderType, cost_price: (data.cost * rate), employeeId: tellerid,
        product: data.product0, price: (data.price0 * rate), description: description, employee: user1,
        foreign_currency: "ZWL", imei: imei, invoiceId: 1, pan: pan, productId: data.id,
        quantity: data.selectedQuantity,
        rate: rate,
        reference: refn, rrn: rrn, status: "COMPLETE",
        shop_name: "Choppies", tax: data.tax, total: data.Total0 * rate
    }))

    const sendsalesitemsfailed = pending0.map((data) => ({
        base_currency: "USD", channel: tenderType, cost_price: (data.cost * rate), employeeId: tellerid,
        product: data.product0, price: (data.price0 * rate), description: description, employee: user1,
        foreign_currency: "ZWL", imei: imei, invoiceId: 1, pan: pan, productId: data.id,
        quantity: data.selectedQuantity,
        rate: rate,
        reference: refn, rrn: rrn, status: "FAILED",
        shop_name: "Choppies", tax: data.tax, total: (data.Total0 * rate)
    }))

    useEffect(() => {
        if (tenderType === 'SWIPE' && stoptransaction === true) {
            setSpinner(false);
            setfaileds1(false);
            setSpinner1(true);
            processPayment();
            setstoptransaction(false)
        }
        if (tenderType === 'MOBILE' && stoptransaction === true) {
            setSpinner1(false);
            setfaileds(false);
            setSpinner(true);
            processPayment();
            setstoptransaction(false)
        }
        //FAILED

        if (tenderType === 'CASH-ZWL' && stoptransaction === true && returnedid !== "") {
            setDone(true); setZwl(false); setstoptransaction(false);
            setRrn(returnedid)
            HandlePrintReceipt()
            api.post('/api/update/invoice/', [{ "id": returnedid, "status": "COMPLETE" }])
                .then((response) => {
                    // Handlepay();
                    api.post('/api/update/', solditems.items)
                    api.post('/api/sales/', pending0.map((data) => ({
                        base_currency: "USD", channel: tenderType, cost_price: (data.cost * rate), employeeId: tellerid,
                        product: data.product0, price: (data.price0 * rate), description: description, employee: user1,
                        foreign_currency: "ZWL", imei: imei, invoiceId: 1, pan: pan, productId: data.id,
                        quantity: data.selectedQuantity, rate: rate, reference: refn, rrn: returnedid,
                        shop_name: "Choppies", tax: data.tax, total: (data.Total0 * rate), status: "COMPLETE"
                    })))
                })
                .catch((error) => { console.log(error) })
            setbuttonloading(false)
            setreturnedid(""); setcurrency2("")
        }
        if (tenderType === 'CASH-USD' && stoptransaction === true && returnedid !== "") {
            setDone(true); setUsd(false); setstoptransaction(false)
            HandlePrintReceipt()
            api.post('/api/update/invoice/', [{ "id": returnedid, "status": "COMPLETE" }])
                .then((response) => {
                    api.post('/api/update/', solditems.items)
                    api.post('/api/sales/', pending0.map((data) => ({
                        base_currency: "USD", channel: tenderType, cost_price: data.cost, employeeId: tellerid,
                        product: data.product0, price: data.price0, description: description, employee: user1,
                        foreign_currency: "ZWL", imei: imei, invoiceId: 1, pan: pan, productId: data.id,
                        quantity: data.selectedQuantity, rate: 1, reference: refn, rrn: returnedid,
                        shop_name: "Choppies", tax: data.tax, total: data.Total0, status: "COMPLETE"
                    })))
                })
            setreturnedid(""); setbuttonloading(false); setcurrency2("")
        }
    }, [tenderType, returnedid, stoptransaction])

    const solditems = {
        "id": tellerid,
        "items": senditems
    }

    const [transstatus, settransstatus] = useState("PENDING")

    const invoicedata = {
        "status": transstatus,
        "amount": totalPrice,
        "vat": 0,
        "currency": currency2,
        "employeeId": tellerid,
        "channel": tenderType,
        "reference": rrn
    }

    const handleinvoicecreate = () => {
        api.post('/api/invoice/create/', invoicedata)
            .then((response) => {
                setreturnedid(response.data.data.id)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    useEffect(() => {
        if (tenderType !== "" & perfomaction === true) {
            handleinvoicecreate()
            setperfomaction(false)
        }
    }, [tenderType, perfomaction])

    const processPaymentdata = {
        "saleAmount": totalPrice * rate.toFixed(2),
        "cashBack": "0",
        "tenderType": tenderType,
        "currency": "RTGS"
    }

    const Handlepay = () => {
        api.post('/api/update/', solditems.items)
        api.post('/api/sales/', sendsalesitems)
    }

    const Handletransactionfailed = () => {
        api.post('/api/sales/', sendsalesitemsfailed)
    }

    const [errorProcess, setErrorProcess] = useState(false)

    const [datanew, setdatanew] = useState("")
    const [conss, setconss] = useState(false)
    const [stoprunning, setstoprunning] = useState(false)
    const processPayment = () => {
        axios.post('http://localhost:9111/api/requests', processPaymentdata)
            .then((response) => {
                if (response.data.code === "00") {
                    setdatanew(response.data)
                    setstoprunning(true)
                }
                else {
                    setdatanew(response.data)
                    setstoprunning(true)
                    setfaileds(true)
                    setfaileds1(true)
                }
            })
            .catch(error => {
                setfaileds(true)
                setfaileds1(true)
                setErrorProcess(true)
                setdatanew("FAILED")
                setstoprunning(true)
            })
    }

    useEffect(() => {
        if (datanew.code === "00" && stoprunning === true) {
            setdescription(datanew.description)
            setImei(datanew.imei);
            setPan(datanew.pan);
            setRrn(returnedid);
            setrefn(datanew.ref);
            HandlePrintReceipt()
            setTimeout(() => {
                setconss(true)
            }, 100)
            setstoprunning(false)
        }
        else if (datanew.code !== "00" && stoprunning === true && errorProcess === false) {
            setdescription(datanew.description)
            setRrn(returnedid);
            setTimeout(() => {
                setconss(true)
            }, 100)
            setstoprunning(false)
        }
        else if (datanew.code !== "00" && stoprunning === true && errorProcess === true) {
            setdescription("Connection Error")
            setRrn(null);
            setTimeout(() => {
                setconss(true)
            }, 100)
            setstoprunning(false)
        }
    }, [datanew, stoprunning, errorProcess, returnedid])

    useEffect(() => {
        if (conss === true && datanew.code === "00") {
            setDone(true); setZwl(false); setUsd(false)
            api.post('/api/update/invoice/', [
                { "id": returnedid, "status": "COMPLETE", "reference": datanew.rrn }])
            Handlepay(); setconss(false)
            setSpinner(false);
            setfaileds1(false);
            setSpinner1(false);
            setImei(null);
            setPan(null);
            setRrn(null);
            setrefn(null);
            setdescription('Cash Approved')
            setcurrency2("")
        }
        else if (conss === true && datanew.code !== "00" && errorProcess === false) {
            console.log(returnedid)
            api.post('/api/update/invoice/', [
                { "id": returnedid, "status": "FAILED", "reference": 500 }])
            Handletransactionfailed(); setconss(false)
            setfaileds1(true);
            setImei(null);
            setPan(null);
            setRrn(null);
            setrefn(null);
            setdescription('Cash Approved')
            setcurrency2("")
            if (tenderType === "MOBILE") { setSpinner(true); }
            if (tenderType === "SWIPE") { setSpinner1(true); }
        }

        else if (conss === true && datanew.code !== "00" && errorProcess === true) {
            api.post('/api/update/invoice/', [
                { "id": returnedid, "status": "FAILED", "reference": 500 }])
            Handletransactionfailed(); setconss(false)
            setfaileds1(true);
            setErrorProcess(true)
            setImei(null);
            setPan(null);
            setRrn(null);
            setrefn(null);
            setdescription('Connection Error')
            setcurrency2("")
            if (tenderType === "MOBILE") { setSpinner(true); }
            if (tenderType === "SWIPE") { setSpinner1(true); }
        }
    }, [datanew, conss, errorProcess, returnedid, setDone, setUsd, setZwl, setcurrency2, tenderType])

    const handleprintdata = {
        "data": tenderType === "CASH-USD" ?
            pending0.map((data) => ([data.product0, data.price0, data.selectedQuantity, data.Total0])) :
            pending0.map((data) => ([data.product0, data.price0 * rate, data.selectedQuantity, data.Total0 * rate])),
        "teller": user1,
        "reference": returnedid,
        "payment_method": tenderType === "MOBILE" ? "ECOCASH" : tenderType,
        "date": moment(Date.now()).format('DD-MM-YYYY[ ]HH:mm:ss'),
        "payedamount": parseInt(payed).toFixed(2),
        "totalprice": tenderType === "CASH-USD" ? (totalPrice).toFixed(2) : (totalPrice * rate).toFixed(2),
        "change": tenderType === "CASH-USD" ? (payed - (totalPrice)).toFixed(2) : (payed - (totalPrice * rate)).toFixed(2),
        "vat": "0.00"
    }

    const HandlePrintReceipt = () => {
        api.post('http://127.0.0.1:7000/upload/receipt/', handleprintdata)
            .then((response) => { console.log(response); setreturnedid(""); })
            .catch((error) => { console.log(error) })
    }

    return (
        <AnimatePresence>
            {showall && (
                <div className='overlay'>
                    <FocusTrap>
                        <div onKeyDown={(e) => { if (e.key === "Escape") { onCL() } }}>
                            {zwl && (
                                <motion.div className='done-container' drag
                                    onClick={(e) => { e.stopPropagation() }}>
                                    <div className='done-items'
                                        style={{
                                            fontWeight: 600, paddingBottom: 10, paddingTop: 10
                                            , backgroundColor: "white"
                                        }}>
                                        {(totalPrice * rate).toFixed(2)} ZWL
                                    </div >
                                    <input className='done-items all-inputs-inputs tillpoint-onfocus-style' tabIndex='1' ref={top1}
                                        value={payed}
                                        onChange={handlepayedChange}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && payed >= (totalPrice * rate)) {
                                                handleclick2();
                                            }
                                            if (e.key === 'ArrowUp') { top44() }
                                            if (e.key === 'ArrowDown') { top22() }
                                        }}
                                        placeholder='Paid Amount'
                                        style={{
                                            fontWeight: 600, paddingBottom: 10, paddingTop: 10
                                            , backgroundColor: "white"
                                        }} />
                                    <div className='done-items tillpoint-onfocus-style' tabIndex='1' ref={top2}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && payed >= (totalPrice * rate)) {
                                                handleclick2();
                                            }
                                            if (e.key === 'Enter' && payed < (totalPrice * rate)) { alert('Invalid Payed Amount') }
                                            if (e.key === 'ArrowUp') { top11() }
                                            if (e.key === 'ArrowDown') { top33() }
                                        }}
                                        onClick={() => {
                                            if (payed >= (totalPrice * rate)) { handleclick2(); }
                                        }}
                                        style={{ fontWeight: 600, paddingBottom: 10, paddingTop: 10 }}>
                                        Cash ZWL
                                    </div>
                                    <div className='done-items tillpoint-onfocus-style' tabIndex='1' ref={top3}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") { handleclick(); }
                                            if (e.key === 'ArrowUp') { top22() }
                                            if (e.key === 'ArrowDown') { top44() }
                                        }}
                                        onClick={() => { handleclick(); }}
                                        style={{ fontWeight: 600, paddingBottom: 10, paddingTop: 10 }}>
                                        Ecocash {spinner ? <div className='loading-cc'>{faileds ? <FcCancel /> : <Spinner />}
                                            <div className='loading-ccc'>{faileds ? <>Transaction Failed Try again</> : <>Processing...</>}</div>
                                        </div> : <></>}
                                    </div>
                                    <div className='done-items tillpoint-onfocus-style' tabIndex='1' ref={top4}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") { handleclick1(); }
                                            if (e.key === 'ArrowUp') { top33() }
                                            if (e.key === 'ArrowDown') { top11() }
                                        }}
                                        onClick={() => { handleclick1(); }}
                                        style={{ fontWeight: 600, paddingBottom: 10, paddingTop: 10 }}>
                                        Zimswitch{spinner1 ? <div className='loading-cc'>{faileds1 ? <FcCancel /> : <Spinner />}
                                            <div className='loading-ccc'>{faileds1 ? <>Transaction Failed Try again</> : <>Processing...</>}</div>
                                        </div> : <></>}
                                    </div>
                                    <div className='closebutton tillpoint-onfocus-style' tabIndex='1'
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') { onCL() }
                                        }}
                                        onClick={onCL}>
                                        X
                                    </div>
                                </motion.div>)}
                            {usd && (
                                <FocusTrap>
                                    <motion.div className='done-container'
                                        drag onClick={(e) => { e.stopPropagation() }}>
                                        <div className='done-items'
                                            style={{
                                                fontWeight: 600, paddingBottom: 10, paddingTop: 10
                                                , backgroundColor: "white"
                                            }}>
                                            {totalPrice.toFixed(2)}
                                        </div >
                                        <input className='done-items all-inputs-inputs tillpoint-onfocus-style' tabIndex='1' ref={top5}
                                            value={payed}
                                            onChange={handlepayedChange}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && payed < totalPrice) { alert('Invalid Payed Amount') }
                                                if (e.key === "Enter" && payed >= totalPrice) {
                                                    handleclick3();
                                                    setPayusd(true); setPayingusd(true);
                                                }
                                                if (e.key === 'ArrowUp' || e.key === 'ArrowDown') { top66() }
                                            }}
                                            placeholder='Paid Amount'
                                            style={{
                                                fontWeight: 600, paddingBottom: 10, paddingTop: 10
                                                , backgroundColor: "white"
                                            }} />
                                        <div className='done-items tillpoint-onfocus-style' tabIndex='1' ref={top6}
                                            onKeyDown={(e) => {
                                                if (e.key === 'ArrowUp' || e.key === 'ArrowDown') { top55() }
                                                if (e.key === 'Enter' && payed >= totalPrice) {
                                                    handleclick3();
                                                    setPayusd(true); setPayingusd(true);
                                                }
                                            }}
                                            onClick={() => {
                                                if (payed >= totalPrice) {
                                                    handleclick3(); setbuttonloading(true)
                                                    setPayusd(true); setPayingusd(true);
                                                }
                                            }}
                                            style={{ fontWeight: 600, paddingBottom: 10, paddingTop: 10 }}>
                                            Cash USD {buttonloading && <div style={{ marginLeft: "20px" }}><Spinner /></div>}
                                        </div>
                                        <div className='closebutton tillpoint-onfocus-style' tabIndex='1'
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') { onCL() }
                                            }}
                                            onClick={onCL}>
                                            X
                                        </div>
                                    </motion.div>
                                </FocusTrap>
                            )}
                            {done && (
                                <FocusTrap>
                                    <motion.div className='done-done-container'
                                        drag onClick={(e) => { e.stopPropagation() }}>
                                        <div className='done-done-items' >
                                            <div className='table-container-main' style={{ width: '95%' }}>
                                                <table id="pending0" className='Rightbar-table'>
                                                    <thead>
                                                        <tr className='Rightbar-header-container'>
                                                            {renderHeader1()}
                                                        </tr>
                                                    </thead>
                                                    <tbody className='Rightbar-rows-container'>
                                                        {renderBody1()}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div style={{ color: "gold", fontSize: 24, fontWeight: 600 }}>

                                            {datanew.code === "00" || tenderType === 'CASH-ZWL' || tenderType === 'CASH-USD' ?
                                                <>
                                                    Change: {payusd ?
                                                        <>{(payed - totalPrice).toFixed(2)} USD</>
                                                        :
                                                        <>{(payed - (totalPrice * rate)).toFixed(2)} ZWL </>
                                                    }
                                                </> :
                                                <div style={{ color: "red" }}>
                                                    Transaction Failed retry!
                                                </div>}
                                        </div>
                                        <div className='done-items' tabIndex='1'
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    if (datanew.code === "00" || tenderType === 'CASH-ZWL' || tenderType === 'CASH-USD') {
                                                        inputfocus()
                                                        setDone(false);
                                                        setPayed('')
                                                        onCL();
                                                        clearpending0();
                                                        setPayusd(false)
                                                        setPayingusd(false)
                                                        setPayed()
                                                    }
                                                    else {
                                                        inputfocus()
                                                        setDone(false);
                                                        setPayed('')
                                                        onCL();
                                                        setPayusd(false)
                                                        setPayingusd(false)
                                                        setPayed()
                                                    }
                                                }
                                            }}
                                            onClick={() => {
                                                if (datanew.code === "00" || tenderType === 'CASH-ZWL' || tenderType === 'CASH-USD') {
                                                    setDone(false);
                                                    onCL();
                                                    clearpending0();
                                                    setPayed('')
                                                    setPayusd(false)
                                                    setPayingusd(false)
                                                    setPayed()
                                                }
                                                else {
                                                    setDone(false);
                                                    onCL();
                                                    setPayed('')
                                                    setPayusd(false)
                                                    setPayingusd(false)
                                                    setPayed()
                                                }
                                            }}
                                            style={{ width: 150, fontWeight: 600, paddingBottom: 5, paddingTop: 5 }}>
                                            Done
                                        </div>
                                        <div className='closebutton'
                                            onClick={() => {
                                                onCL();
                                                inputfocus()
                                                setPayusd(false)
                                                setPayingusd(false)
                                            }}>
                                            X
                                        </div>
                                    </motion.div>
                                </FocusTrap>
                            )}
                        </div>
                    </FocusTrap>
                </div>
            )}
        </AnimatePresence>

    )
}

export default Alltr