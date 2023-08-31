const OPEN_PAYMENTWARNING = 'OPEN_PAYMENTWARNING'
const CLOSE_PAYMENTWARNING = 'CLOSE_PAYMENTWARNING'

export function OPENPAYMENTWARNING(company) { return { type: OPEN_PAYMENTWARNING, company, } }

export function CLOSEPAYMENTWARNING(company) { return { type: CLOSE_PAYMENTWARNING, company } }

const DEFAULTPAYMENTWARNINGSTATUS = [{ status: (false) }]

function TOGGLEPAYMENTWARNING(state = DEFAULTPAYMENTWARNINGSTATUS, action) {
    switch (action.type) {
        case OPEN_PAYMENTWARNING:
            return [{ status: true }]
        case CLOSE_PAYMENTWARNING:
            return [{ status: false }];
        default:
            return state;
    }
}

export default TOGGLEPAYMENTWARNING;