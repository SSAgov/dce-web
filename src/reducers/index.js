import { combineReducers } from 'redux';
import ajaxCallsInProgress from './ajaxStatusReducer';
import { environmentReducer, fetchTargetReducer, initialConvertDropDownDataReducer } from './initialReducer';
import { mapConvertDropDownsReducer } from './convertReducer';

const rootReducer = combineReducers({
    environment: environmentReducer,
    fetchTarget: fetchTargetReducer,
    convertDropDownData: initialConvertDropDownDataReducer,
    convertDropDownFunc: mapConvertDropDownsReducer,
    ajaxCallsInProgress
});


export default rootReducer;