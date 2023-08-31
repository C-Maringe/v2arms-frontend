const USER_INFO_STORED = 'USER_INFO_STORED'

export function UserInfoKeep(company) {
    return {
        type: USER_INFO_STORED,
        company,
    }
}

const UserlnfoStoredLocally = JSON.parse(localStorage.getItem('UserlnfoStored'))

const defaultcompanystatus = [{
    status: UserlnfoStoredLocally === null ? {
        administrator: "", cards: "", status: "", company: "", description: "", token: "", vehicles: [], customer: { cards: [] },
        model: { other_accounts: [] }, pageable: { total_elements: 0 }
    } : UserlnfoStoredLocally
}]

function UserlnfoStored(state = defaultcompanystatus, action) {
    switch (action.type) {
        case USER_INFO_STORED:
            return [{ status: action.payload }]
        default:
            return state;
    }
}

export default UserlnfoStored;
