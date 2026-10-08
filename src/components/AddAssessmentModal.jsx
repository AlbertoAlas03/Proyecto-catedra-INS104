import { useState } from "react";
import { Modal, Button, Form, Container } from "react-bootstrap"
import useAssessment from "../hooks/use-assessment";
import Swal from "sweetalert2";

const AddAssessmentModal = ({ showModal, setShowModal, list_evaluaciones, token }) => {

    const [error, setError] = useState(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [percent, setPercent] = useState(0)

    const { create_assessment } = useAssessment()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsProcessing(true)
        setError(null)

        const assessmentData = {
            nombre: name,
            descripcion: description,
            porcentaje: percent
        }

        try {

            const response = await create_assessment(assessmentData, token)

            if (response) {
                await Swal.fire({
                    title: response.message,
                    icon: "success",
                    draggable: false,
                    allowEscapeKey: false,
                    allowOutsideClick: false
                })
                setIsProcessing(false)
                ClearForm()
                setShowModal()
                list_evaluaciones(token)
            }

        } catch (error) {
            setError(error.message || "Hubo un error al crear la evaluación")
            setIsProcessing(false)
        }
    }

    const ClearForm = () => {
        setDescription("")
        setName("")
        setPercent(0)
    }

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
                    <Modal.Title><i className="bi bi-journal-plus"></i> Crear evaluación</Modal.Title>
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
                                            const newValue = e.target.value;
                                            setPercent(newValue === '' ? '' : parseFloat(newValue));
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
    );
}

export default AddAssessmentModal