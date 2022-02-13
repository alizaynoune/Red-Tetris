import {
    INVITE_REQUEST,
    INVITE_FAILURE,
    INVITE_ACCEPT,
    INVITE_DECLINE,
    INVITE_REMOVE_ALL,
    LOADING_INVITES,
    INVITE_REFRESH,
    INVITE_SUCCESS
} from '../types';

const initialState = {
    isLoading: false,
    error: null,
    // room_id: null,
    invites: [],
}

const newInvite = (state, action) => {
    const fackStatus = ['accepted', 'declined', 'waiting'];
    const fackStatusIndex = Math.floor(Math.random() * fackStatus.length);
    const data = {
        userId: action.payload.userId,
        userName: action.payload.userName,
        status: fackStatus[fackStatusIndex], // waiting, accepted, declined
    };
    const index = state.invites.findIndex(invite => invite.userId === data.userId);
    if (index === -1) {
        state.invites.unshift(data);
        return {
            ...state,
            error: null,
            isLoading: false,
            // room_id: action.payload.roomId,
        }
    } else {
        return {
            ...state,
            error: `${data.userName} is already invited`,
            isLoading: false,
        }
    }
}

const accept = (state, action) => {
    const newInvites = state.invites.map(invite => {
        if (invite.id === action.payload.id) {
            invite.status = 'accepted';
        }
        return invite;
    });
    const data = {
        ...state,
        error: null,
        isLoading: false,
        invites: newInvites,
    }
    return data;
}

const decline = (state, action) => {
    const newInvites = state.invites.map(invite => {
        if (invite.id === action.payload.id) {
            invite.status = 'declined';
        }
        return invite;
    });
    const data = {
        ...state,
        error: null,
        isLoading: false,
        invites: newInvites,
    }
    return data;
}

const removeAll = (state) => {
    const data = {
        ...state,
        invites: [],
    }
    return data;
}

export default function inviteReducer(state = initialState, action) {
    switch (action.type) {
        case LOADING_INVITES:
            return {
                ...state,
                error: null,
                isLoading: true,
            }
        case INVITE_SUCCESS:
            return {
                ...state,
                error: null,
                isLoading: false,
            };
        case INVITE_REQUEST:
            return {
                ...state,
                isLoading: false,
                error: null,
                invites: action.payload,
            };
        case INVITE_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case INVITE_ACCEPT:
            return {
                ...state,
                isLoading: false,
                error: null,
            };
        case INVITE_DECLINE:
            return {
                ...state,
                isLoading: false,
                error: null,
            };
        case INVITE_REMOVE_ALL:
            return removeAll(state);
        default:
            return state;
    }
}