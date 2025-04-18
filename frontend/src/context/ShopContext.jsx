import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currency = '$';
    const delivery_fee = 10;
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]); // Now just array of phone IDs
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const [token, setToken] = useState(localStorage.getItem("token") || null);

    useEffect(() => {
        if (token) {
            fetchCartItems();
        } else {
            const guestCart = localStorage.getItem('guestCart');
            if (guestCart) {
                setCartItems(JSON.parse(guestCart));
            }
        }
    }, [token]);

    const fetchCartItems = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/cart`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCartItems(response.data.cartItems.map(item => item.id) || []);
        } catch (error) {
            console.error("Failed to fetch cart items:", error);
        }
    };

    const addToCart = async (phoneId) => {
        try {
            if (cartItems.includes(phoneId)) {
                toast.error('This phone is already in your cart');
                return;
            }

            // Optimistic update
            setCartItems(prev => [...prev, phoneId]);

            if (token) {
                await axios.post(
                    `${backendUrl}/api/cart/add`,
                    { phoneId },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } else {
                localStorage.setItem('guestCart', JSON.stringify([...cartItems, phoneId]));
            }

            toast.success('Phone added to cart');
        } catch (error) {
            if (error.response?.data?.message === 'Phone already in cart') {
                toast.error('This phone is already in your cart');
            } else {
                toast.error('Failed to add to cart');
                console.error("Error:", error);
            }
            fetchCartItems(); // Revert on error
        }
    };

    const removeFromCart = async (phoneId) => {
        try {
            setCartItems(prev => prev.filter(id => id !== phoneId));

            if (token) {
                await axios.post(
                    `${backendUrl}/api/cart/remove`,
                    { phoneId },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } else {
                localStorage.setItem('guestCart', JSON.stringify(cartItems.filter(id => id !== phoneId)));
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error('Failed to remove from cart');
            fetchCartItems(); // Revert on error
        }
    };

    const getCartCount = () => cartItems.length;

    const getCartTotal = async () => {
        try {
            if (token) {
                const response = await axios.get(`${backendUrl}/api/cart/total`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                return response.data.total;
            }
            // For guest users - would need to fetch prices
            return 0;
        } catch (error) {
            console.error("Error:", error);
            return 0;
        }
    };

    const clearCart = async () => {
        try {
            setCartItems([]);
            if (token) {
                await axios.delete(`${backendUrl}/api/cart/clear`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                localStorage.removeItem('guestCart');
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem('guestCart');
        setToken(null);
        setCartItems([]);
        navigate('/login');
    };

    const value = {
        currency,
        delivery_fee,
        navigate,
        addToCart,
        removeFromCart,
        getCartCount,
        getCartTotal,
        clearCart,
        token,
        setToken,
        backendUrl,
        logout,
        cartItems,
        setCartItems
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;