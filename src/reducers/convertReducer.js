import * as types from '../actions/actionTypes';
import initialState from './initialState';

export function mapConvertDropDownsReducer(state = initialState.initialConvertDropdownData, action) {
    switch(action.type) {
        case types.MAP_CONVERTDROPDOWNS_SUCCESS:
        console.log("REDUCER::MAPPEDDROPDOWNDATA::SUCCESS");
        return action.filterJsonData;
        

        default:
        return state;
    }
}