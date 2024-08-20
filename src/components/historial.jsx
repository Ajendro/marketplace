import React, { useState, useEffect } from 'react';

// Función para obtener el ID del usuario a partir del token
const getUserIdFromToken = () => {
    const token = localStorage.getItem('authToken');
    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload._id; // Asegúrate de que el token tenga la propiedad _id
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    }
    return null;
};

const CartTable = () => {
    const [carts, setCarts] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Función para obtener los detalles de los productos
    const fetchProducts = async (productIds) => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch('https://bakent-marketplace.onrender.com/apiproduct/products', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ids: productIds }), // Enviar los IDs de los productos
            });

            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }

            const data = await response.json();
            setProducts(data);
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        const fetchCarts = async () => {
            const userId = getUserIdFromToken();
            if (!userId) {
                setError('User ID not found or token invalid');
                setLoading(false);
                return;
            }
    
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    throw new Error('No authentication token found');
                }
    
                const response = await fetch('https://bakent-marketplace.onrender.com/apishoppingCart/carts', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId }), // Enviar el ID del usuario
                });
    
                if (!response.ok) {
                    throw new Error(`Este Usuario no tiene productos comprados: ${response.statusText}`);
                }
    
                const data = await response.json();
    
                if (!Array.isArray(data)) {
                    throw new Error('Invalid data format from server');
                }
    
                setCarts(data);
    
                // Obtener todos los IDs de productos de los carritos
                const productIds = data.flatMap(cart => cart.products.map(p => p.product));
                await fetchProducts([...new Set(productIds)]); // Fetch unique product IDs
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
    
        fetchCarts();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    // Función para obtener el nombre del producto a partir del ID
    const getProductName = (id) => {
        const product = products.find(p => p._id === id);
        return product ? product.name : 'Unknown';
    };

    return (
        <section className="container px-4 mx-auto mt-10 mb-10">
            <div className="flex items-center gap-x-3">
                <h2 className="text-lg font-medium text-gray-800 dark:text-white">Historial de Compras</h2>
                <span className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400">
                    {carts.length} carritos
                </span>
            </div>

            <div className="flex flex-col mt-6">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-800">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID del Carrito</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Creado en</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Productos</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                                    {carts.length > 0 ? (
                                        carts.map((cart) => (
                                            <tr key={cart._id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{cart._id || 'N/A'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                                    {cart.createdAt ? new Date(cart.createdAt).toLocaleDateString() : 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                                    ${cart.total.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                                    {cart.products.map((product) => (
                                                        <div key={product._id}>
                                                            {getProductName(product.product)} - Cantidad: {product.quantity}
                                                        </div>
                                                    ))}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-300">
                                                No hay carritos disponibles
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CartTable;
