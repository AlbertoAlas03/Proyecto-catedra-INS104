import { Nav, Offcanvas } from "react-bootstrap"
import { Link } from "react-router-dom"
import { CallCourses } from "../hooks/contexts/course-context"
import { useParams } from "react-router-dom"

const OffCanvas = ({ show, setshow }) => {

    const { courses, setNombre, setPrograma, setModalidad, programa, modalidad, setEstado } = CallCourses()

    const { curso_id } = useParams()

    return (
        <Offcanvas show={show} onHide={() => setshow(false)}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Menú</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>

                {
                    curso_id && (
                        <>
                            <Nav className="flex-column" style={{ fontSize: '18px' }}>
                                <Nav.Link><i className="bi bi-mortarboard"></i> {programa} - {modalidad}</Nav.Link>
                            </Nav>
                            <Nav className="flex-column" style={{ fontSize: '18px' }}>
                                <Nav.Link as={Link} to={`/home/course/students/${curso_id}`}><i className="bi bi-people"></i> Gestión de estudiantes</Nav.Link>
                            </Nav>
                            <Nav className="flex-column" style={{ fontSize: '18px' }}>
                                <Nav.Link as={Link} to={`/home/course/assessment/${curso_id}`}><i className="bi bi-book"></i> Gestión de evaluaciones</Nav.Link>
                            </Nav>
                            <hr />
                        </>
                    )
                }
                <Nav className="flex-column" style={{ fontSize: '18px' }}>
                    <Nav.Link as={Link} to="/home"><i className="bi bi-house"></i> Inicio</Nav.Link>
                </Nav>

                {
                    courses.length > 0 && (
                        courses.map((Cursos) => (
                            <Nav className="flex-column" key={Cursos.asignacion_id} style={{ fontSize: '18px' }}>
                                <Nav.Link as={Link} to={`/home/course/students/${Cursos.curso_id}`} onClick={() => {
                                    setNombre(Cursos.curso.nombre)
                                    setPrograma(Cursos.curso.programa)
                                    setModalidad(Cursos.curso.modalidad)
                                    setEstado(Cursos.curso.estado)
                                }
                                }><i className="bi bi-mortarboard"></i> {Cursos.curso.programa} - {Cursos.curso.modalidad}</Nav.Link>
                            </Nav>
                        ))

                    )
                }

            </Offcanvas.Body>
        </Offcanvas>
    )
}

export default OffCanvas