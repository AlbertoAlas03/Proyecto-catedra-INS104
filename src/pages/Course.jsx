import { useEffect } from "react"
import useCourse from "../hooks/use-course"
import { useAuth } from "../hooks/context/auth-context"
import { Container, Spinner, Card, Image, Button, } from "react-bootstrap"
import logo from '../assets/img/logo.png'
import { CallCourses } from "../hooks/context/course-context"
import { Link } from "react-router-dom"
import curso_img from '../assets/img/graduacion.png'

const Course = () => {

    const { get_course, cursos, loading } = useCourse()

    const { setEstado, setModalidad, setNombre, setPrograma } = CallCourses()

    const { token } = useAuth()

    useEffect(() => {
        if (token) {
            get_course(token)
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

                <p className="mt-4 fs-5 text-secondary">Cargando tus cursos, por favor espera...</p>
            </Container>
        )
    }

    return (
        <>
            {
                cursos.length > 0 ? (
                    <Container className="album py-3">
                        <h3 className="h3"><i className="bi bi-journal-bookmark-fill"></i> Mis cursos</h3>
                        <hr />
                        <Container className="container" style={{ marginTop: '40px' }}>
                            <Container className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                                {
                                    cursos.map((Curso) => (
                                        <Container className="col-md-6 col-lg-4 mb-4" key={Curso.inscripcion_id}>
                                            <Card className="shadow-lg border-0 rounded-4" key={Curso.inscripcion_id}>
                                                <Image className="bd-placeholder-img card-img-top" src={logo} height="180" width="100%" />
                                                <Card.Body>
                                                    <Card.Title className="fw-bold text-primary mb-3 d-flex align-items-center">
                                                        <i className="bi bi-journal-bookmark"></i> {Curso.curso.nombre}
                                                    </Card.Title>
                                                    <Card.Subtitle className="mb-2 text-muted d-flex align-items-center">
                                                        Idioma: <span className="ms-1" style={{ color: 'red' }}>{Curso.curso.idioma.nombre}</span>
                                                    </Card.Subtitle>
                                                    <Card.Text className="mb-2">
                                                        <strong>Modalidad:</strong> <span style={{ color: 'green' }}>{Curso.curso.modalidad}</span>
                                                    </Card.Text>
                                                    <Card.Text className="mb-3">
                                                        <strong>Programa:</strong> {Curso.curso.programa}
                                                    </Card.Text>
                                                    <Card.Text className="mb-2">
                                                        <span className={Curso.curso.estado === 'activo' ? 'badge text-bg-success' : 'badge text-bg-warning'} style={{ fontSize: '15px' }}> {Curso.curso.estado}</span>
                                                    </Card.Text>
                                                    <div className="d-flex justify-content-end">
                                                        <Button variant="primary" className="rounded-pill" as={Link} to={`/home/course/grades/${Curso.curso_id}`} onClick={() => {
                                                            setNombre(Curso.curso.nombre)
                                                            setPrograma(Curso.curso.programa)
                                                            setModalidad(Curso.curso.modalidad)
                                                            setEstado(Curso.curso.estado)
                                                        }}>
                                                            Ir al curso <i className="bi bi-arrow-right"></i>
                                                        </Button>
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </Container>
                                    ))
                                }
                            </Container>
                        </Container>
                    </Container>
                ) : (
                    <Container className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
                        <Image src={curso_img} className="display-1 text-secondary mb-4" style={{ height: '200px', width: '200px' }} />
                        <h3 className="text-muted mb-3">¡Vaya! parece que aún no te has inscrito a ningun curso.</h3>
                        <p className="text-center text-secondary mb-4">Tus cursos inscritos, aparecerán aquí.</p>
                    </Container>
                )
            }
        </>
    )
}

export default Course