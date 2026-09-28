import { useState } from "react"
import useLanguage from "../hooks/use-language"
import { Button, Modal, Form } from 'react-bootstrap';
import Swal from "sweetalert2"

const AddLanguageModal = ({ showModal, setShowModal, list_idiomas, token, setsearch, setisSearching, setLanguageSelected, setidiomaID }) => {

    const [language, setLanguage] = useState('')
    const [error, setError] = useState(null)
    const [isProcessing, setIsProcessing] = useState(false)

    const { add_idioma } = useLanguage()

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true)
        setError(null)

        try {

            const response = await add_idioma(token, language)

            if (response) {
                await Swal.fire({
                    title: response.message,
                    icon: "success",
                    draggable: false,
                    allowOutsideClick: false,
                    allowEscapeKey: false
                })
                setIsProcessing(false)
                setShowModal(false)
                clearAll()
                list_idiomas(token)
                setsearch(null)
                setisSearching(false)
                setLanguageSelected(null)
                setidiomaID('')
            }
        } catch (error) {

            setError(error.message || 'Error al registrar el usuario')
            setIsProcessing(false)

        }

    }

    const clearAll = () => {
        setLanguage('')
    }

    return (
        <Modal
            show={showModal}
            onHide={() => {
                setShowModal(false)
                setError(null)
                clearAll()
            }}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title><i className="bi bi-translate" style={{ fontSize: '30px' }}></i> Registrar nuevo idioma</Modal.Title>
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
                        <div className="row">

                            <Form.Group className="mb-3" controlId="formBasicNameLanguage">
                                <Form.Label><i className="bi bi-translate"></i> Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Nombre del idioma"
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                />
                            </Form.Group>

                        </div>

                        <hr />

                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="success" type="submit">
                                <i className="bi bi-check-lg"></i> Registrar
                            </Button>
                            <Button variant="danger" onClick={() => {
                                setShowModal(false)
                                setError(null)
                                clearAll()
                            }}>
                                <i className="bi bi-x"></i> Cancelar
                            </Button>
                        </div>
                    </fieldset>
                </Form>

            </Modal.Body>
        </Modal >
    )
}

export default AddLanguageModal