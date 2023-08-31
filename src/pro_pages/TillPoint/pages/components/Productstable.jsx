import React from 'react'

const Productstable = ({ renderHeader, renderBody }) => {
    return (
        <div className='table-container-main tillpoint-onfocus-style'>
            <table id="pending0" className='Rightbar-table tillpoint-onfocus-style'>
                <thead>
                    <tr className='Rightbar-header-container tillpoint-onfocus-style'>
                        {renderHeader()}
                    </tr>
                </thead>
                <tbody className='Rightbar-rows-container tillpoint-onfocus-style'>
                    {renderBody()}
                </tbody>
            </table>
        </div>
    )
}

export default Productstable

