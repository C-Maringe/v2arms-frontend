import FocusTrap from 'focus-trap-react'
import React from 'react'
import '../../styles/pages/components/Rightbar.css'
import Constant1 from './constant'
import Productstable from './Productstable'

const Rightbar = ({ setcurrency2, pay, setZwl, setUsd, setDone, pending0, renderHeader, renderBody,
    totalPrice, actionsss, setpending0, focusrightbottom, rightbottomfocus, Quantity0,
    rightfocus, inputfocus, focusright, updateitemsfocus, handleupdate, deletependingitem,
    idup, proup, priup, selup, handleselupChange, setActionsss }) => {

    return (
        <div className='Rightbar-container'>
            <div className='table-container tillpoint-onfocus-style' tabIndex="1" ref={rightfocus}
                onKeyDown={(e) => {
                    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                        inputfocus()
                    }
                    if (e.key === 'ArrowDown') {
                        focusrightbottom()
                    }
                }}>
                <Productstable renderHeader={renderHeader} renderBody={renderBody} />
            </div>
            <div className='rightbar-bottom-container'>
                {actionsss.length > 0 ?
                    <FocusTrap>
                        <div className='rightbar-left-container tillpoint-onfocus-style' tabIndex="1"
                            onKeyDown={(e) => {
                                if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                                    inputfocus()
                                }
                                if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                                    focusright()
                                }
                            }}>
                            <div >
                                <div className='rightbar-left-title-input'>
                                    <div className='rightbar-left-title'>
                                        Product:
                                    </div>
                                    <div className='rightbar-left-input'>{proup}</div>
                                </div>
                                <div className='rightbar-left-title-input'>
                                    <div className='rightbar-left-title'>
                                        Unit Price:
                                    </div>
                                    <div className='rightbar-left-input'>{priup}</div>
                                </div>
                                <div className='rightbar-left-title-input'>
                                    <div className='rightbar-left-title'>
                                        Quantity:
                                    </div>
                                    <input className='rightbar-left-input tillpoint-onfocus-style' ref={updateitemsfocus}
                                        style={{ marginLeft: 25 }} tabIndex='1'
                                        value={selup ?? ""}
                                        type="number"
                                        placeholder="Quantity"
                                        onChange={handleselupChange}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") { handleupdate(); setActionsss([]); inputfocus() }
                                            if (e.key === "Escape") { setpending0([]); setActionsss([]); inputfocus() }
                                            if (e.key === "Delete") { deletependingitem(); setActionsss([]); inputfocus() }
                                        }}
                                        onClick={(e) => {
                                            if (e.key === "Enter") { handleupdate(); setActionsss([]); }
                                            if (e.key === "Escape") { setpending0([]); setActionsss([]); }
                                            if (e.key === "Delete") { deletependingitem(); setActionsss([]); }
                                        }}
                                    />
                                    <div className='rightbar-left-stock-status' style={{ fontWeight: 700 }}>
                                        Stock: <div style={{ color: "white" }}> {Quantity0}</div>
                                    </div>
                                </div>
                                <div className='rightbar-left-title-input'>
                                    <div className='rightbar-left-title'>
                                        Description:
                                    </div>
                                    <div className='rightbar-left-input' >
                                        {idup}
                                    </div>
                                </div>
                            </div>
                            <div className='rightbar-left-title-input buttons-rightbar'>
                                <div type='submit' className='submit-button' tabIndex='1'
                                    onClick={() => { handleupdate(); setActionsss([]) }}
                                    onKeyDown={(e) => { if (e.key === 'Enter') { handleupdate(); setActionsss([]); inputfocus() } }}
                                    style={{ backgroundColor: "#164c98" }}>
                                    Update
                                </div>
                                <div className='submit-button' tabIndex='1' style={{ backgroundColor: "#164c98" }}
                                    onClick={() => { deletependingitem(); setActionsss([]); inputfocus() }}
                                    onKeyDown={(e) => { if (e.key === 'Enter') { deletependingitem(); setActionsss([]) } }}>
                                    Drop
                                </div>
                                <div className='submit-button' tabIndex='1' style={{ backgroundColor: "#164c98" }}
                                    onClick={() => { setpending0([]); setActionsss([]); inputfocus() }}
                                    onKeyDown={(e) => { if (e.key === 'Enter') { setpending0([]); setActionsss([]) } }}>
                                    Reset
                                </div>
                            </div>
                        </div>
                    </FocusTrap>
                    :
                    <div className='rightbar-left-container tillpoint-onfocus-style' tabIndex="1"
                        onKeyDown={(e) => {
                            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                                inputfocus()
                            }
                            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                                focusright()
                            }
                        }}>
                        <Constant1 />
                        <div className='rightbar-left-title-input buttons-rightbar'>
                            <div type='submit' className='submit-button'

                                style={{ backgroundColor: "#164c98" }}>
                                Update
                            </div>
                            <div className='submit-button' style={{ backgroundColor: "#164c98" }}>
                                Drop
                            </div>
                            <div className='submit-button' style={{ backgroundColor: "#164c98" }} tabIndex='1'
                                onClick={() => { setpending0([]); inputfocus() }}
                                onKeyDown={(e) => { if (e.key === 'Enter') { setpending0([]); inputfocus() } }}>
                                Reset
                            </div>
                        </div>
                    </div>
                }
                {pending0.length > 0 ?
                    <div className='rightbar-bottom-right' tabIndex="1" ref={rightbottomfocus}
                        onKeyDown={(e) => {
                            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { inputfocus() }
                            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { focusright() }
                            if (e.key === "Enter") {
                                pay();
                                setUsd(false);
                                setZwl(true);
                                setDone(false);
                                inputfocus()
                                setcurrency2("ZWL")
                            }
                            if (e.key === "Shift") {
                                pay();
                                setUsd(true);
                                setZwl(false);
                                setDone(false);
                                inputfocus()
                                setcurrency2("USD")
                            }

                        }}>
                        <div className='rightbar-bottom-right-items'>
                            <div className='rightbar-bottom-right-title'>
                                Sub Total :
                            </div>
                            <div className='rightbar-bottom-right-input'>
                                $ {totalPrice.toFixed(2)}
                            </div>
                        </div>
                        <div className='rightbar-bottom-right-items'>
                            <div className='rightbar-bottom-right-title'>
                                (+) Vat :
                            </div>
                            <div className='rightbar-bottom-right-input'>
                                $ 0.00
                            </div>
                        </div>
                        <div className='rightbar-bottom-right-items'>
                            <div className='rightbar-bottom-right-title'>
                                Net Payable :
                            </div>
                            <div className='rightbar-bottom-right-input'>
                                $ {totalPrice.toFixed(2)}
                            </div>
                        </div>
                        <div className='rightbar-bottom-right-items ' style={{ paddingTop: 25 }}>
                            <div className='submit-button' tabIndex="1"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        pay();
                                        setUsd(false);
                                        setZwl(true);
                                        setDone(false);
                                        inputfocus()
                                        setcurrency2("ZWL")
                                    }
                                    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                                        focusright()
                                    }
                                }}
                                onClick={() => {
                                    pay();
                                    setUsd(false);
                                    setZwl(true);
                                    setDone(false);
                                    inputfocus()
                                    setcurrency2("ZWL")
                                }} style={{ backgroundColor: "#164c98" }}>
                                ZWL
                            </div>
                            <div className='submit-button' style={{ backgroundColor: "#164c98" }} tabIndex="1"
                                onKeyDown={(e) => {
                                    if (e.key === "Shift") {
                                        pay();
                                        setUsd(true);
                                        setZwl(false);
                                        setDone(false);
                                        inputfocus()
                                        setcurrency2("USD")
                                    }
                                    if (e.key === 'ArrowDown') {
                                        focusright()
                                    }
                                    if (e.key === 'ArrowUp') {
                                        focusright()
                                    }
                                }}
                                onClick={() => {
                                    pay();
                                    setUsd(true);
                                    setZwl(false);
                                    setDone(false);
                                    inputfocus()
                                    setcurrency2("USD")
                                }}>
                                USD
                            </div>
                        </div>
                    </div>
                    :
                    <div className='rightbar-bottom-right' tabIndex="1" ref={rightbottomfocus}
                        onKeyDown={(e) => {
                            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                                inputfocus()
                            }
                            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                                focusright()
                            }
                        }}>
                        <div className='rightbar-bottom-right-items'>
                            <div className='rightbar-bottom-right-title'>
                                Sub Total
                            </div>
                            <div className='rightbar-bottom-right-input'>
                                ${totalPrice.toFixed(2)}
                            </div>
                        </div>
                        <div className='rightbar-bottom-right-items'>
                            <div className='rightbar-bottom-right-title'>
                                (+) Vat
                            </div>
                            <div className='rightbar-bottom-right-input'>
                                $0.00
                            </div>
                        </div>
                        <div className='rightbar-bottom-right-items'>
                            <div className='rightbar-bottom-right-title'>
                                Net Payable
                            </div>
                            <div className='rightbar-bottom-right-input'>
                                ${totalPrice.toFixed(2)}
                            </div>
                        </div>
                        <div className='rightbar-bottom-right-items ' style={{ paddingTop: 25 }}>
                            <div className='submit-button'
                                style={{ backgroundColor: "#164c98" }}>
                                ZWL
                            </div>
                            <div className='submit-button' style={{ backgroundColor: "#164c98" }}>
                                USD
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div >
    )
}

export default Rightbar