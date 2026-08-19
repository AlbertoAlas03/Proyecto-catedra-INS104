import { useEffect } from "react"
import useCount from "../hooks/use-count"
import { useAuth } from '../hooks/context/auth-context'
import { Container, Spinner } from "react-bootstrap"

const Dashboard = () => {

    const { count_registros, count, loading } = useCount()

    const { token } = useAuth()

    useEffect(() => {
        if (token) {
            count_registros(token)
        }

    }, [])

    if (loading) {
        return (
            <Container
                fluid
                className="d-flex flex-column justify-content-center align-items-center"
                style={{ height: '100vh', background: '#f5f7fa' }}
            >
                <Spinner animation="border" variant="primary" role="status" style={{ width: '4rem', height: '4rem' }} />

                <p className="mt-4 fs-5 text-secondary">Cargando recursos, por favor espera...</p>
            </Container>
        )
    }

    return (
        <>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className="h2"><i className="bi bi-house"></i> Dashboard</h1>
            </div>
            <div className="row g-4 mb-3">

                <div className="col-md-6">
                    <div className="card text-white bg-primary shadow-lg p-3" style={{ minHeight: '180px' }}>
                        <div className="card-body d-flex flex-column justify-content-between h-100">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="fs-4 mb-0">Idiomas ofertados</h5>
                                <i className="bi bi-translate display-3"></i>
                            </div>
                            <h2 className="fw-bold">{count?.count_idiomas ?? 0}</h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card text-white bg-success shadow-lg p-3" style={{ minHeight: '180px' }}>
                        <div className="card-body d-flex flex-column justify-content-between h-100">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="fs-4 mb-0">Cursos activos</h5>
                                <i className="bi bi-calendar-check display-3"></i>
                            </div>
                            <h2 className="fw-bold">{count?.count_cursos_activos ?? 0}</h2>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-md-6">
                    <div className="card text-white bg-warning shadow-lg p-3" style={{ minHeight: '180px' }}>
                        <div className="card-body d-flex flex-column justify-content-between h-100">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="fs-4 mb-0">Estudiantes activos</h5>
                                <i className="bi bi-mortarboard display-3"></i>
                            </div>
                            <h2 className="fw-bold">{count?.count_estudiantes ?? 0}</h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card text-white bg-info shadow-lg p-3" style={{ minHeight: '180px' }}>
                        <div className="card-body d-flex flex-column justify-content-between h-100">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="fs-4 mb-0">Profesores activos</h5>
                                <i className="bi bi-person-video3 display-3"></i>
                            </div>
                            <h2 className="fw-bold">{count?.count_profesores ?? 0}</h2>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Dashboard