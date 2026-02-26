

export default function Footer() {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h4>Polifood</h4>
                    <p>Una App de gestion de pedidos para la comunidad universitaria</p>
                </div>
                <div className="footer-section">
                    <h4>Links</h4>
                    <ul>
                        <li><a href="#inicio">Inicio</a></li>
                        <li><a href="#tiendas">Tiendas</a></li>
                        <li><a href="#ayuda">Ayuda</a></li>
                    </ul>
                </div>
                <div className="footer-bottom">
                    <p>&copy; {currentYear} Polifood. Proyecto Academico EIA</p>
                </div>
            </div>
        </footer>
    )
};
