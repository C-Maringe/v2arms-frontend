import React from 'react'

const ProductsForm = ({ HandleSubmit, handleproduct0Change, handleprice0Change,
    handleQuantity0Change, Total0, product0, price0, Quantity0 }) => {
    return (
        <form onSubmit={HandleSubmit}>
            <div>
                <input
                    required
                    value={product0}
                    placeholder='product0'
                    id='product0'
                    name='product0'
                    onChange={handleproduct0Change}
                />
                <input
                    value={price0}
                    type="number"
                    placeholder='price0'
                    id='price0'
                    name='price0'
                    onChange={handleprice0Change}
                />
                <input
                    required
                    value={Quantity0}
                    type="number"
                    placeholder="Quantity0"
                    onChange={handleQuantity0Change}
                />
            </div>
            <button onClick={() => {
                Total0()
            }}>submit</button>
        </form>
    )
}

export default ProductsForm