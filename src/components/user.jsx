import React, { useEffect, useState } from 'react';
import { CiUser } from 'react-icons/ci';
import { IoIosPhonePortrait } from 'react-icons/io';
import { FaRegCalendarAlt, FaTransgender } from 'react-icons/fa';
import { Link } from 'react-router-dom';


const getToken = () => {
    const token = localStorage.getItem('authToken');
    console.log('Token retrieved:', token);
    return token;
};


const getUserIdFromToken = () => {
    const token = getToken();
    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1])); 
            console.log('Decoded payload:', payload); 
            return payload._id; 
        } catch (error) {
            console.error('Error decoding token:', error);
        }
    }
    return null;
};


const fetchUserProfile = async (userId) => {
    if (!userId) {
        console.error('No user ID provided');
        return null;
    }

    try {
        const response = await fetch(`https://bakent-marketplace.onrender.com/users/user/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`,
            }
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            console.error('Server response error:', errorMessage);
            throw new Error(`Error en la solicitud: ${errorMessage}`);
        }

        const dataJson = await response.json();
        return dataJson;
    } catch (error) {
        console.error('Error al obtener el perfil del usuario:', error);
        return null;
    }
};

const updateUserProfile = async (userId, formData) => {
    try {
        const response = await fetch(`https://bakent-marketplace.onrender.com/users/updateusers/${userId}`, {
            method: 'PUT',
            body: formData,
            headers: {
                'Authorization': `Bearer ${getToken()}`,
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const dataJson = await response.json();
        return dataJson;
    } catch (error) {
        console.error('Error updating user profile:', error);
        return null;
    }
};

const deleteUserProfile = async (userId) => {
    try {
        const response = await fetch(`https://bakent-marketplace.onrender.com/users/deletedusers/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`,
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return true;
    } catch (error) {
        console.error('Error deleting user profile:', error);
        return false;
    }
};

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [alert, setAlert] = useState(null);
    const [roles] = useState(['Vendedor', 'Cliente']);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        const getUserProfile = async () => {
            setLoading(true);
            const userId = getUserIdFromToken();
            if (userId) {
                const profileData = await fetchUserProfile(userId);
                if (profileData) {
                    setUser(profileData);
                    setFormData({
                        username: profileData.username,
                        phoneNumber: profileData.phoneNumber,
                        fullName: profileData.fullName,
                        birthDate: profileData.birthDate,
                        gender: profileData.gender,
                        email: profileData.email,
                        password: '',
                        role: profileData.role,
                        profilePicture: profileData.profilePicture,
                        bio: profileData.bio
                    });
                } else {
                    setError('Error al obtener el perfil de usuario');
                }
            } else {
                setError('Error: Token inválido o usuario no encontrado');
            }
            setLoading(false);
        };

        getUserProfile();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        window.location.href = '/login';
    };

    const handleEditClick = () => {
        setEditing(true);
    };

    const handleCancelClick = () => {
        setEditing(false);
        setFormData({
            username: user.username,
            phoneNumber: user.phoneNumber,
            fullName: user.fullName,
            birthDate: user.birthDate,
            gender: user.gender,
            email: user.email,
            password: '',
            role: user.role,
            profilePicture: user.profilePicture,
            bio: user.bio
        });
        setSelectedFile(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = getUserIdFromToken();
        if (userId) {
            const formDataToSend = new FormData();
            formDataToSend.append('username', formData.username);
            formDataToSend.append('phoneNumber', formData.phoneNumber);
            formDataToSend.append('fullName', formData.fullName);
            formDataToSend.append('birthDate', formData.birthDate);
            formDataToSend.append('gender', formData.gender);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('password', formData.password);
            formDataToSend.append('role', formData.role);
            formDataToSend.append('bio', formData.bio);
            if (selectedFile) {
                formDataToSend.append('profilePicture', selectedFile);
            }

            try {
                const updatedUser = await updateUserProfile(userId, formDataToSend);
                if (updatedUser) {
                    setUser(updatedUser);
                    setAlert({ type: 'success', message: 'Perfil actualizado exitosamente' });
                    setEditing(false);
                } else {
                    setAlert({ type: 'error', message: 'Error al actualizar el perfil' });
                }
            } catch (error) {
                console.error('Error al actualizar el perfil:', error);
                setAlert({ type: 'error', message: 'Error al actualizar el perfil' });
            }
        }
    };

    const handleDelete = async () => {
        const userId = getUserIdFromToken();
        if (userId) {
            const isDeleted = await deleteUserProfile(userId);
            if (isDeleted) {
                setAlert({ type: 'success', message: 'Perfil eliminado exitosamente' });
                setUser(null); // Clear the user data after deletion
            } else {
                setAlert({ type: 'error', message: 'Error al eliminar el perfil de usuario' });
            }
        } else {
            setError('Error: Token inválido o usuario no encontrado');
        }
    };

    if (loading) {
        return <div className="text-center py-4 text-gray-500">Cargando...</div>;
    }

    if (error) {
        return <div className="text-center py-4 text-red-600">Error: {error}</div>;
    }

    if (!user) {
        return <div className="text-center py-4 text-gray-500">No hay datos de usuario disponibles</div>;
    }

    return (
        <div className=" max-w-xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden dark:bg-gray-800">
            <img
                className="object-cover object-center w-full h-56"
                src={user.profilePicture || '/default-profile.png'}
                alt={`${user.fullName}'s profile`}
            />
            <div className="px-6 py-4">
                {alert && (
                    <div className={`p-4 mb-4 text-white rounded-md ${alert.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                        {alert.message}
                    </div>
                )}
                {editing ? (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="username" className="block text-gray-700 dark:text-gray-300">Nombre de Usuario</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username || ''}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="phoneNumber" className="block text-gray-700 dark:text-gray-300">Número de Teléfono</label>
                            <input
                                type="tel"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={formData.phoneNumber || ''}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="birthDate" className="block text-gray-700 dark:text-gray-300">Fecha de Nacimiento</label>
                            <input
                                type="date"
                                id="birthDate"
                                name="birthDate"
                                value={formData.birthDate || ''}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="gender" className="block text-gray-700 dark:text-gray-300">Género</label>
                            <input
                                type="text"
                                id="gender"
                                name="gender"
                                value={formData.gender || ''}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700 dark:text-gray-300">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email || ''}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                disabled
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-gray-700 dark:text-gray-300">Contraseña</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password || ''}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="role" className="block text-gray-700 dark:text-gray-300">Rol</label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role || ''}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            >
                                {roles.map(role => (
                                    <option key={role} value={role}>{role}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="profilePicture" className="block text-gray-700 dark:text-gray-300">Imagen de Perfil</label>
                            <input
                                type="file"
                                id="profilePicture"
                                name="profilePicture"
                                onChange={handleFileChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="bio" className="block text-gray-700 dark:text-gray-300">Biografía</label>
                            <textarea
                                id="bio"
                                name="bio"
                                value={formData.bio || ''}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                        </div>
                        <div className="flex justify-between">
                            <button
                                type="button"
                                onClick={handleCancelClick}
                                className="bg-gray-500 text-white px-4 py-2 rounded"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Guardar Cambios
                            </button>
                        </div>
                    </form>
                ) : (
                    <div>
                        <div className="text-center py-4">
                            <img
                                className="w-24 h-24 rounded-full mx-auto"
                                src={user.profilePicture || '/default-profile.png'}
                                alt={`${user.fullName}'s profile`}
                            />
                            <h2 className="text-xl font-bold mt-2">{user.fullName}</h2>
                            <p className="text-gray-500">{user.email}</p>
                        </div>
                        <div className="px-6 py-4">
                            <div className="mb-4">
                                <CiUser className="inline-block mr-2" />
                                <span className="font-semibold">Nombre de Usuario:</span> {user.username}
                            </div>
                            <div className="mb-4">
                                <IoIosPhonePortrait className="inline-block mr-2" />
                                <span className="font-semibold">Número de Teléfono:</span> {user.phoneNumber}
                            </div>
                            <div className="mb-4">
                                <FaRegCalendarAlt className="inline-block mr-2" />
                                <span className="font-semibold">Fecha de Nacimiento:</span> {user.birthDate}
                            </div>
                            <div className="mb-4">
                                <FaTransgender className="inline-block mr-2" />
                                <span className="font-semibold">Género:</span> {user.gender}
                            </div>
                            <div className="mb-4">
                                <span className="font-semibold">Rol:</span> {user.role}
                            </div>
                            <div className="mb-4">
                                <span className="font-semibold">Biografía:</span> {user.bio}
                            </div>
                        </div>
                        <div className="py-4 flex justify-between">
                            <button
                                onClick={handleEditClick}
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Editar Perfil
                            </button>
                            <button
                                onClick={handleDelete}
                                className="bg-red-500 text-white px-4 py-2 rounded ml-5"
                            >
                                Eliminar Perfil
                            </button>

                            <Link to="/historial" className="bg-blue-500 text-white px-4 py-2 rounded ml-4">
                            Historial Compra
                            </Link>

                        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded ml-5">
                            Cerrar Sesión
                        </button>
                        {user.role === 'Vendedor' && (
                        <Link to="/crear-pro" className="bg-blue-500 text-white px-4 py-2 rounded ml-4">
                            Crear Producto
                        </Link>
                    )}
                        
                        </div>
                        
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
