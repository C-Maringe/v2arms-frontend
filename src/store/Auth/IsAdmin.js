const IS_ADMIN_LOGGED = 'IS_ADMIN_LOGGED'
const IS_ADMIN_LOGOUT = 'IS_ADMIN_LOGOUT'

export function IsAdminLogedIn(company) { return { type: IS_ADMIN_LOGGED, company, } }

export function IsAdminLogedOut(company) { return { type: IS_ADMIN_LOGOUT, company } }

const storedIsAdminLoggedIn = JSON.parse(localStorage.getItem('IsAdminLogged'))

const defaultstoredIsAdminLoggedIn = [{ status: (storedIsAdminLoggedIn === true ? true : false) }]

function IsAdminLogged(state = defaultstoredIsAdminLoggedIn, action) {
    switch (action.type) {
        case IS_ADMIN_LOGGED:
            return [{ status: true }]
        case IS_ADMIN_LOGOUT:
            return [{ status: false }];
        default:
            return state;
    }
}

export default IsAdminLogged;