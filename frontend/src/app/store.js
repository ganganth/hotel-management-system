import {configureStore} from '@reduxjs/toolkit';

import authReducer from './auth/authSlice';
import foodCartReducer from './foodCart/foodCartSlice';
import eventCartReducer from './eventCart/eventSlice';


const store = configureStore({
    reducer: {
        auth: authReducer,
        foodCart: foodCartReducer,
        eventCart: eventCartReducer
    },
    devTools: true
})

export default store;