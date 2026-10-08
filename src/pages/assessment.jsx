import { useEffect, useState } from "react"
import useAssessment from "../hooks/use-assessment"
import { useParams } from "react-router-dom"
import { Container, Button, Table, Image, Spinner } from "react-bootstrap"
import { CallCourses } from "../hooks/contexts/course-context"
import evaluacion_img from '../assets/img/evaluacion.png'
import AddAssessmentModal from "../components/AddAssessmentModal"
import { useAuth } from "../hooks/contexts/auth-context"
import Swal from "sweetalert2"
import UpdateAssessmentModal from "../components/UpdateAssessmentModal"

const Assessment = () => {

    const [showAddModal, setShowAddModal] = useState(false)
    const [showUpdateModal, setShowUpdateModal] = useState(false)
    const [UpdateData, setUpdateData] = useState(null)

    const { token } = useAuth()

    const { list_evaluaciones, evaluaciones, loading, delete_assessment, porcentaje_total } = useAssessment()

    const { nombre, modalidad, programa, estado } = CallCourses()

    const { curso_id } = useParams()

    const handleDelete = async (evaluacion_id) => {
        const modal_delete = await Swal.fire({
            title: "¿Estás seguro que quieres eliminar esta evaluación?",
            icon: "warning",
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: "Si, eliminar",
            cancelButtonText: "Cancelar",
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger"
            }
        })

        if (modal_delete.isConfirmed) {
            try {

                const response = await delete_assessment(token, evaluacion_id)

                if (response) {
                    await Swal.fire({
                        title: response.message,
                        icon: "success",
                        draggable: false,
                        allowEscapeKey: false,
                        allowOutsideClick: false
                    })
                    list_evaluaciones(token)
                }

            } catch (error) {
                await Swal.fire({
                    title: error.message,
                    icon: "error",
                    draggable: false,
                    allowEscapeKey: false,
                    allowOutsideClick: false
                })
            }
        }

    }

    useEffect(() => {
        if (token) {
            list_evaluaciones(token)
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

                <p className="mt-4 fs-5 text-secondary">Cargando las evaluaciones, por favor espera...</p>
            </Container>
        )
    }

    return (
        <>
            <Container className="album py-4">
                <Container className="container">
                    <h3 className="h3"><i className="bi bi-book"></i> Gestión de evaluaciones - {nombre} - {programa} - {modalidad} - <span className={
                        estado === 'finalizado' ? 'text-danger' :
                            estado === 'activo' ? 'text-success' : 'text-warning'
                    }>{estado}</span></h3>
                    <hr />
                    <Button
                        className="btn btn-success"
                        style={{ marginBottom: '15px' }}
                        onClick={() => setShowAddModal(true)}
                        disabled={porcentaje_total === 100 || estado === 'finalizado'}
                    ><i className="bi bi-plus-lg"></i> Crear evaluación</Button>
                    {
                        evaluaciones.length > 0 ? (
                            <>
                                <Container>
                                    <h5 className="text-center mb-4">Porcentaje total de evaluaciones: {porcentaje_total}%</h5>
                                </Container>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th className='text-center'>#</th>
                                            <th className='text-center'>Nombre</th>
                                            <th className='text-center'>Descripción</th>
                                            <th className='text-center'>Porcentaje</th>
                                            <th className='text-center'>Fecha creación</th>
                                            <th className='text-center'>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            evaluaciones.map((Evaluacion) => (
                                                <tr key={Evaluacion.evaluacion_id}>
                                                    <td className='text-center'>{Evaluacion.evaluacion_id}</td>
                                                    <td className='text-center'>{Evaluacion.nombre}</td>
                                                    <td className='text-center'>{Evaluacion.descripcion}</td>
                                                    <td className='text-center'>{(Evaluacion.porcentaje) * 100}%</td>
                                                    <td className='text-center'>{new Date(Evaluacion.fecha_creacion).toISOString().split('T')[0]}</td>
                                                    <td>
                                                        <Container className="text-center">
                                                            <Button className="btn btn-warning" style={{ marginRight: '10px' }} onClick={() => {
                                                                const data = {
                                                                    evaluacion_id: Evaluacion.evaluacion_id,
                                                                    nombre: Evaluacion.nombre,
                                                                    descripcion: Evaluacion.descripcion,
                                                                    porcentaje: (Evaluacion.porcentaje) * 100
                                                                }
                                                                setUpdateData(data)
                                                                setShowUpdateModal(true)
                                                            }} disabled={estado === 'finalizado'}><i className="bi bi-pencil-square"></i> Actualizar</Button>
                                                            <Button className="btn btn-danger" onClick={() => handleDelete(Evaluacion.evaluacion_id)} disabled={estado === 'finalizado'}><i className="bi bi-trash3"></i> Eliminar</Button>
                                                        </Container>
                                                    </td>
                                                </tr>
                                            ))
                                        }

                                    </tbody>
                                </Table>
                            </>
                        ) : (
                            <Container className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
                                <Image src={evaluacion_img} className="display-1 text-secondary mb-4" style={{ height: '200px', width: '200px' }} />
                                <h3 className="text-muted mb-3">¡Vaya! Parece que este curso no tiene evaluaciones.</h3>
                                <p className="text-center text-secondary mb-4">Crea una evaluación para empezar.</p>
                            </Container>
                        )
                    }

                </Container>
            </Container>

            <AddAssessmentModal showModal={showAddModal} setShowModal={() => setShowAddModal(false)} list_evaluaciones={list_evaluaciones} token={token} />
            <UpdateAssessmentModal showModal={showUpdateModal} setShowModal={() => setShowUpdateModal(false)} UpdateData={UpdateData} token={token} list_evaluaciones={list_evaluaciones} />
        </>
    )
}

export default Assessment