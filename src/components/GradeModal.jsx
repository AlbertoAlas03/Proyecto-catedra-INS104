import { Modal, Button, Form, Container } from "react-bootstrap"
import { CallAssessment } from "../hooks/contexts/assessment-context"
import { useState } from "react"
import Select from "react-select"
import UseGrade from "../hooks/use-grade"
import Swal from "sweetalert2"
import { useParams } from "react-router-dom"

const GradeModal = ({ showModal, setShowModal, estudiante, token, list_notas }) => {

    const [error, setError] = useState(null)
    const [isProcessing, setisProcessing] = useState(false)
    const [puntaje, setPuntaje] = useState(0)
    const [AssessmentSelected, setAssessmentSelected] = useState(null)
    const [evaluacion_id, setEvaluacion_id] = useState('')

    const { curso_id } = useParams()

    const { add_nota } = UseGrade()

    const { assessment } = CallAssessment()

    const optionsAssessment = assessment.map((a) => ({
        value: a.evaluacion_id,
        label: `${a.nombre}`
    }));

    const handleChangeAssessment = (AssessmentSelected) => {

        setAssessmentSelected(AssessmentSelected)
        setEvaluacion_id(AssessmentSelected ? AssessmentSelected.value : '')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setisProcessing(true)

        const data = {
            evaluacion_id: evaluacion_id,
            estudiante_id: estudiante.estudiante_id,
            curso_id: curso_id,
            puntaje_obtenido: puntaje,
            email: estudiante.email
        }

        try {

            const response = await add_nota(token, data)

            if (response) {
                await Swal.fire({
                    title: response.message,
                    icon: "success",
                    draggable: false,
                    allowEscapeKey: false,
                    allowOutsideClick: false
                })
                setisProcessing(false)
                ClearForm()
                setShowModal()
                list_notas(token, estudiante.estudiante_id)
            }

        } catch (error) {
            setError(error.message || 'Hubo un error al registrar la nota')
            setisProcessing(false)
        }
    }

    const ClearForm = () => {
        setPuntaje(0)
        setEvaluacion_id('')
        setAssessmentSelected(null)
    }

    return (
        <Modal
            show={showModal}
            onHide={() => {
                setShowModal()
                setError(null)
                ClearForm()
            }}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title><i className="bi bi-journal-plus"></i> Agregar nota</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    {error && (
                        <div className="alert alert-danger d-flex align-items-center" role="alert">
                            <button className="me-2" style={{ background: 'transparent', border: 'none' }} onClick={() => setError(null)}>
                                <i className="bi bi-x-circle-fill"></i>
                            </button>
                            {error}
                        </div>
                    )}
                    {isProcessing && (
                        <div className="alert alert-info d-flex align-items-center" role="alert">
                            <i className="bi bi-hourglass-split me-2"></i>
                            Procesando, por favor espere...
                        </div>
                    )}
                    <fieldset disabled={isProcessing}>
                        <Container className="row">

                            <Form.Group className="mb-3" controlId="formBasicforEvaluacion">
                                <Form.Label><i className="bi bi-journal"></i> Evaluación</Form.Label>
                                <Select
                                    className="w-100"
                                    options={optionsAssessment}
                                    value={AssessmentSelected}
                                    onChange={handleChangeAssessment}
                                    placeholder="Seleccionar una evaluación..."
                                    isClearable
                                    noOptionsMessage={() => 'No hay coincidencias'}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicforPuntaje">
                                <Form.Label><i className="bi bi-pencil"></i> Puntaje obtenido</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="0.0"
                                    value={puntaje === null || puntaje === undefined ? '' : puntaje}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setPuntaje(value === '' ? '' : parseFloat(value));
                                    }}
                                />
                            </Form.Group>

                        </Container>
                        <hr />
                        <Container className="d-flex justify-content-end gap-2">
                            <Button variant="danger" onClick={() => {
                                setShowModal()
                                setError(null)
                                ClearForm()
                            }}>
                                <i className="bi bi-x"></i> Cancelar
                            </Button>
                            <Button variant="success" type="submit"><i className="bi bi-check-lg"></i> Aceptar</Button>
                        </Container>
                    </fieldset>
                </Form>
            </Modal.Body>
        </Modal>
    )
}

export default GradeModal