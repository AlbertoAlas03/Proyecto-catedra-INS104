import { useEffect } from "react"
import useCourse from "../hooks/use-course"
import { useAuth } from "../hooks/context/auth-context"
import { Container, Spinner, Table, Image, Button, Badge } from "react-bootstrap"
import img_buscar from '../assets/img/buscar.png'
import Swal from "sweetalert2"
import useRegistration from "../hooks/use-registration"

const RegistrationCourse = () => {

    const { get_courses_not_started, coursesNotStarted, loadingCoursesNotStarted } = useCourse()

    const { registration, loading, courses } = useRegistration()

    const { token } = useAuth()

    const verifyCourse = (curso_id) => {
        const course = courses.some(c2 => c2.curso_id === curso_id)
        return course
    }

    const handleRegistration = async (curso_id) => {

        const model = await Swal.fire({
            title: '¿Estás seguro que quieres inscribirte a este curso?',
            icon: 'warning',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
            allowEscapeKey: false,
            allowOutsideClick: false,
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            }
        })

        if (model.isConfirmed) {

            try {

                let timerInterval;

                if (loading) {

                    Swal.fire({
                        title: "Procesando, por favor espere...",
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        didOpen: () => {
                            Swal.showLoading();
                            timerInterval = setInterval(() => {
                                if (!loading) {
                                    Swal.close();
                                }
                            }, 1000);
                        },
                        willClose: () => {
                            clearInterval(timerInterval);
                        }
                    });
                }

                const response = await registration(token, curso_id)

                if (response) {

                    await Swal.fire({
                        title: response.message,
                        icon: "success",
                        showConfirmButton: true,
                        confirmButtonText: 'OK',
                        allowEscapeKey: false,
                        allowOutsideClick: false,
                        customClass: {
                            confirmButton: 'btn btn-success'
                        }
                    })

                    get_courses_not_started(token)
                }

            } catch (error) {

                await Swal.fire({
                    title: error.message,
                    icon: "error",
                    showConfirmButton: true,
                    confirmButtonText: 'OK',
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                    customClass: {
                        confirmButton: 'btn btn-success'
                    }
                });

            }
        }
    }

    useEffect(() => {
        if (token) {
            get_courses_not_started(token)
        }
    }, [])

    if (loadingCoursesNotStarted) {
        return (
            <Container
                fluid
                className="d-flex flex-column justify-content-center align-items-center"
                style={{ height: '100vh', background: '#f5f7fa' }}
            >
                <Spinner animation="border" variant="primary" role="status" style={{ width: '4rem', height: '4rem' }} />

                <p className="mt-4 fs-5 text-secondary">Cargando cursos, por favor espera...</p>
            </Container>
        )
    }

    return (
        <Container style={{ marginBottom: '50px' }}>
            <h3 className="mb-4 h3" style={{ marginTop: '20px' }}><i className="bi bi-journal-plus"></i> Cursos ofertados</h3>
            <hr />
            <Container className="d-flex justify-content-center my-3">
                <span><Badge bg="primary" style={{ fontSize: '12px' }}>Inscrito</Badge> | <Badge bg="warning" style={{ fontSize: '12px' }}>Cupo lleno</Badge></span>
            </Container>
            {
                coursesNotStarted.length > 0 ? (

                    <Table striped bordered hover>
                        <thead>
                            <tr className="text-center">
                                <th>#</th>
                                <th>Nombre</th>
                                <th>Programa</th>
                                <th>Modalidad</th>
                                <th>horario</th>
                                <th>Fecha inicio</th>
                                <th>Fecha fin</th>
                                <th>Cupos</th>
                                <th>Accion</th>
                            </tr>
                        </thead>
                        <tbody>
                            {coursesNotStarted.map((course) => (
                                <tr key={course.curso_id} className={
                                    verifyCourse(course.curso_id) ? 'table-primary text-center' : course.capacidad_maxima === 0 ? 'table-warning text-center' : 'text-center'
                                }>
                                    <td>{course.curso_id}</td>
                                    <td>{course.nombre}</td>
                                    <td>{course.programa}</td>
                                    <td>{course.modalidad}</td>
                                    <td>{course.horario}</td>
                                    <td>{new Date(course.fecha_inicio).toISOString().split('T')[0]}</td>
                                    <td>{new Date(course.fecha_fin).toISOString().split('T')[0]}</td>
                                    <td>{course.capacidad_maxima}</td>
                                    <td>
                                        <Button className="btn btn-success" disabled={
                                            verifyCourse(course.curso_id) || course.capacidad_maxima === 0
                                        } onClick={() => handleRegistration(course.curso_id)}><i className="bi bi-pencil-square"></i> Inscribirse</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                ) : (
                    <Container className="d-flex flex-column justify-content-center align-items-center" style={{ marginTop: '20px' }}>
                        <Image src={img_buscar} className="display-1 text-secondary mb-4" style={{ height: '100px', width: '100px' }} />
                        <h4 className="text-muted mb-3">¡Vaya! Parece que no hay cursos ofertados.</h4>
                        <p className="text-center text-secondary mb-4">Los cursos ofertados por la academia apareceran aquí.</p>
                    </Container>
                )
            }
        </Container>
    )
}

export default RegistrationCourse