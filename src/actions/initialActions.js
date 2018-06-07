import * as types from './actionTypes';
import { stringify } from 'querystring';
//import { beginAjaxCall, ajaxCallError } from './ajaxStatusActions';

export function getEnvironmentSuccess(environment) {
    return { type: types.GET_ENVIRONMENT_SUCCESS, environment }
}

export function getEnvironmentErrored(bool) {
    return { type: types.GET_ENVIRONMENT_ERRORED, hasErrored: bool }
}

export function getFetchTargetSuccess(fetchTarget) {
    return { type: types.GET_FETCHTARGET_SUCCESS, fetchTarget }
}

export function getFetchTargetErrored(bool) {
    return { type: types.GET_FETCHTARGET_ERRORED, hasErrored: bool }
}
export function getInitialConvertDropdownDataSuccess(convertDropdownData) {
    return { type: types.GET_INITIAL_CONVERT_DROPDOWN_DATA_SUCCESS, convertDropdownData }
}

export function getInitialConvertDropdownDataErrored(bool) {
    return { type: types.GET_INITIAL_CONVERT_DROPDOWN_DATA_ERRORED, hasErrored: bool }
}


export function errorAfterFiveSeconds() {
    // We return a function instead of an action object
    return (dispatch) => {
        setTimeout(() => {
            // This function is able to dispatch other action creators
            dispatch(getEnvironmentErrored(true));
        }, 5000);
    };
}


export function getFetchTarget() {
    try {
        const winLocation = window.location.href.toLowerCase(),
            DCEindex = winLocation.lastIndexOf("dce"),
            prependTarget = winLocation.substring(0, DCEindex);
        var fetchTarget = '';


        if (winLocation.includes('localhost:3000')) {
            fetchTarget = 'http://localhost:5000/';
        }
        else if (winLocation === 'http://localhost/dce/ui/') {
            fetchTarget = 'http://localhost/DCE/Api/';
        }
        else {
            fetchTarget = prependTarget + 'dce/api/';
        }
        return fetchTarget;
    }
    catch (err) {
        console.log("getFETCHTARGETERR::", err)
        getFetchTargetErrored(true);
    }
}

export async function dispatchFetchTarget() {
    let fetchTarget = await getFetchTarget();
    return dispatch => {
        dispatch(getFetchTargetSuccess(fetchTarget));
    }
}

//thunk
export function getInitialConvertDropdownData() {
    return dispatch => {
        fetch(getFetchTarget() + "Configuration/ConvertSettings", {
            method: 'GET',
            // mode: 'cors',
            credentials: 'include',
        }).then(response => {
            if (!response.ok) {
                console.log('getCONVERTDROPDOWNSERRORED', stringify(response));
                throw Error(response.statusText);
            }
            console.log('getCONVERTDROPDOWNS', stringify(response));
            return response;
        }).then(response => response.json())
            .then((convertDropdownData) => {
                console.log(convertDropdownData)
                dispatch(getInitialConvertDropdownDataSuccess(convertDropdownData))

                var filteredJsonforDropdowns = convertDropdownData.Configuration.filter(
                (dropdownName) => { return dropdownName.Setting === "CurrentEnvironment" });
                dispatch(getEnvironmentSuccess(filteredJsonforDropdowns[0].Values[0]))
            })
            .catch((err) => {
                console.log("getCONVERTDROPDOWNSCATCHERROR::", err);
                dispatch(getInitialConvertDropdownDataErrored(true))
            })
    }
}

