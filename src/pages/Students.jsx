import { useEffect } from "react"
import { useParams } from "react-router-dom"
import useUsersCourse from "../hooks/use-users_course"
import { CallCourses } from "../hooks/context/course-context"
import { Container, Table, Image, Spinner } from "react-bootstrap"
import img_estudio from '../assets/img/estudio.png'
import { useAuth } from "../hooks/context/auth-context"

const Students = () => {

    const { curso_id } = useParams()

    const { token } = useAuth()

    const { modalidad, programa } = CallCourses()

    const { users_course, students, teacher, loading } = useUsersCourse()

    useEffect(() => {
        if (token) {
            users_course(token, curso_id)
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

                <p className="mt-4 fs-5 text-secondary">Cargando participantes, por favor espera...</p>
            </Container>
        )
    }

    return (
        <Container style={{ marginBottom: '50px' }}>
            <h3 className="mb-4 h3" style={{ marginTop: '20px' }}><i className="bi bi-people"></i> Participantes - {programa} - {modalidad}</h3>
            <hr />
            {
                students.length > 0 ? (

                    <Table striped bordered hover>
                        <thead>
                            <tr className="text-center">
                                <th>Participante</th>
                                <th>Email</th>
                                <th>Rol</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                teacher && (
                                    <tr>
                                        <td><i className="bi bi-person-circle"></i> {teacher ? teacher.profesor.nombre : ''} {teacher ? teacher.profesor.apellido : ''}</td>
                                        <td className="text-center">{teacher ? teacher.profesor.email : ''}</td>
                                        <td className="text-center">{teacher ? teacher.profesor.rol : ''}</td>
                                    </tr>
                                )
                            }

                            {students.map((student) => (
                                <tr key={student.inscripcion_id}>
                                    <td><i className="bi bi-person-circle"></i> {student.estudiante.nombre} {student.estudiante.apellido}</td>
                                    <td className="text-center">{student.estudiante.email}</td>
                                    <td className="text-center">{student.estudiante.rol}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                ) : (
                    <Container className="d-flex flex-column justify-content-center align-items-center" style={{ marginTop: '20px' }}>
                        <Image src={img_estudio} className="display-1 text-secondary mb-4" style={{ height: '100px', width: '100px' }} />
                        <h4 className="text-muted mb-3">¡Vaya! Parece que aún no hay más participantes.</h4>
                        <p className="text-center text-secondary mb-4">Los participantes de este curso apareceran aqui.</p>
                    </Container>
                )
            }
        </Container>
    )
}

export default Students