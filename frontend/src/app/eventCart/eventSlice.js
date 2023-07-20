import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    items: []
}

const eventCartSlice = createSlice({
    name: 'eventCart',
    initialState,
    reducers: {
        addEventToCart: (state, action) => {
            const found = state.items.find(item => item.id === action.payload.id);
            if(found) {
                state.items = state.items.map((e) => {
                    if(e.id === action.payload.id) {
                        return action.payload;
                    }
                    return e;
                })
            } else {
                state.items = [...state.items, action.payload]
            }
        },
        removeEventFromCart: (state, action) => {
            state.items = state.items.filter(e => e.id !== action.payload.id);
        },
        resetCart: (state, action) => {
            state.items = [];
        }
    }
});


export const {addEventToCart, removeEventFromCart, resetCart} = eventCartSlice.actions;

export default eventCartSlice.reducer;