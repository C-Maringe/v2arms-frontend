import React from 'react'
import '../styles/pages/Receipt.css'

const Receipt = () => {
    return (
        <div className='receipt-container'>
            <div className='receipt-header-container'>
                <div className='receipt-header' onClick={()=>{window.print()}}>Famethe (Pvt) Ltd</div>
                <div className='receipt-header'>14 Shumba Road</div>
                <div className='receipt-header'>Masasa Park</div>
                <div className='receipt-header'>Harare</div>
                <div className='receipt-header'>0782972378</div>
                <div className='receipt-header'>Cashier: john cena</div>
            </div>
            <div className='receipt1' style={{ marginTop: '40px' }}>
                <div className='receipt11'>
                    <div className='receipt111'>Date:</div>
                    <div className='receipt111'>2022/07/18 15:41:42</div>
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
            <table className='receipt-table'>
                <thead>
                    <tr>
                        <th className='receipt-table-header'>Item</th>
                        <th className='receipt-table-header'>Price</th>
                        <th className='receipt-table-header'>Qty</th>
                        <th className='receipt-table-header'>Total</th>
                    </tr>
                </thead>
                <tbody className='receipt-rows-container'>
                    <tr >
                        <td className='receipt-rows-items'>Half Bread yechingwa</td>
                        <td className='receipt-rows-items'>$ 5.00</td>
                        <td className='receipt-rows-items'>1</td>
                        <td className='receipt-rows-items'>$ 5.00</td>
                    </tr>
                </tbody>
            </table>
            <div className='receipt1'>
                <div className='receipt11'>
                    <div className='receipt111'>SUB TOTAL:</div>
                    <div className='receipt111'>$ 5.00</div>
                </div>
                <div className='receipt11'>
                    <div className='receipt111'>VAT:</div>
                    <div className='receipt111'>$ 0.00</div>
                </div>
                <div className='receipt11'>
                    <div className='receipt111'>TOTAL:</div>
                    <div className='receipt111'>$ 5.00</div>
                </div>
            </div>
            <div className='receipt-footer' style={{ marginTop: '40px' }}>
                Thank you for your valued support.
            </div>
        </div>
    )
}

export default Receipt