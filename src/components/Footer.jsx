import { Container, Image } from "react-bootstrap"
import logo from '../assets/img/logo.png'

const Footer = () => {
    return (
        <footer className="row row-cols-1 row-cols-sm-2 row-cols-md-5 py-5 border-top">
            <Container className="col mb-3 text-center">
                <Image src={logo} className="d-flex align-items-center mb-3 text-decoration-none" width='250px' height='100px' />
                <p><strong>Copyright © 2025 - Academia de Idiomas UDB</strong></p>
            </Container>
            <Container className="col mb-3">
                <h5>INFORMACIÓN</h5>
                <ul className="nav flex-column">
                    <li className="nav-item mb-2"><a href="https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.udb.edu.sv%2Fudb%2Fpagina%2Fescidiomas&h=AT2KO4ssB-snw1UFklquz8xaOcfExXOT9JFnZ-79b62mzAtSecDncPx57Kz7GiyKJt2eyMNJWwITYV06mj5zhZq08wSDZ7WkIcphmwTbPs4coaWMTw3wqS6gYMB6M02A5f_4_45kK0H6EeAIHsE7" target="_blank">Página oficial - idiomas UDB</a></li>
                </ul>
            </Container>
            <Container className="col mb-3">
                <h5>CONTÁCTANOS</h5>
                <ul className="nav flex-column">
                    <li className="nav-item mb-2"><strong>Campus UDB Soyapango</strong></li>
                    <li className="nav-item mb-2"><i className="bi bi-telephone"></i> Teléfono: (503) 2251-8219</li>
                    <li className="nav-item mb-2"><strong>Campus UDB Antiguo Cuscatlán</strong></li>
                    <li className="nav-item mb-2"><i className="bi bi-telephone"></i> Teléfono: (503) 2527-2324</li>
                    <li className="nav-item mb-2"><strong>Nuestro E-mail:</strong></li>
                    <li className="nav-item mb-2"><i className="bi bi-envelope"></i> <u>idiomas@udb.edu.sv</u></li>
                    <li className="nav-item mb-2"><i className="bi bi-envelope"></i> <u>sabatinos@udb.edu.sv</u></li>
                </ul>
            </Container>
            <Container className="col mb-3">
                <h5>REDES SOCIALES</h5>
                <ul className="nav flex-column">
                    <li className="nav-item mb-2">
                        <a href="https://www.facebook.com/escueladeidiomas.udb/?locale=es_LA" target="_blank">
                            <i className="bi bi-facebook" style={{ fontSize: '50px' }}></i>
                        </a>
                    </li>
                </ul>
            </Container>
        </footer>
    )
}

export default Footer