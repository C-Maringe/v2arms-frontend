import React, { useState } from 'react'
import '../../styles/pages/components/Header.css'
import { FiLogOut } from 'react-icons/fi'
import { useDispatch } from 'react-redux'
import { Islogged0utTRIGGER } from '../../../../store/Auth/Islogged'
import { Link } from 'react-router-dom'
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';

const Header = ({ currentUser, setSuccess }) => {

    const dispatch = useDispatch()
    const [isProfileDropdown, setIsProfileDropdown] = useState(false);
    const toggleProfileDropdown = () => {
        setIsProfileDropdown(!isProfileDropdown);
    };

    return (
        <div className='Header-container '>
            <div className='Header-container1 '>
                <div className='Header-container-username '>
                    {currentUser.username} {currentUser.role}
                </div>{currentUser.role === "ADMIN" ?
                    <Dropdown isOpen={isProfileDropdown} toggle={toggleProfileDropdown}>
                        <DropdownToggle >
                            <FiLogOut className='Header-icon ' />
                        </DropdownToggle>
                        <DropdownMenu className="dropdown-menu-end">
                            <Link to='/'>
                                <DropdownItem ><i
                                    className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i> <span
                                        className="align-middle" data-key="t-logout">Go Back Home</span></DropdownItem>
                            </Link>
                            <Link to='/login'
                                onClick={() => {
                                    dispatch(Islogged0utTRIGGER())
                                }}>
                                <DropdownItem ><i
                                    className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i> <span
                                        className="align-middle" data-key="t-logout">Logout</span></DropdownItem></Link>
                        </DropdownMenu>
                    </Dropdown> :
                    <Link className='tillpoint-onfocus-style' to='/login' onClick={() => {
                        setSuccess(false)
                        dispatch(Islogged0utTRIGGER())
                    }}
                        style={{ marginLeft: "10px" }}
                    >
                        <FiLogOut className='Header-icon ' />
                    </Link>}
            </div>
        </div>
    )
}

export default Header