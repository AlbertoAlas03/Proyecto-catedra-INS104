import { useEffect, useState } from "react"
import UseGrade from "../hooks/use-grade"
import { Container, Modal, Table, Button, Image, Spinner } from "react-bootstrap"
import notas_img from '../assets/img/plan-de-estudios.png'
import { CallCourses } from "../hooks/contexts/course-context"
import GradeModal from "./GradeModal"
import UpdateGradeModal from "./UpdateGradeModal"

const GradesModal = ({ showModal, setShowModal, token, estudiante }) => {

    const [showGradeModal, setShowGradeModal] = useState(false)
    const [showUpdateGradeModal, setShowUpdateGradeModal] = useState(false)
    const [updateData, setUpdateData] = useState(null)

    const { list_notas, notas, loading, nota_final, update_nota } = UseGrade()

    const { estado } = CallCourses()

    useEffect(() => {
        list_notas(token, estudiante.estudiante_id)
    }, [])

    const update_data = (nota_id, evaluacion_id, estudiante_id, puntaje_obtenido) => {

        const data = {
            nota_id: nota_id,
            evaluacion_id: evaluacion_id,
            estudiante_id: estudiante_id,
            puntaje_obtenido: puntaje_obtenido
        }

        setUpdateData(data)
        setShowUpdateGradeModal(true)
    }

    return (
        <>
            <Modal
                show={showModal}
                onHide={() => setShowModal()}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                backdrop="static"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        <i className="bi bi-book"></i> Notas
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <h5 className="text-center mb-4"><i className="bi bi-person" style={{ fontSize: '30px' }}></i> Notas del estudiante: <strong>{estudiante.name} {estudiante.last_name}</strong></h5>
                        <Container className="d-flex justify-content-between align-items-center">
                            <Button
                                style={{ marginBottom: '20px' }}
                                className="btn btn-success"
                                onClick={() => setShowGradeModal(true)}
                                disabled={
                                    estado === 'finalizado' || estado === 'no iniciado'
                                }><i className="bi bi-plus"></i> Agregar nota</Button>
                            {
                                notas.length !== 0 && (
                                    <div className="text-end" style={{ fontSize: '20px' }}><span className={nota_final >= 6 ? 'badge text-bg-success' : 'badge text-bg-danger'}>{nota_final >= 6 ? 'Aprobado' : 'Reprobado'}</span> Nota final: <strong style={{ textDecoration: 'underline' }}>{nota_final}</strong></div>
                                )
                            }

                        </Container>
                        {
                            loading ? (
                                <Container
                                    fluid
                                    className="d-flex flex-column justify-content-center align-items-center"
                                    style={{ background: '#f5f7fa' }}
                                >
                                    <Spinner animation="border" variant="primary" role="status" style={{ width: '4rem', height: '4rem' }} />

                                    <p className="mt-4 fs-5 text-secondary">Cargando notas del estudiante, por favor espera...</p>
                                </Container>
                            ) : (
                                notas.length > 0 ? (
                                    <Table striped bordered hover>
                                        <thead>
                                            <tr className="text-center">
                                                <th>Evaluación</th>
                                                <th>Porcentaje</th>
                                                <th>Puntaje obtenido</th>
                                                <th>Nota final</th>
                                                <th>Acción</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {notas.map((nota) => (
                                                <tr key={nota.nota_id} className="text-center">
                                                    <td>{nota.evaluacion.nombre}</td>
                                                    <td>{(nota.evaluacion.porcentaje) * 100}%</td>
                                                    <td>{nota.puntaje_obtenido}</td>
                                                    <td>{nota.nota_final}</td>
                                                    <td>
                                                        <Container className="text-center">
                                                            <Button className="btn btn-warning" onClick={() =>
                                                                update_data(nota.nota_id, nota.evaluacion.evaluacion_id, nota.estudiante.usuario_id, nota.puntaje_obtenido)
                                                            } disabled={estado === 'finalizado' || estado === 'no iniciado'}><i className="bi bi-pencil-square"></i> Actualizar</Button>
                                                        </Container>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                ) : (
                                    <Container className="d-flex flex-column justify-content-center align-items-center">
                                        <Image src={notas_img} className="display-1 text-secondary mb-4" style={{ height: '100px', width: '100px' }} />
                                        <h4 className="text-muted mb-3">¡Vaya! Parece que este estudiante no tiene notas registradas.</h4>
                                        <p className="text-center text-secondary mb-4">Agrega una nota al estudiante para empezar.</p>
                                    </Container>
                                )
                            )

                        }
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setShowModal()} className="btn btn-danger"><i className="bi bi-x"></i> Cerrar</Button>
                </Modal.Footer>
            </Modal>
            {
                showGradeModal && (
                    <GradeModal showModal={showGradeModal} setShowModal={() => setShowGradeModal(false)} estudiante={estudiante} token={token} list_notas={list_notas} />
                )
            }
            {
                showUpdateGradeModal && (
                    <UpdateGradeModal showModal={showUpdateGradeModal} setShowModal={() => setShowUpdateGradeModal(false)} updateData={updateData} token={token} list_notas={list_notas} />
                )
            }

        </>
    )
}

export default GradesModal