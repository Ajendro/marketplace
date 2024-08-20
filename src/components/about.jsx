import React from 'react';
import { FaLeaf, FaHandHoldingHeart, FaRecycle } from 'react-icons/fa';

const AboutSection = () => {
  return (
    <div>
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Acerca de Nuestro Marketplace
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Somos una plataforma dedicada a brindar un espacio donde artesanos y creadores locales puedan ofrecer
                sus productos de manera directa a los consumidores. Nuestro objetivo es apoyar a la economía local y
                promover el talento y la creatividad de nuestra comunidad.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Nuestros Artesanos
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Conoce a los talentosos artesanos que forman parte de nuestro marketplace y descubre sus creaciones
                únicas.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              <div className="bg-background rounded-lg overflow-hidden shadow-md">
                <div className="h-48 bg-[url('./herramientas/imagen1.jpg')] bg-cover bg-center"></div>
                <div className="p-4">
                  <h3 className="text-xl font-bold">María Gómez</h3>
                  <p className="text-muted-foreground">Ceramista</p>
                </div>
              </div>
              <div className="bg-background rounded-lg overflow-hidden shadow-md">
                <div className="h-48 bg-[url('./herramientas/imagen2.jpeg')] bg-cover bg-center"></div>
                <div className="p-4">
                  <h3 className="text-xl font-bold">Juan Pérez</h3>
                  <p className="text-muted-foreground">Tejedor</p>
                </div>
              </div>
              <div className="bg-background rounded-lg overflow-hidden shadow-md">
                <div className="h-48 bg-[url('./herramientas/imagen3.jpeg')] bg-cover bg-center"></div>
                <div className="p-4">
                  <h3 className="text-xl font-bold">Ana Rodríguez</h3>
                  <p className="text-muted-foreground">Joyera</p>
                </div>
              </div>
              <div className="bg-background rounded-lg overflow-hidden shadow-md">
                <div className="h-48 bg-[url('./herramientas/imagen4.jpg')] bg-cover bg-center"></div>
                <div className="p-4">
                  <h3 className="text-xl font-bold">Pedro Sánchez</h3>
                  <p className="text-muted-foreground">Tallador de madera</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Nuestra Misión y Valores
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Nuestra misión es brindar una plataforma que permita a los artesanos locales mostrar y vender sus
                creaciones de manera directa a los consumidores, fomentando así el desarrollo de la economía local y la
                preservación de las tradiciones artesanales.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              <div className="bg-background rounded-lg overflow-hidden shadow-md p-6">
                <div className="bg-primary rounded-md p-3 flex items-center justify-center mb-4">
                  <FaLeaf className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold">Autenticidad</h3>
                <p className="text-muted-foreground">
                  Nos aseguramos de que todos los productos ofrecidos en nuestro marketplace sean auténticos y de alta
                  calidad.
                </p>
              </div>
              <div className="bg-background rounded-lg overflow-hidden shadow-md p-6">
                <div className="bg-primary rounded-md p-3 flex items-center justify-center mb-4">
                  <FaHandHoldingHeart className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold">Sostenibilidad</h3>
                <p className="text-muted-foreground">
                  Promovemos prácticas sostenibles y respetuosas con el medio ambiente.
                </p>
              </div>
              <div className="bg-background rounded-lg overflow-hidden shadow-md p-6">
                <div className="bg-primary rounded-md p-3 flex items-center justify-center mb-4">
                  <FaRecycle className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold">Reciclaje</h3>
                <p className="text-muted-foreground">
                  Fomentamos el uso de materiales reciclados y la reducción de residuos en la producción artesanal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutSection;
