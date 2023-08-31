import React from 'react'

const Constant1 = () => {
    return (
        <div>
            <div className='rightbar-left-title-input'>
                <div className='rightbar-left-title' style={{ height: 31 }}>
                    Product:
                </div>
                <div className='rightbar-left-input' >

                </div>
            </div>
            <div className='rightbar-left-title-input'>
                <div className='rightbar-left-title' style={{ height: 31 }}>
                    Unit Price:
                </div>
                <div className='rightbar-left-input' >

                </div>
            </div>
            <div className='rightbar-left-title-input'>
                <div className='rightbar-left-title' style={{ height: 31 }}>
                    Quantity:
                </div>
                <div className='rightbar-left-input' style={{ marginLeft: 25 }}>

                </div>
                <div className='rightbar-left-stock-status' style={{ fontWeight: 700 }}>
                    Stock: <div style={{ color: "white" }}> Null</div>
                </div>
            </div>
            <div className='rightbar-left-title-input' style={{ height: 31 }}>
                <div className='rightbar-left-title'>
                    Description:
                </div>
                <div className='rightbar-left-input' >

                </div>
            </div>
        </div>
    )
}

export default Constant1