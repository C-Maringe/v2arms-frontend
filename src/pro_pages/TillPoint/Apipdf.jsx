import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactDOMServer from "react-dom/server";
import Receipt from "./pages/Receipt";
import jsPDF from "jspdf";
const doc = new jsPDF();

function Apipdf() {

    const [file, setFile] = useState(doc.html(ReactDOMServer.renderToStaticMarkup(<Receipt />)))

    function handleChange(event) {
        setFile(event.target.files[0])
    }

    // console.log(file)

    function handleSubmit(event) {
        event.preventDefault()
        var FormData = require('form-data');
        const formData = new FormData();
        formData.append('pdf', file);
        axios.post('http://127.0.0.1:8000/upload/receipt/', formData)
            .then((rseponse) => { console.log('Success:', rseponse); })
            .catch((error) => { console.log(error) });
    }

    const downloadFile = () => {
        const link = document.createElement("a");
        const content = document.querySelector("textarea").value;
        const file = new Blob([content], { type: 'text/plain' });

        var FormData = require('form-data');
        const formData = new FormData();
        formData.append('pdf', file);
        axios.post('http://127.0.0.1:8000/upload/receipt/', formData)
            .then((rseponse) => { console.log('Success:', rseponse); })
            .catch((error) => { console.log(error) });

        // link.href = URL.createObjectURL(file);
        // link.download = "sample.txt";
        // link.click();
        // URL.revokeObjectURL(link.href);
    };

    return (
        <div className="App">
            <form onSubmit={handleSubmit}>
                <h1>React File Upload</h1>
                <input type="file" onChange={handleChange} />
                <button type="submit">Upload</button>
            </form>
            <>
                <textarea> </textarea>
            </>
            <br />
            <button onClick={downloadFile}> save File </button>
        </div>
    );
}

export default Apipdf;