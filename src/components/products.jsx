import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const ProductList = ({ cartItems, setCartItems }) => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState({});
    const [selectedCategory, setSelectedCategory] = useState('');
    const { categoryId } = useParams(); // Obtén el categoryId de la URL

    useEffect(() => {
        console.log(products); // Esto imprimirá el array de productos en la consola
    }, [products]);

    const fetchProducts = async (categoryId) => {
        try {
            const response = await fetch('https://bakent-marketplace.onrender.com/apiproduct/products' + (categoryId ? `?categoryId=${categoryId}` : ''), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const dataJson = await response.json();
            return dataJson;
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch('https://bakent-marketplace.onrender.com/apicategory/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const dataJson = await response.json();
            const categoriesById = dataJson.reduce((acc, category) => {
                acc[category._id] = category.name;
                return acc;
            }, {});
            setCategories(categoriesById);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        const loadProducts = async () => {
            const data = await fetchProducts(selectedCategory); // Usa selectedCategory en lugar de categoryId
            setProducts(data);
        };

        loadProducts();
    }, [selectedCategory]); // Dependencia de selectedCategory para actualizar los productos al cambiar la categoría

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAddToCart = (product) => {
        const existingProduct = cartItems.find(item => item.product._id === product._id);

        if (existingProduct) {
            setCartItems(cartItems.map(item =>
                item.product._id === product._id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCartItems([...cartItems, { product: product, quantity: 1 }]);
        }
    };

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value); // Actualiza la categoría seleccionada
    };

    return (
        <div className="relative">
            <main className="flex-1 mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                <h2 className="text-2xl mb-10 font-bold tracking-tight text-gray-900">
                    Productos: {categories[selectedCategory] || 'Todos los productos'}
                </h2>

                <div className="mb-4">
                    <label htmlFor="category-select" className="block text-sm font-medium text-gray-700">Filtrar por categoría</label>
                    <select
                        id="category-select"
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                        <option value="">Todas las categorías</option>
                        {Object.entries(categories).map(([id, name]) => (
                            <option key={id} value={id}>{name}</option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                    {products.map((product) => (
                        <div key={product._id} className="group">
                            <div className="relative w-full h-64 overflow-hidden rounded-lg bg-gray-200">
                                <img
                                    alt={product.name}
                                    src={product.productImage}
                                    className="object-cover object-center w-full h-full"
                                />
                            </div>
                            <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
                            <p className="mt-1 text-lg font-medium text-gray-900">${product.price.toFixed(2)}</p>
                            <p className="mt-1 text-sm text-gray-500">{product.description}</p>
                            {product.category && (
                                <p className="mt-1 text-sm text-gray-500">
                                    Categoría: {categories[product.category] || product.category}
                                </p>
                            )}
                            {product.reviews && product.reviews.length > 0 && (
                                <div className="mt-2">
                                    <h4 className="text-sm font-medium text-gray-700">Reseñas:</h4>
                                    <ul className="list-disc pl-5">
                                        {product.reviews.map((review, index) => (
                                            <li key={index} className="text-sm text-gray-600">{review.content}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <button
                                onClick={() => handleAddToCart(product)}
                                className="mt-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md"
                            >
                                Agregar al Carrito
                            </button>
                        </div>
                    ))}
                </div>

                <div className='mt-20'>
                    <Link
                        to="/carrito"
                        className="mt-5 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md"
                    >
                        Ir al Carrito
                    </Link>
                </div>
            </main>
        </div>
    );
};

export default ProductList;

