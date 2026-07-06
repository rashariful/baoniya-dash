import { useEffect } from "react";
import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

const storedCartItems = JSON.parse(localStorage.getItem("cartItems"));
const storedTotal = parseFloat(localStorage.getItem("total"));

const initialState = {
    products: storedCartItems ? storedCartItems : [],
    total: storedTotal ? storedTotal : 0
}

const  cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart:((state, action)=>{
            const isExistProducts = state.products.find(product => product._id === action.payload._id)
            
            if (isExistProducts) {
               isExistProducts.quantity = isExistProducts.quantity + 1
            } else {
                
                state.products.push({...action.payload, quantity: 1})
            }

            state.total += action.payload.price
            localStorage.setItem("total", state.total.toString());
        }),
        removeFromCart: (state,action )=>{
            state.products = state.products.filter(product => product._id !== action.payload._id)
            state.total -= action.payload.price * action.payload.quantity
            localStorage.setItem("total", state.total.toString());
        },
        removeOne: (state, action )=>{
            const isExistProducts = state.products.find(product => product._id === action.payload._id)

            if(isExistProducts && isExistProducts.quantity > 1){
                isExistProducts.quantity = isExistProducts.quantity - 1
            }else{
                state.products = state.products.filter(product => product._id !== action.payload._id)
            }
            state.total -= action.payload.price
            localStorage.setItem("total", state.total.toString());
        },

        clearCart(state,) {
            state.items = [];
          },
        
    },
    
})

const CartComponent = () => {
    const cartItems = useSelector((state) => state.cart.products);
  
    // Store the cart items in the local storage whenever they change
    useEffect(() => {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
     
    }, [cartItems,]);

   
  
    // rest of your component code...
  };

export const {addToCart,removeFromCart,removeOne, clearCart} = cartSlice.actions
export default cartSlice.reducer