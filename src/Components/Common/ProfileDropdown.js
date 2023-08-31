import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import humanicon from '../../assets/Pictures/humanicon.jpg'
import { Islogged0utTRIGGER } from '../../store/Auth/Islogged';
import { Link } from 'react-router-dom';

const ProfileDropdown = () => {
    const dispatch = useDispatch()
    const UserlnfoStored = ([...useSelector(state => state.UserlnfoStored)].map((data) => data.status))[0]

    //Dropdown Toggle
    const [isProfileDropdown, setIsProfileDropdown] = useState(false);
    const toggleProfileDropdown = () => {
        setIsProfileDropdown(!isProfileDropdown);
    };
    return (
        <React.Fragment>
            <Dropdown isOpen={isProfileDropdown} toggle={toggleProfileDropdown} className="ms-sm-3 header-item topbar-user">
                <DropdownToggle tag="button" type="button" className="btn">
                    <span className="d-flex align-items-center">
                        <img className="rounded-circle header-profile-user" src={humanicon}
                            alt="Header Avatar" />
                        <span className="text-start ms-xl-2">
                            <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">{UserlnfoStored.username}</span>
                            <span className="d-none d-xl-block ms-1 fs-12 text-muted user-name-sub-text">{UserlnfoStored.role}</span>
                        </span>
                    </span>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-end">
                    <Link to='/tillpoint'>
                        <DropdownItem ><i
                            className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i> <span
                                className="align-middle" data-key="t-logout">Point Of Sale</span></DropdownItem>
                    </Link>
                    <Link to='/login'
                        onClick={() => {
                            dispatch(Islogged0utTRIGGER())
                        }}>
                        <DropdownItem ><i
                            className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i> <span
                                className="align-middle" data-key="t-logout">Logout</span></DropdownItem></Link>
                </DropdownMenu>
            </Dropdown>
        </React.Fragment>
    );
};

export default ProfileDropdown;