import { useEffect, useState } from "react"
import { Modal, Form, Container, Button } from "react-bootstrap"
import useAssessment from "../hooks/use-assessment"
import Swal from "sweetalert2"

const UpdateAssessmentModal = ({ showModal, setShowModal, UpdateData, token, list_evaluaciones }) => {

    const [error, setError] = useState(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [percent, setPercent] = useState(0)
    const [evaluacion_id, setEvaluacion_id] = useState("")

    const { update_assessment } = useAssessment()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsProcessing(true)
        setError(null)

        const Data = {
            evaluacion_id: evaluacion_id,
            nombre: name,
            descripcion: description,
            porcentaje: percent
        }

        try {

            const response = await update_assessment(token, Data)

            if (response) {
                await Swal.fire({
                    title: response.message,
                    icon: "success",
                    draggable: false,
                    allowEscapeKey: false,
                    allowOutsideClick: false
                })
                setIsProcessing(false)
                setShowModal()
                ClearForm()
                list_evaluaciones(token)
            }

        } catch (error) {
            setError(error.message || 'Hubo un error al actualizar la evaluación')
            setIsProcessing(false)
        }
    }

    const ClearForm = () => {
        setDescription("")
        setName("")
        setPercent(0)
        setEvaluacion_id("")
    }

    useEffect(() => {
        if (UpdateData) {
            setName(UpdateData.nombre || "")
            setDescription(UpdateData.descripcion || "")
            setPercent(UpdateData.porcentaje || 0)
            setEvaluacion_id(UpdateData.evaluacion_id || "")
        }

    }, [UpdateData])

    return (
        <>
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
                    <Modal.Title><i className="bi bi-pencil-square"></i> Actualizar evaluación</Modal.Title>
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

                                <Form.Group className="mb-3" controlId="formBasicforNameAssessment">
                                    <Form.Label><i className="bi bi-journal"></i> Nombre</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ingrese el nombre de la evaluación"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formBasicforDescriptionAssessment">
                                    <Form.Label><i className="bi bi-journal-text"></i> Descripción</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ingrese la descripción de la evaluación"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formBasicforPercentAssessment">
                                    <Form.Label><i className="bi bi-percent"></i> Porcentaje</Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="0.01"
                                        placeholder="Ingrese el valor porcentual de la evaluación"
                                        value={percent === null || percent === undefined ? '' : percent}
                                        onChange={(e) => {
                                            const value = e.target.value
                                            setPercent(value === '' ? '' : parseFloat(value))
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
        </>
    )
}

export default UpdateAssessmentModal