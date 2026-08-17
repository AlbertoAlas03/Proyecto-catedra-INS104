import img_not_found from '../assets/img/not_found.png'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {

    const navigate = useNavigate()

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="text-center p-5 bg-white">
                <span style={{ fontSize: "5rem" }}><img src={img_not_found} alt="notFound" style={{ height: 200 }}></img></span>
                <h1 className="display-1 fw-bold text-danger">404</h1>
                <h2 className="h2 mb-3">¡Página no encontrada!</h2>
                <p className="lead text-muted mb-4">
                    Lo sentimos, la página que buscas no existe o ha sido movida.
                </p>
                <button
                    onClick={() => navigate("/home")}
                    className="btn btn-warning btn-lg rounded-pill px-4"
                >
                    <i className="bi bi-arrow-left-square"></i> Volver al inicio
                </button>
            </div>
        </div>
    )
}

export default NotFound