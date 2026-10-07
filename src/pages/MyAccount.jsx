import { Card, Container, Row, Col, ListGroup, Button } from "react-bootstrap"
import { useAuth } from "../hooks/context/auth-context"
import { CallCourses } from "../hooks/context/course-context"
import { Link } from "react-router-dom"
import Swal from "sweetalert2"
import { useState } from "react"
import UpdateAccountModal from "../components/UpdateAccountModal"

const MyAccount = () => {

    const { courses, setEstado, setModalidad, setNombre, setPrograma } = CallCourses()
    const { user, token } = useAuth()
    const [updateData, setUpdateData] = useState(null)
    const [showModal, setShowModal] = useState(false)

    const handleUpdate = async () => {
        const modal = await Swal.fire({
            title: '¿Deseas actualizar tu perfil?',
            icon: 'question',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
            allowEscapeKey: false,
            allowOutsideClick: false,
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            }
        })

        if (modal.isConfirmed) {

            const data = {
                usuario_id: user ? user.usuario_id : null,
                nombre: user ? user.nombre : null,
                apellido: user ? user.apellido : null
            }

            setUpdateData(data)
            setShowModal(true)
        }

    }

    return (
        <>
            <Container fluid className="p-4 bg-light min-vh-100">
                {/* Fila superior: nombre del usuario */}
                <Row className="mb-4">
                    <Col>
                        <Card className="shadow-sm border-0 rounded-4">
                            <Card.Body className="text-center">
                                <h2 className="fw-bold text-dark mb-0 d-flex justify-content-center align-items-center gap-2">
                                    <span style={{ fontSize: '40px' }}><i className="bi bi-person-circle"></i></span> {user ? user.nombre : 'Usuario'} {user ? user.apellido : 'Default'}
                                </h2>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    {/* Información del usuario */}
                    <Col md={6} className="mb-4">
                        <Card className="shadow-sm border-0 rounded-4 h-100">
                            <Card.Header className="bg-primary text-white fw-semibold">
                                Información del Usuario
                            </Card.Header>
                            <Card.Body>
                                <Container className="d-flex align-items-center gap-2 mb-3">
                                    <p><i className="bi bi-envelope-at"></i> Dirección de correo: <b>{user ? user.email : 'No disponible'}</b></p>
                                </Container>
                                <Container className="d-flex align-items-center gap-2 mb-3">
                                    <p><i className="bi bi-person"></i> Rol: <b>{user ? user.rol : 'No disponible'}</b></p>
                                </Container>
                                <Container className="d-flex align-items-center gap-2 mb-3">
                                    <p><i className="bi bi-calendar-week"></i> Fecha de registro: <b>{user ? new Date(user.fecha_registro).toISOString().split('T')[0] : 'No disponible'}</b></p>
                                </Container>
                                <Container>
                                    <Button variant="btn btn-warning" onClick={() => handleUpdate()}><i className="bi bi-pencil-square"></i> Editar perfil</Button>
                                </Container>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Cursos del usuario */}
                    <Col md={6} className="mb-4">
                        <Card className="shadow-sm border-0 rounded-4 h-100">
                            <Card.Header className="bg-success text-white fw-semibold">
                                Mis Cursos
                            </Card.Header>
                            <ListGroup variant="flush">
                                {/*  */}
                                {
                                    courses.length > 0 ? (
                                        courses.map((curso) => (
                                            <Link
                                                to={`/home/course/grades/${curso.curso_id}`}
                                                style={{ textDecoration: 'none', color: 'inherit' }}
                                                key={curso.inscripcion_id}
                                                onClick={() => {
                                                    setNombre(curso.curso.nombre)
                                                    setPrograma(curso.curso.programa)
                                                    setModalidad(curso.curso.modalidad)
                                                    setEstado(curso.curso.estado)
                                                }
                                                }
                                            >
                                                <ListGroup.Item
                                                    key={curso.inscripcion_id}
                                                    className="d-flex align-items-center gap-2 curso-item"
                                                >
                                                    <p className="d-flex align-items-center gap-2 mb-3">
                                                        <i className="bi bi-mortarboard"></i> {curso.curso.nombre} - {curso.curso.programa} - {curso.curso.modalidad}
                                                    </p>
                                                </ListGroup.Item>
                                            </Link>

                                        ))

                                    ) : (
                                        <ListGroup.Item className="d-flex align-items-center gap-2">
                                            <p className="d-flex align-items-center gap-2 mb-3">
                                                <p><b>Sin cursos registrados</b></p>
                                            </p>
                                        </ListGroup.Item>
                                    )
                                }
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
            </Container >
            <UpdateAccountModal showModal={showModal} setShowModal={() => setShowModal(false)} updateData={updateData} token={token} />
        </>
    )
}

export default MyAccount