import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = '$';
    const delivery_fee = 10;
    const navigate = useNavigate();
    const [cartItems,setCartItems] =useState([]);

    const addToCart = async (itemId)=>{

        let cartData = cartItems;
        if(cartData.includes(itemId)){
            toast.error('Item Already in Cart')
        }
        else{
            setCartItems((prevCart) => [...prevCart, itemId]); 
            toast.success('Item Added to Cart');
        }
    }
    const getCartCount = ()=>{
        console.log(cartItems.length);
        
        return cartItems.length;
    }


    const value = {
        currency, delivery_fee, navigate, addToCart, getCartCount
    }
    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider