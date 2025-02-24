import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Buy from "./pages/Buy";
import Sell from "./pages/Sell";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Login from "./pages/Login";
import Product from "./pages/Product";
import { useEffect } from "react";

function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page on route change
  }, [location.pathname]);
  return (
    <div >
      <ToastContainer/>
        <Navbar/>
      <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
        <Routes >
          <Route path="/" element={<Home />} />
          <Route path="/buy" element={<Buy />} />
          <Route path="/sell" element={<Sell />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/cart" element={<About />} />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/login" element={<Login />} />
        </Routes>
        <Footer/>
      </div>
    </div>
  );
}

export default App;
