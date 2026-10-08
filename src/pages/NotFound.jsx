import { Button, Container, Image } from "react-bootstrap"
import img_not_found from '../assets/img/not_found.png'
import { useNavigate } from "react-router-dom"

const NotFound = () => {

    const navigate = useNavigate()

    return (
        <Container className="container d-flex justify-content-center align-items-center vh-100">
            <Container className="text-center p-5 bg-white">
                <span style={{ fontSize: "5rem" }}><Image src={img_not_found} alt="notFound" style={{ height: 200 }}></Image></span>
                <h1 className="display-1 fw-bold text-danger">404</h1>
                <h2 className="h2 mb-3">¡Página no encontrada!</h2>
                <p className="lead text-muted mb-4">
                    Lo sentimos, la página que buscas no existe o ha sido movida.
                </p>
                <Button
                    onClick={() => navigate("/home")}
                    className="btn-lg rounded-pill px-4"
                    variant="outline-success"
                >
                    <i className="bi bi-arrow-left-square"></i> Volver al inicio
                </Button>
            </Container>
        </Container>
    )
}

export default NotFound