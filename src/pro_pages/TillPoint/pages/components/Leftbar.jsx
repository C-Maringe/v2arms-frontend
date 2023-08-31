import React, { useEffect, useState } from 'react'
import '../../styles/pages/components/Leftbar.css'
import { InputText } from 'primereact/inputtext';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const Leftbar = ({ setAddm, adddataToAdded, setpending0, mockdata, pending0, setCursor, cursor,
    setaddd1111, resetfocus, focusrightbottom, pay, setUsd, setZwl, setDone }) => {

    const mockdata1 = mockdata
    const columns = Object.keys(mockdata1[0] || {});
    const [search, setNewSearch] = useState("");
    const filtered = !search ? mockdata1 : mockdata1.filter((data) =>
        columns.some((column) =>
            data[column]?.toString().toLowerCase().indexOf(search?.toString().toLowerCase() || "") > -1
        ),
    );

    return (
        <div className='Leftbar-container'>
            <span className="p-input-icon-left leftbar-header">
                <i className="pi pi-search" />
                <InputText type='search' placeholder='Search for Items here' tabIndex="1"
                    className='Leftbar-search tillpoint-onfocus-style' ref={resetfocus}
                    value={search} onChange={(e) => {
                        setNewSearch(e.target.value);
                        if (search > 100000000000 && filtered.length === 1) setTimeout(() => {
                            filtered.map((data) => {
                                var result = pending0.filter(function (o1) {
                                    return filtered.some(function (o2) {
                                        return o1.id === o2.id;
                                    });
                                });
                                var [ckecking1] = result.map((quan) => { return (quan.selectedQuantity) })
                                if (result.length === 1 && data.quantity > 0
                                    && ckecking1 < data.quantity) {
                                    var [idnew] = result.map((data) => { return (data.id) })
                                    const adda =
                                        pending0.map((add1) => {
                                            return add1.id === idnew ? {
                                                ...add1, selectedQuantity: Number(add1.selectedQuantity) + 1,
                                                Total0: (Number(add1.selectedQuantity) + 1) * Number(add1.price0),
                                                time: Date.now()
                                            } : add1
                                        })
                                    setpending0(adda);
                                    setaddd1111(true)
                                    setTimeout(() => {
                                        setaddd1111(false)
                                    }, 200)
                                    return (
                                        setpending0(adda)
                                    )
                                }
                                if (result.length === 0 && data.quantity > 0) {
                                    setaddd1111(true)
                                    setTimeout(() => {
                                        setaddd1111(false)
                                    }, 200)
                                    return (
                                        setpending0(pending0 => [...pending0, {
                                            id: data.id,
                                            product0: data.product,
                                            price0: Number(data.price),
                                            selectedQuantity: Number(1),
                                            Total0: (Number(data.price) * Number(1)),
                                            cost: data.cost,
                                            tax: data.tax,
                                            categoryId: data.categoryId,
                                            supplierId: data.supplierId,
                                            time: Date.now()
                                        }]))
                                }
                                else {
                                    alert('Out Of Stock')
                                }
                                return null
                            });
                            setNewSearch("")
                        }, 500)
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "ArrowRight" || e.key === 'ArrowLeft') {
                            focusrightbottom()
                        }
                        if (e.key === "ArrowDown") {
                            setCursor(
                                prevState => prevState < filtered.length + 1 ? prevState + 1 : prevState
                            )
                        }
                        if (e.key === "ArrowUp") {
                            setCursor(
                                prevState => (prevState > 0 ? prevState - 1 : prevState)
                            )
                        }
                        if (e.key === 'Shift' && pending0.length > 0) {
                            pay();
                            setUsd(false);
                            setZwl(true);
                            setDone(false);
                        }
                        if (e.key === "Enter") {
                            filtered.map((data, index) => {
                                if (cursor === index) {
                                    let arr = []
                                    const obj = data
                                    arr.push(obj)
                                    var result = pending0.filter(function (o1) {
                                        return arr.some(function (o2) {
                                            return o1.id === o2.id;
                                        });
                                    });
                                    var [idnew] = arr.map((data2) => { return (data2.quantity) })
                                    var [idnew1] = arr.map((data2) => { return (data2.id) })
                                    var [quantss] = result.map((quantsss) => { return (quantsss.selectedQuantity) })
                                    const adda =
                                        pending0.map((add1) => {
                                            return add1.id === idnew1 && quantss < idnew ? {
                                                ...add1, selectedQuantity: Number(add1.selectedQuantity) + 1,
                                                Total0: (Number(add1.selectedQuantity) + 1) * Number(add1.price0),
                                                time: Date.now()
                                            } : add1
                                        })
                                    if (result.length === 1 && data.quantity > 0) {
                                        setpending0(adda);
                                        setaddd1111(true)
                                        setTimeout(() => {
                                            setaddd1111(false)
                                        }, 200)
                                    }
                                    if (result.length === 0 && data.quantity > 0) {
                                        adddataToAdded(data);
                                        setAddm(true)
                                    }
                                }
                                return null
                            })
                        }
                    }}
                />
            </span>
            <div className='leftbar-products' >
                <div className='leftbar-products-title'>
                    Products
                </div>
                <div className='leftbar-products-items-container tillpoint-onfocus-style'
                    onKeyDown={(e) => {
                        if (e.key === "ArrowRight" || e.key === 'ArrowLeft') {
                            focusrightbottom()
                        }
                        if (e.key === "ArrowDown") {
                            setCursor(
                                prevState => prevState < filtered.length + 1 ? prevState + 1 : prevState
                            )
                        }
                        if (e.key === "ArrowUp") {
                            setCursor(
                                prevState => (prevState > 0 ? prevState - 1 : prevState)
                            )
                        }
                        if (e.key === "Enter") {
                            filtered.map((data, index) => {
                                if (cursor === index) {
                                    let arr = []
                                    const obj = data
                                    arr.push(obj)
                                    var result = pending0.filter(function (o1) {
                                        return arr.some(function (o2) {
                                            return o1.id === o2.id;
                                        });
                                    });
                                    var [idnew] = arr.map((data2) => { return (data2.quantity) })
                                    var [idnew1] = arr.map((data2) => { return (data2.id) })
                                    var [quantss] = result.map((quantsss) => { return (quantsss.selectedQuantity) })
                                    const adda =
                                        pending0.map((add1) => {
                                            return add1.id === idnew1 && quantss < idnew ? {
                                                ...add1, selectedQuantity: Number(add1.selectedQuantity) + 1,
                                                Total0: (Number(add1.selectedQuantity) + 1) * Number(add1.price0),
                                                time: Date.now()
                                            } : add1
                                        })
                                    if (result.length === 1 && data.quantity > 0) {
                                        setpending0(adda);
                                        setaddd1111(true)
                                        setTimeout(() => {
                                            setaddd1111(false)
                                        }, 200)
                                    }
                                    if (result.length === 0 && data.quantity > 0) {
                                        adddataToAdded(data);
                                        setAddm(true)
                                    }
                                }
                                return null
                            })
                        }
                    }}>
                    {filtered.map((data, i) => {
                        return (
                            <div key={data.id}
                                className={`item ${i === cursor && data.quantity >= 0 ? "leftbar-products-items-active activecolo" :
                                    i === cursor && data.quantity <= 0 ? "leftbar-products-items-active activebutzero" :
                                        data.quantity <= 0 ? "leftbar-products-items-active quantity-is-zero" :
                                            (i % 2 === 0) ? "leftbar-products-items-active notactive" : "leftbar-products-items"}`}
                                onClick={() => {
                                    let arr = []
                                    const obj = data
                                    arr.push(obj)
                                    var result = pending0.filter(function (o1) {
                                        return arr.some(function (o2) {
                                            return o1.id === o2.id;
                                        });
                                    });
                                    var [idnew] = arr.map((data2) => { return (data2.quantity) })
                                    var [idnew1] = arr.map((data2) => { return (data2.id) })
                                    var [quantss] = result.map((quantsss) => { return (quantsss.selectedQuantity) })
                                    const adda =
                                        pending0.map((add1) => {
                                            return add1.id === idnew1 && quantss < idnew ? {
                                                ...add1, selectedQuantity: Number(add1.selectedQuantity) + 1,
                                                Total0: (Number(add1.selectedQuantity) + 1) * Number(add1.price0),
                                                time: Date.now()
                                            } : add1
                                        })
                                    if (result.length === 1 && data.quantity > 0) {
                                        setpending0(adda);
                                        setaddd1111(true)
                                        setTimeout(() => {
                                            setaddd1111(false)
                                        }, 200)
                                    }
                                    if (result.length === 0 && data.quantity > 0) {
                                        adddataToAdded(data);
                                        setAddm(true)
                                    }
                                    return null
                                }}>
                                {data.product}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Leftbar