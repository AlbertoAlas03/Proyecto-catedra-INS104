import { useEffect } from "react"
import useGrades from "../hooks/use-grades"
import { useParams } from "react-router-dom"
import { useAuth } from "../hooks/context/auth-context"
import { Container, Spinner, Table, Image } from "react-bootstrap"
import notas_img from '../assets/img/lapiz.png'
import { CallCourses } from "../hooks/context/course-context"

const Grades = () => {

    const { curso_id } = useParams()

    const { get_notas, notas, nota_final, loading } = useGrades()

    const { token } = useAuth()

    const { programa, modalidad } = CallCourses()

    useEffect(() => {
        if (token) {
            get_notas(token)
        }
    }, [curso_id])

    if (loading) {
        return (
            <Container
                fluid
                className="d-flex flex-column justify-content-center align-items-center"
                style={{ height: '100vh', background: '#f5f7fa' }}
            >
                <Spinner animation="border" variant="primary" role="status" style={{ width: '4rem', height: '4rem' }} />

                <p className="mt-4 fs-5 text-secondary">Cargando tus notas, por favor espera...</p>
            </Container>
        )
    }

    return (
        <Container style={{marginBottom: '50px'}}>
            <h3 className="mb-4 h3" style={{ marginTop: '20px' }}><i className="bi bi-person"></i> Mis calificaciones - {programa} - {modalidad}</h3>
            <hr />
            <Container className="d-flex justify-content-end my-3">
                {
                    notas.length !== 0 && (
                        <div className="text-end" style={{ fontSize: '20px' }}><span className={nota_final >= 6 ? 'badge text-bg-success' : 'badge text-bg-danger'}>{nota_final >= 6 ? 'Aprobado' : 'Reprobado'}</span> Nota final: <strong style={{ textDecoration: 'underline' }}>{nota_final}</strong></div>
                    )
                }
            </Container>
            {
                notas.length > 0 ? (

                    <Table striped bordered hover>
                        <thead>
                            <tr className="text-center">
                                <th>Evaluación</th>
                                <th>Puntaje obtenido</th>
                                <th>Porcentaje</th>
                                <th>Nota final</th>
                            </tr>
                        </thead>
                        <tbody>
                            {notas.map((nota) => (
                                <tr key={nota.nota_id} className="text-center">
                                    <td>{nota.evaluacion.nombre}</td>
                                    <td>{nota.puntaje_obtenido}</td>
                                    <td>{(nota.evaluacion.porcentaje) * 100}%</td>
                                    <td>{nota.nota_final}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                ) : (
                    <Container className="d-flex flex-column justify-content-center align-items-center" style={{ marginTop: '20px' }}>
                        <Image src={notas_img} className="display-1 text-secondary mb-4" style={{ height: '100px', width: '100px' }} />
                        <h4 className="text-muted mb-3">¡Vaya! Parece que tus notas no han sido publicadas.</h4>
                        <p className="text-center text-secondary mb-4">Tus notas aparecerán aqui.</p>
                    </Container>
                )


            }
        </Container>
    )
}

export default Grades