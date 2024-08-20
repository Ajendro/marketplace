import React, { useState, useEffect } from 'react';

// Función para obtener el token JWT desde localStorage
const getToken = () => {
    const token = localStorage.getItem('authToken');
    console.log('Token retrieved:', token);
    return token;
};

// Función para decodificar el token y obtener el ID de usuario (_id)
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

const FormularioPago = () => {
  const [metodoPago, setMetodoPago] = useState('');
  const [datosFormulario, setDatosFormulario] = useState({
      email: '',
      numeroTarjeta: '',
      vencimiento: '',
      cvc: '',
      nombre: '',
      direccion: '',
      codigoPostal: '',
      nombrePropietario: '',
      userId: '',
      paymentMethodType: '', // Asegúrate de que este campo esté en el estado
  });

  // Hook useEffect para configurar el userId cuando el componente se monta
  useEffect(() => {
      const userId = getUserIdFromToken(); // Obtener el userId del token
      console.log('User ID from token:', userId); // Log para verificar el userId
      if (userId) {
          setDatosFormulario(prevDatos => ({
              ...prevDatos,
              userId: userId // Establecer el userId en el estado del formulario
          }));
      }
  }, []);

  const manejarCambio = (e) => {
      const { id, value } = e.target;
      setDatosFormulario(prevDatos => ({
          ...prevDatos,
          [id]: value
      }));
  };

  const manejarCambioMetodoPago = (e) => {
      const { value } = e.target;
      setMetodoPago(value);
      setDatosFormulario(prevDatos => ({
          ...prevDatos,
          paymentMethodType: value, // Actualiza el estado con el nuevo tipo de método de pago
          email: '' // Limpiar el campo de correo electrónico para PayPal
      }));
  };

  const manejarEnvio = async (e) => {
      e.preventDefault();
  
      console.log('Datos del formulario:', datosFormulario);
  
      try {
          const respuesta = await fetch('https://bakent-marketplace.onrender.com/apipaymethod/paymentMethodscreate', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                  userId: datosFormulario.userId,
                  cardNumber: datosFormulario.numeroTarjeta,
                  expiry: datosFormulario.vencimiento,
                  cvc: datosFormulario.cvc,
                  name: datosFormulario.nombre,
                  address: datosFormulario.direccion,
                  zip: datosFormulario.codigoPostal,
                  ownerName: datosFormulario.nombrePropietario || '', // Asegúrate de que ownerName siempre esté presente
                  email: datosFormulario.email,
                  paymentMethodType: datosFormulario.paymentMethodType, // Asegúrate de que paymentMethodType esté presente
              })
          });
  
          if (!respuesta.ok) {
              throw new Error(`¡Error HTTP! Estado: ${respuesta.status}`);
          }
  
          const datos = await respuesta.json();
          alert('Método de pago registrado con éxito.');
          setDatosFormulario({
              email: '',
              numeroTarjeta: '',
              vencimiento: '',
              cvc: '',
              nombre: '',
              direccion: '',
              codigoPostal: '',
              nombrePropietario: '', 
              userId: datosFormulario.userId,
              paymentMethodType: '' 
          });
          
      } catch (error) {
          alert('Pago Realizado con Exito.');
      }
  };

  // Generar opciones de vencimiento
  const generarOpcionesVencimiento = () => {
    const opciones = [];
    const mesActual = new Date().getMonth() + 1; // Mes actual (1-12)
    const anioActual = new Date().getFullYear(); // Año actual

    for (let anio = anioActual; anio <= anioActual + 10; anio++) {
      for (let mes = 1; mes <= 12; mes++) {
        const mesFormato = mes.toString().padStart(2, '0');
        const vencimiento = `${mesFormato}/${anio.toString().slice(-2)}`;
        opciones.push(
          <option key={`${mes}-${anio}`} value={vencimiento}>
            {vencimiento}
          </option>
        );
      }
    }

    return opciones;
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-full max-w-lg mt-20">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">Método de Pago</h3>
        <p className="text-sm text-muted-foreground">Ingresa tu información de pago</p>
      </div>
      <div className="p-6">
        <form className="grid gap-4" onSubmit={manejarEnvio}>
          <div className="grid gap-2">
            <label className="text-sm font-medium leading-none" htmlFor="metodoPago">Método de Pago</label>
            <select
              id="metodoPago"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={metodoPago}
              onChange={manejarCambioMetodoPago}
            >
              <option value="">Selecciona un método</option>
              <option value="PayPal">PayPal</option>
              <option value="TarjetaDeCredito">Tarjeta de Crédito</option>
            </select>
          </div>

          {/* Formulario específico para PayPal */}
          {metodoPago === 'PayPal' && (
            <div className="grid gap-2">
              <div className="grid gap-2">
                <label className="text-sm font-medium leading-none" htmlFor="email">Correo Electrónico</label>
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  id="email"
                  placeholder="Ingresa tu correo electrónico"
                  value={datosFormulario.email}
                  onChange={manejarCambio}
                />
              </div>
              <div className="grid gap-4">
                <label className="text-sm font-medium leading-none" htmlFor="numeroTarjeta">Número de Tarjeta</label>
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  id="numeroTarjeta"
                  placeholder="Ingresa el número de tu tarjeta"
                  value={datosFormulario.numeroTarjeta}
                  onChange={manejarCambio}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium leading-none" htmlFor="vencimiento">Vencimiento</label>
                  <select
                    id="vencimiento"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={datosFormulario.vencimiento}
                    onChange={manejarCambio}
                  >
                    <option value="">Selecciona una fecha</option>
                    {generarOpcionesVencimiento()}
                  </select>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium leading-none" htmlFor="cvc">CVC</label>
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    id="cvc"
                    placeholder="CVC"
                    value={datosFormulario.cvc}
                    onChange={manejarCambio}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium leading-none" htmlFor="nombre">Nombre en la Tarjeta</label>
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  id="nombre"
                  placeholder="Nombre completo del propietario de la tarjeta"
                  value={datosFormulario.nombre}
                  onChange={manejarCambio}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium leading-none" htmlFor="direccion">Dirección</label>
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  id="direccion"
                  placeholder="Dirección de facturación"
                  value={datosFormulario.direccion}
                  onChange={manejarCambio}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium leading-none" htmlFor="codigoPostal">Código Postal</label>
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  id="codigoPostal"
                  placeholder="Código Postal"
                  value={datosFormulario.codigoPostal}
                  onChange={manejarCambio}
                />
              </div>
            </div>
          )}

          {/* Formulario específico para Tarjeta de Crédito */}
          {metodoPago === 'TarjetaDeCredito' && (
            
            <div className="grid gap-2">
              <div className="grid gap-2">
                <label className="text-sm font-medium leading-none" htmlFor="email">Correo Electrónico</label>
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  id="email"
                  placeholder="Ingresa tu correo electrónico"
                  value={datosFormulario.email}
                  onChange={manejarCambio}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium leading-none" htmlFor="numeroTarjeta">Número de Tarjeta</label>
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  id="numeroTarjeta"
                  placeholder="Ingresa el número de tu tarjeta"
                  value={datosFormulario.numeroTarjeta}
                  onChange={manejarCambio}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium leading-none" htmlFor="vencimiento">Vencimiento</label>
                  <select
                    id="vencimiento"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={datosFormulario.vencimiento}
                    onChange={manejarCambio}
                  >
                    <option value="">Selecciona una fecha</option>
                    {generarOpcionesVencimiento()}
                  </select>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium leading-none" htmlFor="cvc">CVC</label>
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    id="cvc"
                    placeholder="CVC"
                    value={datosFormulario.cvc}
                    onChange={manejarCambio}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium leading-none" htmlFor="nombre">Nombre en la Tarjeta</label>
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  id="nombre"
                  placeholder="Nombre completo del propietario de la tarjeta"
                  value={datosFormulario.nombre}
                  onChange={manejarCambio}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium leading-none" htmlFor="direccion">Dirección</label>
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  id="direccion"
                  placeholder="Dirección de facturación"
                  value={datosFormulario.direccion}
                  onChange={manejarCambio}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium leading-none" htmlFor="codigoPostal">Código Postal</label>
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  id="codigoPostal"
                  placeholder="Código Postal"
                  value={datosFormulario.codigoPostal}
                  onChange={manejarCambio}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium leading-none" htmlFor="nombrePropietario">Nombre del Propietario</label>
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  id="nombrePropietario"
                  placeholder="Nombre completo del propietario"
                  value={datosFormulario.nombrePropietario}
                  onChange={manejarCambio}
                />
              </div>
            </div>
          )}

        <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm ring-offset-background hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
            Pagar
        </button>
        </form>
      </div>
    </div>
  );
};

export default FormularioPago;
