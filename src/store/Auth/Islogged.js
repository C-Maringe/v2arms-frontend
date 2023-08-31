import { useSelector } from "react-redux";

const USER_LOGGED_IN = 'USER_LOGGED_IN'
const USER_LOGGED_OUT = 'USER_LOGGED_OUT'

export function IsloggedInTRIGGER(company) { return { type: USER_LOGGED_IN, company, } }

export function Islogged0utTRIGGER(company) { return { type: USER_LOGGED_OUT, company } }

const storedIsLoggedIn = JSON.parse(localStorage.getItem('IsLoggedIn'))

const defaultstoredIsLoggedIn = [{ status: (storedIsLoggedIn === true ? true : false) }]

function IsLoggedIn(state = defaultstoredIsLoggedIn, action) {
    switch (action.type) {
        case USER_LOGGED_IN:
            return [{ status: true }]
        case USER_LOGGED_OUT:
            return [{ status: false }];
        default:
            return state;
    }
}

export default IsLoggedIn;