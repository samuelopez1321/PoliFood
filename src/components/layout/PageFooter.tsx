

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1a1a1a] text-white pt-8 pb-4 px-4 mt-auto">
      <div className="max-w-[1200px] mx-auto grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-8">
        <div className="flex flex-col gap-4">
          <h4 className="text-primary font-bold text-lg">PoliFood</h4>
          <p className="text-gray-400 text-sm">
            Gestión de pedidos eficiente para nuestra comunidad universitaria.
          </p>
        </div>
        <div>
          <h4 className="text-primary font-bold mb-4">Enlaces Rápidos</h4>
          <ul className="space-y-2">
            <li>
              <a href="#inicio" className="text-[#ccc] hover:text-white transition-colors duration-300">
                Inicio
              </a>
            </li>
            <li>
              <a href="#tiendas" className="text-[#ccc] hover:text-white transition-colors duration-300">
                Tiendas
              </a>
            </li>
            <li>
              <a href="#ayuda" className="text-[#ccc] hover:text-white transition-colors duration-300">
                Centro de Ayuda
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="text-center mt-8 pt-4 border-t border-[#333] text-sm text-[#777]">
        <p>&copy; {currentYear} PoliFood - Proyecto Ingeniería Web</p>
      </div>
    </footer>
  );
};

export default Footer;