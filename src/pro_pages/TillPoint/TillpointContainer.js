import React, { useState, useEffect } from 'react'
import Mainpanel from './pages/Mainpanel'
import { useSelector } from 'react-redux'
import axios from 'axios';
import { isExpired } from "react-jwt";
import { useNavigate } from 'react-router-dom'

const TillpointContainer = () => {
    const UserlnfoStored = ([...useSelector(state => state.UserlnfoStored)].map((data) => data.status))[0]

    const tellerid = UserlnfoStored.id
    const currentUser = { username: UserlnfoStored.username, role: UserlnfoStored.role }
    const [success, setSuccess] = useState(true)
    const user1 = UserlnfoStored.username

    const navigate = useNavigate()

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/poisonous/view/")
            .then((response) => {
                if (response.status === 200) {
                    if (isExpired(response.data.poisonous_data[0].token) === true) {
                        navigate("/payup")
                    }
                }
            })
    }, [])

    return (
        <div className="my-css-container-tillpoint">
            <Mainpanel tellerid={tellerid} currentUser={currentUser} success={success}
                setSuccess={setSuccess} user1={user1} />
        </div>
    )
}

export default TillpointContainer