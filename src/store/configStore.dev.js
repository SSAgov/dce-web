import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from '../reducers';
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';
import thunk from 'redux-thunk';
import promise from 'redux-promise';

const devtools = window.devToolsExtension || (() => noop => noop);

export default function configureStore(initialState) {
    const enhancers = [
        applyMiddleware(thunk, promise, reduxImmutableStateInvariant()),
        devtools()
    ];

    return createStore(
        rootReducer,
        initialState,
        compose(...enhancers)
    );

    //     const store = createStore(
    //         rootReducer, 
    //         initialState,
    //         applyMiddleware(thunk, reduxImmutableStateInvariant())
    //     );

    //     // Create hook for async sagas
    //     store.runSaga = sagaMiddleware.run;
    //     store.asyncSagas = {};

    // //       // Make reducers hot reloadable, see http://mxs.is/googmo
    // //   /* istanbul ignore next */
    // //   if (module.hot) {
    // //     System.import('./reducers').then((reducerModule) => {
    // //       const createReducers = reducerModule.default;
    // //       const nextReducers = createReducers(store.asyncReducers);

    // //       store.replaceReducer(nextReducers);
    // //     });
    // //   }


    //     // Initialize it with no other reducers
    //     store.asyncReducers = {};
    //     return store;

}