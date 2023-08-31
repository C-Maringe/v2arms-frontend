import '../styles/pages/Login.css'
import { motion } from 'framer-motion'
import FocusTrap from 'focus-trap-react'
import logoblue from '../Assets/logoblue.png'
import { Toast } from 'primereact/toast';
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

const Login = ({ username, password, handleusernameChange, handlepasswordChange,
    setCurrentUser, setSuccess, success, setTellerid }) => {

    const toast = useRef(null);
    const showSuccess = () => {
        toast.current.show({ severity: 'success', summary: 'You Have Successfully Logged in', life: 3000 });
    }
    const showWarn = () => {
        toast.current.show({ severity: 'error', summary: 'Login Failed', detail: 'Invalid Supplied Credidentials', life: 3000 });
    }

    const navigate = useNavigate()

    const handleSubmit = (e) => {
        const userData = {
            username: username,
            password: password
        };
        axios.post('http://127.0.0.1:8000/api/login/', userData)
            .then((response) => {
                if (response.data.message === 'Success') {
                    response.data.user.map((data) => (setTellerid(data.id)))
                    setSuccess(true);
                    if ({ success }) navigate('/')
                }
            })
    }

    return (
        <FocusTrap>
            <div className='logiin'>
                <div style={{ height: '110px', backgroundColor: 'white' }}>
                    <div className='login-header1'>
                        <img src={logoblue} alt='logoblue' className='login-header-logo' />
                        <div className='login-header2'>Arcs Retail Application</div>
                    </div>
                </div>
                <Toast ref={toast} />
                <div className='login-container'>
                    <div className='form-container' >
                        <div className='login-title'>
                            <div className='login-title1'>
                                Login
                            </div>
                            <div className='login-title2'>
                                (Enter your Credidentials to login)
                            </div>
                        </div>
                        <div className='login-inputs-label'>
                            <label className='login-label'>Username:</label>
                            <input className='login-inputs'
                                type='text' placeholder='Enter username'
                                value={username ?? ""} required
                                onChange={handleusernameChange}
                            />
                        </div>
                        <div className='login-inputs-label'>
                            <label className='login-label'>Password:</label>
                            <input className='login-inputs'
                                type='password' placeholder='Enter password'
                                value={password ?? ""} required
                                onChange={handlepasswordChange}
                            />
                        </div>
                        <motion.button className='login-button' tabIndex="1"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && username !== '' && password !== '') {
                                    setTimeout(() => {
                                        handleSubmit()
                                        setCurrentUser({ username, role: "TELLER2" });
                                    }, 2000)
                                    showSuccess()
                                    if (username === '' && password === '') { showWarn() }
                                    if (username === '' && password !== '') { showWarn() }
                                    if (username !== '' && password === '') { showWarn() }
                                }
                            }}
                            onClick={() => {
                                if (username !== '' && password !== '') {
                                    setTimeout(() => {
                                        handleSubmit()
                                        setCurrentUser({ username, role: "TELLER2" });
                                    }, 2000)
                                    showSuccess()
                                };
                                if (username === '' && password === '') { showWarn() }
                                if (username === '' && password !== '') { showWarn() }
                                if (username !== '' && password === '') { showWarn() }
                            }}>
                            Login
                        </motion.button>
                        <div className='login-text-links-container'>
                            <div className='login-text-links' >
                                Forgot password? click here.
                            </div>
                            <div>|</div>
                            <div className='login-text-links'>
                                Want to Register? Click here.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </FocusTrap >
    )
}

export default Login