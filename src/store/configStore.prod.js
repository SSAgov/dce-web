import {createStore, applyMiddleware} from 'redux';
import rootReducer from '../reducers';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
// import saga from 'redux-saga';

// const sagaMiddleware = saga();

export default function configureStore(initialState) {
    return createStore(
        rootReducer, 
        initialState,
        applyMiddleware(thunk, promise)
    );  
    
    // const store = createStore(
    //     rootReducer, 
    //     initialState,
    //     applyMiddleware(sagaMiddleware)
    // );

    // // Create hook for async sagas
    // store.runSaga = sagaMiddleware.run;
    // store.asyncSagas = {};


    // // Initialize it with no other reducers
    // store.asyncReducers = {};
    // return store;

}