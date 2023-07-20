import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    items: []
}

const foodCartSlice = createSlice({
    name: 'foodCart',
    initialState,
    reducers: {
        addItemToFoodCart: (state, action) => {
            const item = action.payload;
            console.log(item);
            let items = [];
            const isFound = state.items.find(i => (i.menuId === item.menuId && i.categoryId === item.categoryId && i.mealName.toLowerCase() === item.mealName.toLowerCase()));

            if(isFound) {
                items = state.items.map(i => {
                    if(i.menuId === item.menuId && i.categoryId === item.categoryId && item.mealName.toLowerCase() === i.mealName.toLowerCase()) {
                        // found the food already in the cart, so update
                        return {
                            ...i,
                            quantity: i.quantity + item.quantity
                        }
                    }
                    return i;
                })
            } else {
                items = [...state.items, item];
            }
            return {...state, items};
        },
        removeItemFromFoodCart: (state, action) => {
            const {menuId, categoryId, mealName} = action.payload;

            let items = state.items.filter(i => !(i.menuId === menuId && i.categoryId === categoryId && i.mealName.toLowerCase() === mealName.toLowerCase()));
            return {...state, items};
        },
        clearCart: (state, action) => {
            return {...state, items: []}
        }
    }
});


export const {addItemToFoodCart, removeItemFromFoodCart, clearCart} = foodCartSlice.actions;

export default foodCartSlice.reducer;


