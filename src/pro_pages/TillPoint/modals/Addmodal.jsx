import { motion, AnimatePresence } from 'framer-motion'
import FocusTrap from 'focus-trap-react'

const Addmodal = ({ addm, onAdd, addeddatas, clearadddataToAdded, Quantity0, setSelectedQuantity,
    product0, price0, HandleSubmit, setValueexists, handleselectedQuantityChange,
    selectedQuantity, clearupdateQuantity, clearselectedquantity, setCursor }) => {

    return (
        <AnimatePresence>
            {addm && (
                <div className='overlay' aria-hidden="true">
                    <FocusTrap>
                        <motion.div className='done-container' tabIndex={0}
                            drag onClick={(e) => { e.stopPropagation() }}
                            style={{
                                border: '1px solid #CCA35B',
                                backgroundColor: "#ffffff"
                                , boxShadow: '0 0 10px 10px rgb(235, 235, 235) '
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Escape") {
                                    onAdd(); setCursor(0);
                                    clearadddataToAdded(); setValueexists(false);
                                }
                            }}
                        >
                            {addeddatas.map((data) => {
                                return (
                                    <div key={data.id} style={{
                                        backgroundColor: "white", height: "350px", boxShadow: '0 0 10px 10px rgb(235, 235, 235) ',
                                        width: "520px", borderRadius: "10px",
                                        display: "flex", justifyContent: "center", alignItems: "center"
                                    }}>

                                        <div key={data.id} style={{ width: "100%" }} >
                                            <div className='addmodal-input-container'
                                                style={{ marginTop: 20 }}>
                                                <div className='addmodal-input-details'>
                                                    {product0}
                                                </div>
                                                <div className='addmodal-input-details'
                                                    style={{ marginTop: 20 }}>
                                                    ${price0}
                                                </div>
                                                <div className='addmodal-input-stock-container'
                                                    style={{ marginTop: 20 }}>
                                                    <input type="number" style={{ backgroundColor: 'rgb(209, 206, 206)' }}
                                                        placeholder="Enter Quantity"
                                                        tabIndex='1'
                                                        className='addmodal-input tillpoint-onfocus-style'
                                                        value={selectedQuantity ?? ""}
                                                        onChange={handleselectedQuantityChange}
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Enter") {
                                                                onAdd(); clearadddataToAdded();
                                                                clearupdateQuantity(); clearselectedquantity();
                                                                HandleSubmit(); setCursor(0); setSelectedQuantity(null)
                                                            }
                                                        }
                                                        }
                                                    />
                                                    <div className='addmodal-input-details-stock'
                                                        style={{ display: "flex", backgroundColor: 'rgb(235, 235, 235)', justifyContent: "center", alignItems: "center" }}
                                                    >
                                                        stock:<div style={{ color: "Black", marginLeft: 5 }}>{Quantity0}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='rightbar-left-title-input buttons-rightbar '
                                                style={{ marginTop: 40 }}>
                                                <div className='submit-button tillpoint-onfocus-style'
                                                    tabIndex='1'
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") {
                                                            onAdd();
                                                            clearadddataToAdded();
                                                            clearupdateQuantity();
                                                            clearselectedquantity();
                                                            HandleSubmit();
                                                            setCursor(0)
                                                            setSelectedQuantity(null)
                                                        }
                                                    }}
                                                    onClick={() => {
                                                        onAdd(); clearadddataToAdded(); clearupdateQuantity(); clearselectedquantity();
                                                        HandleSubmit(); setCursor(0); setSelectedQuantity(null)
                                                    }}
                                                    style={{
                                                        fontSize: 25, backgroundColor: "#194C98",
                                                        width: "40%", height: 50
                                                    }}>
                                                    Add
                                                </div>
                                                <div className='submit-button tillpoint-onfocus-style' tabIndex='1'
                                                    onClick={() => {
                                                        onAdd(); setCursor(0)
                                                        clearadddataToAdded();
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") {
                                                            onAdd();
                                                            clearadddataToAdded();
                                                        }
                                                    }}
                                                    style={{
                                                        fontSize: 25,
                                                        backgroundColor: "#194C98",
                                                        width: "30%", height: 50
                                                    }}>
                                                    Cancel
                                                </div>
                                            </div>
                                            <div className='closebutton tillpoint-onfocus-style' tabIndex='1'
                                                onClick={() => {
                                                    onAdd(); setCursor(0)
                                                    clearadddataToAdded();
                                                }}>
                                                X
                                            </div>
                                        </div>

                                    </div>)
                            })}
                        </motion.div>
                    </FocusTrap>
                </div>)}
        </AnimatePresence >
    )
}

export default Addmodal