import { combineReducers } from "redux";
import TOGGLELOADER from "./Loader/OpenLoader";
import TOGGLEPAYMENTWARNING from "./Loader/PaymentWarning";
import IsAdminLogged from "./Auth/IsAdmin";
import IsLoggedIn from "./Auth/Islogged";
import UserlnfoStored from "./Auth/UserInfoStored";
import Layout from "./layouts/reducer";
import IsTableLoadingStore from "./Auth/tableloadingStore";

const rootReducer = combineReducers({
    Layout, TOGGLELOADER, IsAdminLogged, IsLoggedIn, UserlnfoStored, IsTableLoadingStore, TOGGLEPAYMENTWARNING
});

export default rootReducer;