// src/Formpages.jsx
import { Routes, Route } from "react-router-dom";
import Header from "./components/header";
import Footer from "./components/footer";
import Example from "./components/carrusel";
import Form from "./components/Form";
import Pago from "./components/pago";
import Cart from "./components/carrito";
import ProductList from "./components/products";
import Login from "./components/login/login";
import Aboaut from "./components/about";
import User from "./components/user";
import CrearProduct from "./components/crearproducto";
import ProductosUser from "./components/listadoproductos";
import Historial from "./components/historial";
import { useState } from "react";

const Formpages = () => {
  const [cartItems, setCartItems] = useState([]);

  return (
    <div>
      {/* Pasa cartItems y setCartItems al Header */}
      <Header cartItems={cartItems} setCartItems={setCartItems} />

      <Routes>
        <Route path="/form" element={<Form />} />
        <Route path="/products" element={<ProductList cartItems={cartItems} setCartItems={setCartItems} />} />
        <Route path="/about" element={<Aboaut />} />
        <Route path="/user" element={<User />} />
        <Route path="/crear-pro" element={<CrearProduct />} />
        <Route path="/lista-pro" element={<ProductosUser />} />
        <Route path="/historial" element={<Historial />} />
        <Route 
          path="/carrito" 
          element={<Cart cartItems={cartItems} setCartItems={setCartItems} />} 
        />
        <Route 
          path="/login" 
          element={
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              minHeight: '100vh' 
            }}>
              <Login />
            </div>
          } 
        />
        <Route 
          path="/" 
          element={
            <div>
              <Example />
              <div style={{ marginTop: "150px", marginLeft: "150px" }}></div>
              <ProductList cartItems={cartItems} setCartItems={setCartItems} />
            </div>
          }
        />
        <Route 
          path="/pago" 
          element={
            <div style={{ marginLeft: "510px", marginBottom: "40px" }}>
              <Pago />
            </div>
          } 
        />
      </Routes>

      <Footer />
    </div>
  );
};

export default Formpages;
