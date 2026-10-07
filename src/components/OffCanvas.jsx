import { Nav, Offcanvas } from "react-bootstrap"
import { Link } from "react-router-dom"
import { CallCourses } from "../hooks/context/course-context"
import { useParams } from "react-router-dom"

const OffCanvas = ({ show, setshow }) => {

    const { courses, setNombre, setPrograma, setModalidad, setEstado, programa, modalidad } = CallCourses()

    const { curso_id } = useParams()

    return (
        <Offcanvas show={show} onHide={() => setshow(false)}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Menú</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>

                <Nav className="flex-column" style={{ fontSize: '18px' }} variant="underline" defaultActiveKey="/home">
                    {
                        curso_id && (
                            <>
                                <Nav.Item style={{ marginBottom: '1px' }}>
                                    <Nav.Link as={Link} to={`/home/course/grades/${curso_id}`} style={{ padding: '4px 8px' }}>
                                        <i className="bi bi-mortarboard"></i> {programa} - {modalidad}
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link as={Link} to={`/home/course/students/${curso_id}`} style={{ padding: '4px 8px' }}>
                                        <i className="bi bi-people"></i> Participantes
                                    </Nav.Link>
                                </Nav.Item>
                                <hr style={{ margin: '4px 0' }} />
                            </>
                        )
                    }

                    <Nav.Item style={{ marginBottom: '1px' }}>
                        <Nav.Link as={Link} to="/home" style={{ padding: '4px 8px' }}>
                            <i className="bi bi-house"></i> Inicio
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item style={{ marginBottom: '1px' }}>
                        <Nav.Link as={Link} to="/home/registration" style={{ padding: '0px 8px' }}>
                            <i className="bi bi-journal-code"></i> Explorar cursos
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item style={{ marginBottom: '1px' }}>
                        <Nav.Link as={Link} to="/home/myschedule" style={{ padding: '0px 8px' }}>
                            <i className="bi bi-calendar"></i> Mi horario
                        </Nav.Link>
                    </Nav.Item>
                    <hr style={{ margin: '4px 0' }} />

                    <Nav.Item style={{ marginBottom: '0px' }}>
                        <Nav.Link eventKey="disabled" disabled style={{ padding: '3px 8px' }}>
                            <i className="bi bi-journal-bookmark"></i> Mis cursos
                        </Nav.Link>
                    </Nav.Item>

                    {
                        courses.length > 0 && (
                            courses.map((Cursos) => (
                                <Nav.Item key={Cursos.curso.curso_id} style={{ marginBottom: '1px' }}>
                                    <Nav.Link
                                        as={Link}
                                        to={`/home/course/grades/${Cursos.curso.curso_id}`}
                                        onClick={() => {
                                            setNombre(Cursos.curso.nombre)
                                            setPrograma(Cursos.curso.programa)
                                            setModalidad(Cursos.curso.modalidad)
                                            setEstado(Cursos.curso.estado)
                                        }}
                                        style={{ padding: '3px 8px' }}
                                    >
                                        <i className="bi bi-mortarboard"></i> {Cursos.curso.programa} - {Cursos.curso.modalidad}
                                    </Nav.Link>
                                </Nav.Item>
                            ))
                        )
                    }
                </Nav>


            </Offcanvas.Body>
        </Offcanvas>
    )
}

export default OffCanvas