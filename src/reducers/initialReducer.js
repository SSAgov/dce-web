import * as types from '../actions/actionTypes';
import initialState from './initialState';

export function environmentReducer(state = initialState.environment, action) {
    switch(action.type) {
        case types.GET_ENVIRONMENT_SUCCESS:
        console.log("REDUCER::ENV::SUCCESS");
        return Object.assign({}, state, {
            lifecycle: action.environment
        })
             
        //return action.environment;

        case types.GET_ENVIRONMENT_ERRORED:
        console.log("REDUCER::ENV::ERRORED");
        return state;

        default:
        return state;
    }
}

export function fetchTargetReducer(state = initialState.fetchTarget, action) {
    switch(action.type) {
        case types.GET_FETCHTARGET_SUCCESS:
        console.log("REDUCER::FETCHTARGET::SUCCESS");
        return action.fetchTarget;
        

        default:
        return state;
    }
}

export function initialConvertDropDownDataReducer(state = initialState.initialConvertDropdownData, action) {
    switch(action.type) {
        case types.GET_INITIAL_CONVERT_DROPDOWN_DATA_SUCCESS:
        console.log("REDUCER::INITIALCONVERTDROPDOWN::SUCCESS");
        return Object.assign({}, ...state, action.convertDropdownData)

        case types.GET_INITIAL_CONVERT_DROPDOWN_DATA_ERRORED:
        console.log("REDUCER::INITIALCONVERTDROPDOWN::ERROR");
        return state;

        default:
        return state;
    }
}

