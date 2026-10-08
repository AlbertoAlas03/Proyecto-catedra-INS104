import { useEffect, useState } from "react"
import { Modal, Form, Button, Container } from "react-bootstrap"
import Select from "react-select"
import { CallAssessment } from "../hooks/contexts/assessment-context"
import { useMemo } from "react"
import UseGrade from "../hooks/use-grade"
import Swal from "sweetalert2"

const UpdateGradeModal = ({ showModal, setShowModal, updateData, token, list_notas }) => {

    const [error, setError] = useState(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [puntaje, setPuntaje] = useState(0)
    const [AssesmentSelected, setAssessmentSelected] = useState([])
    const [nota_id, setNota_id] = useState('')
    const [estudiante_id, setEstudiante_id] = useState('')
    const [selectedAssessmentId, setSelectedAssessmentId] = useState('')

    const { update_nota } = UseGrade()

    const { assessment } = CallAssessment()

    const optionsAssessment = useMemo(() =>
        assessment.map((a) => ({
            value: a.evaluacion_id,
            label: `${a.nombre}`
        })),
        [assessment]);

    const handleChangeAssessment = (AssessmentSelected) => {

        setAssessmentSelected(AssessmentSelected)
        setSelectedAssessmentId(AssessmentSelected ? AssessmentSelected.value : '')
    }

    const clearForm = () => {
        setPuntaje(0)
        setAssessmentSelected([])
        setSelectedAssessmentId('')
        setEstudiante_id('')
        setNota_id('')
    }

    const handleSubmit = async (e) => {

        e.preventDefault()

        const modal = await Swal.fire({
            icon: 'warning',
            title: '¿Estás seguro de actualizar esta nota?',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            },
            allowEscapeKey: false,
            allowOutsideClick: false
        })

        if (modal.isConfirmed) {

            setIsProcessing(true)
            setError(null)

            const data = {
                nota_id: nota_id,
                evaluacion_id: selectedAssessmentId,
                estudiante_id: estudiante_id,
                puntaje_obtenido: puntaje
            }

            try {

                const response = await update_nota(token, data)

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
                    clearForm()
                    list_notas(token, estudiante_id)
                }
            } catch (error) {
                setError(error.message || 'hubo un error al actualizar la nota')
                setIsProcessing(false)
            }
        }

    }


    useEffect(() => {
        if (updateData) {
            setPuntaje(updateData.puntaje_obtenido || 0.0)
            setSelectedAssessmentId(updateData.evaluacion_id || '')
            setEstudiante_id(updateData.estudiante_id || '')
            setNota_id(updateData.nota_id || '')
        }
    }, [updateData])

    useEffect(() => {
        if (selectedAssessmentId && optionsAssessment.length > 0) {
            const assessmentObj = optionsAssessment.find(option => option.value === selectedAssessmentId);
            setAssessmentSelected(assessmentObj || null);
        }
    }, [selectedAssessmentId, optionsAssessment])

    return (
        <Modal
            show={showModal}
            onHide={() => {
                setError(null)
                setShowModal()
                clearForm()
            }
            }
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title><i className="bi bi-pencil-square" style={{ fontSize: '30px' }}></i> Actualizar nota</Modal.Title>
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

                            <Form.Group className="mb-3" controlId="formBasicEvaluacionEdit">
                                <Form.Label><i className="bi bi-journal"></i> Evaluación</Form.Label>
                                <Select
                                    className="w-100"
                                    options={optionsAssessment}
                                    value={AssesmentSelected}
                                    onChange={handleChangeAssessment}
                                    placeholder="Seleccionar una evaluación..."
                                    isClearable
                                    noOptionsMessage={() => 'No hay coincidencias'}
                                />
                            </Form.Group>


                            <Form.Group className="mb-3" controlId="formBasicpuntajeobtenidoEdit">
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

                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="warning" type="submit">
                                <i className="bi bi-pencil-square"></i> Actualizar
                            </Button>
                            <Button variant="danger" onClick={() => {
                                clearForm()
                                setShowModal()
                                setError(null)
                            }}>
                                <i className="bi bi-x"></i> Cancelar
                            </Button>
                        </div>
                    </fieldset>
                </Form>
            </Modal.Body>
        </Modal>
    )
}

export default UpdateGradeModal