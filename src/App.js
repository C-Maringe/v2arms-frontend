import React, { useEffect } from 'react';
import { Spinner, Modal, ModalBody } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';

import './App.css'

//import Scss
import './assets/scss/themes.scss';
import './assets/scss/custom.css'

//imoprt Route
import Route from './Routes';
import { CLOSEPAYMENTWARNING } from './store/Loader/PaymentWarning';

function App() {

  const dispatch = useDispatch()

  const CHECKLOADERSTATUS = ([...useSelector(state => state.TOGGLELOADER)].map((data) => data.status))[0]
  const CHECKPAYMENTWARNINGTATUS = ([...useSelector(state => state.TOGGLEPAYMENTWARNING)].map((data) => data.status))[0]
  const IsAdminLogged = ([...useSelector(state => state.IsAdminLogged)].map((data) => data.status))[0]
  const IsLoggedIn = ([...useSelector(state => state.IsLoggedIn)].map((data) => data.status))[0]
  const UserlnfoStored = ([...useSelector(state => state.UserlnfoStored)].map((data) => data.status))[0]

  useEffect(() => {
    localStorage.setItem('IsAdminLogged', JSON.stringify(IsAdminLogged));
    localStorage.setItem('IsLoggedIn', JSON.stringify(IsLoggedIn))
    localStorage.setItem('UserlnfoStored', JSON.stringify(UserlnfoStored))
  }, [IsAdminLogged, IsLoggedIn, UserlnfoStored])

  const createnotify = () => toast("Your System licence is about to expire Contact Poscloud to Purchase a new licence!", { position: "top-center", hideProgressBar: false, className: 'bg-warning text-white' });

  useEffect(() => {
    if (CHECKPAYMENTWARNINGTATUS === true) {
      createnotify()
      dispatch(CLOSEPAYMENTWARNING())
    }
  }, [CHECKPAYMENTWARNINGTATUS])

  return (
    <React.Fragment>
      <ToastContainer />
      {CHECKLOADERSTATUS &&
        < Modal modalClassName="zoomIn" tabIndex="-1" isOpen={CHECKLOADERSTATUS} centered style={{ width: "170px" }}>
          <ModalBody style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Spinner color="primary" /><div style={{ marginLeft: "10px", fontWeight: "700" }}>Loading...</div>
          </ModalBody>
        </Modal >
      }
      <Route />
    </React.Fragment>
  );
}

export default App;
