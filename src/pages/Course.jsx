import { useEffect, useState } from "react"
import useCourse from "../hooks/use-course"
import { useAuth } from "../hooks/contexts/auth-context"
import { Button, Card, Container, Badge, Image, Spinner } from "react-bootstrap"
import english_img from '../assets/img/english.jpg'
import france_img from '../assets/img/france.jpg'
import { Link } from "react-router-dom"
import { CallCourses } from "../hooks/contexts/course-context"
import curso_img from '../assets/img/curso.png'

const Course = () => {

    const { list_course, cursos, loading } = useCourse()

    const { token } = useAuth()

    const { setNombre, setPrograma, setModalidad, setEstado } = CallCourses()

    useEffect(() => {
        if (token) {
            list_course(token)
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
                                        <Container className="col-md-6 col-lg-4 mb-4" key={Curso.asignacion_id}>
                                            <Card className="shadow-lg border-0 rounded-4" key={Curso.asignacion_id}>
                                                <Image className="bd-placeholder-img card-img-top" src={
                                                    Curso.curso.idioma.nombre === 'Ingles' ? english_img : france_img
                                                } height="180" width="100%" />
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
                                                    <Card.Text className="mb-2">
                                                        <strong>Horario:</strong> {Curso.curso.horario}
                                                    </Card.Text>
                                                    <Card.Text className="mb-3">
                                                        <strong>Programa:</strong> {Curso.curso.programa}
                                                    </Card.Text>
                                                    <Badge className="mb-3" bg={
                                                        Curso.curso.estado === 'activo' ? 'success' :
                                                            Curso.curso.estado === 'finalizado' ? 'danger' : 'warning'
                                                    }>
                                                        {Curso.curso.estado}
                                                    </Badge>

                                                    <div className="d-flex justify-content-end">
                                                        <Button variant="primary" className="rounded-pill" as={Link} to={`/home/course/students/${Curso.curso_id}`} onClick={() => {
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
                        <h3 className="text-muted mb-3">¡Vaya! No tienes cursos asignados todavía.</h3>
                        <p className="text-center text-secondary mb-4">Cuando se te asignen cursos, aparecerán aquí.</p>
                    </Container>
                )
            }
        </>
    )
}

export default Course
