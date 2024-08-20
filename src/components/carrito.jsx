import React from 'react';
import { useNavigate } from 'react-router-dom';

const Cart = ({ cartItems, setCartItems }) => {
  const navigate = useNavigate();

  // Función para obtener el ID del usuario desde el token
  const getUserIdFromToken = () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload._id) {
          return payload._id;
        } else {
          console.error('ID de usuario no encontrado en el token.');
          return null;
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  };

  // Función para manejar la eliminación de un producto del carrito
  const handleRemove = (productId) => {
    setCartItems(cartItems.filter(item => item.product._id !== productId));
  };

  // Función para aumentar la cantidad de un producto en el carrito
  const handleIncreaseQuantity = (productId) => {
    setCartItems(cartItems.map(item =>
      item.product._id === productId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    ));
  };

  // Función para disminuir la cantidad de un producto en el carrito
  const handleDecreaseQuantity = (productId) => {
    setCartItems(cartItems.map(item =>
      item.product._id === productId
        ? { ...item, quantity: item.quantity - 1 }
        : item
    ).filter(item => item.quantity > 0));
  };

  // Calcular el total del carrito
  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Función para manejar el proceso de pago
  const handleCheckout = async () => {
    const userId = getUserIdFromToken(); // Obtener el ID del usuario desde el token

    if (!userId) {
      console.error('No se encontró el ID del usuario.');
      return;
    }

    try {
      const response = await fetch('https://bakent-marketplace.onrender.com/apishoppingCart/shoppingCarts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: userId, cartItems, total }), // Enviar el ID del usuario en el cuerpo
      });

      if (!response.ok) {
        throw new Error('Error en la solicitud de pago.');
      }

      navigate('/pago'); // Redirigir a la página de pago
    } catch (error) {
      console.error('Error al enviar el carrito:', error);
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg max-w-md mx-auto mt-10 mb-10">
      <h2 className="text-xl font-bold mb-4">Carrito</h2>
      <ul className="mb-4">
        {cartItems.length === 0 ? (
          <li className="text-center">El carrito está vacío.</li>
        ) : (
          cartItems.map(item => (
            <li key={item.product._id} className="flex items-center justify-between mb-2 border-b pb-2">
              <img 
                src={item.product.productImage}
                alt={item.product.name}
                className="w-16 h-16 object-cover mr-4 rounded-md"
              />
              <div className="flex-grow">
                <span className="block text-sm">{item.product.name} - ${item.product.price.toFixed(2)}</span>
                <div className="flex items-center mt-1">
                  <button
                    onClick={() => handleDecreaseQuantity(item.product._id)}
                    className="px-2 py-1 text-sm text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-l-md"
                  >
                    -
                  </button>
                  <span className="px-4">{item.quantity}</span>
                  <button
                    onClick={() => handleIncreaseQuantity(item.product._id)}
                    className="px-2 py-1 text-sm text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-r-md"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={() => handleRemove(item.product._id)}
                className="ml-4 text-red-500 hover:text-red-700"
              >
                Eliminar
              </button>
            </li>
          ))
        )}
      </ul>
      <div className="flex justify-between items-center mb-4">
        <span className="font-bold">Total:</span>
        <span className="font-bold">${total.toFixed(2)}</span>
      </div>
      <button
        onClick={handleCheckout}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md"
      >
        Pagar
      </button>
    </div>
  );
};

export default Cart;
