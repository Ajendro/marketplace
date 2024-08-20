import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Asegúrate de importar Link de react-router-dom

// Función para obtener el token del almacenamiento local
const getToken = () => {
  return localStorage.getItem('authToken');
};

// Función para obtener el ID del usuario a partir del token
const getUserIdFromToken = () => {
  const token = getToken();
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload._id;
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }
  return null;
};

const CreateProduct = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [productImage, setProductImage] = useState(null); // Estado para la imagen
  const [categories, setCategories] = useState([]);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    // Fetch categories from the backend
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://bakent-marketplace.onrender.com/apicategory/categories', {
          method: 'POST', // Cambia a GET para obtener las categorías
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`, // Si se requiere autenticación
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    setProductImage(e.target.files[0]); // Guarda el archivo en el estado
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = getUserIdFromToken(); // Obtén el ID del usuario del token

    if (userId) {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('category', category);
      formData.append('userId', userId); // Agrega el ID del usuario al FormData
      if (productImage) {
        formData.append('productImage', productImage); // Agrega la imagen al FormData
      }

      try {
        const response = await fetch('https://bakent-marketplace.onrender.com/apiproduct/productscreate', {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${getToken()}`, // Incluye el token en los headers
          },
        });

        if (!response.ok) {
          throw new Error('Error creating product.');
        }

        setName('');
        setDescription('');
        setPrice('');
        setCategory('');
        setProductImage(null); // Limpia el estado de la imagen
        setAlert({ type: 'success', message: 'Product created successfully!' });
      } catch (error) {
        console.error('Error:', error);
        setAlert({ type: 'error', message: 'Failed to create product.' });
      }
    } else {
      setAlert({ type: 'error', message: 'Failed to get user ID.' });
    }
  };

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="container px-6 py-10 mx-auto" style={{ maxWidth: '1600px' }}>
        <div className="lg:-mx-6 lg:flex lg:items-center">
          <div className="lg:w-1/2 lg:mx-6 w-full h-96 rounded-lg lg:h-[36rem]">
            <img
              className="object-cover object-center w-full h-full rounded-lg"
              src="https://images.unsplash.com/photo-1499470932971-a90681ce8530?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
              alt="Product"
            />
          </div>

          <div className="mt-8 lg:w-1/2 lg:px-6 lg:mt-0">
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white lg:text-3xl lg:w-96">
              Create a New Product
            </h1>

            {alert && (
              <div className={`p-4 mb-4 text-white rounded-md ${alert.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                {alert.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6">
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Product Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Price
                </label>
                <input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))
                  ) : (
                    <option value="">No categories available</option>
                  )}
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="productImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Imagen del  Producto
                </label>
                <input
                  id="productImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-1 block w-full text-sm text-gray-500 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-md file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 bg-blue-500 border border-transparent rounded-md shadow-sm text-white font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Crear Productos
                </button>

                <Link to="/lista-pro" className="inline-flex items-center px-4 py-2 bg-gray-500 border border-transparent rounded-md shadow-sm text-white font-medium hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                  Ver Productos
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreateProduct;

