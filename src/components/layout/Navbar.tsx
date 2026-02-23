import type { User } from '../../types';
import { STORES } from '../../data/stores';

interface NavbarProps {
  User: User | null;
}

export default function Navbar({ User }: NavbarProps) {
    const vendorStore = STORES.find(s => s.storeId === User?.storeId);
    return (
    <header>
        <h2 className='navbar-title'>Polifood</h2>
        <nav className='navbar-links'>
            
            <div className='menu-links'>
                {/*Si es un estudiante*/}
                {User?.role === 'STUDENT' && (
                    <>
                    <button>Mis Pedidos</button> {/*Donde se van a ver los pedidos realizados por el estudiante*/}
                    <button>Carrito</button> {/*Donde se va a ver el carrito de compras del estudiante*/}
                    </>
                )}
                {/*Si es un vendor*/}
                {User?.role === 'VENDOR' && (
                    <>
                    <button>Ventas y Pedidos</button> {/*Donde se va a ver el historial de ventas y pedidos actual del vendor*/}
                    <button>Menu</button> {/*Donde se va a ver o editar el menu del vendor*/}
                    </>
                )}
                {/*Si es un admin*/}
                {User?.role === 'ADMIN' && (
                    <>
                    <button>Gestionar Vendors</button>
                    </>
                )}
            </div>
            <div>
                {User ? `Hola, ${User.name}` : <button>Iniciar Sesión</button>}
                {User?.role === 'VENDOR' && vendorStore &&(
                    <span className='vendor-store-navbar'> <strong>{vendorStore.name}</strong></span>
                )}
            </div>
        </nav>
    </header>
    );
}