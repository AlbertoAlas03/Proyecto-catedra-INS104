import { useEffect, useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import useLanguage from '../hooks/use-language';
import Swal from 'sweetalert2';

const UpdateLanguageModal = ({ showModal, setShowModal, updateData, token, list_idiomas, setUpdateData, setsearch, setisSearching, setLanguageSelected, setidiomaID }) => {

    const [error, setError] = useState(null)
    const [isProcessing, setisProcessing] = useState(false)
    const [name, setName] = useState('')
    const [idioma_id, setIdioma_id] = useState('')

    const { update_idioma } = useLanguage()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setisProcessing(true)
        setError(null)

        const data = {
            idioma_id: idioma_id,
            nombre: name
        }

        try {

            const response = await update_idioma(token, data)

            if (response) {
                await Swal.fire({
                    title: response.message,
                    icon: "success",
                    draggable: false,
                    allowOutsideClick: false,
                    allowEscapeKey: false
                })
                setisProcessing(false)
                clearForm()
                setShowModal(false)
                list_idiomas(token)
                setsearch(null)
                setisSearching(false)
                setLanguageSelected(null)
                setidiomaID('')
            }
        } catch (error) {
            setError(error.message || 'Error en el servidor')
            setisProcessing(false)
        }
    }

    const clearForm = () => {
        setName('')
        setIdioma_id('')
        setUpdateData([])
    }

    useEffect(() => {
        if (updateData) {
            setName(updateData.nombre || 'Sin nombre')
            setIdioma_id(updateData.idioma_id || 'sin id')
        }
    }, [updateData])

    return (
        <Modal
            show={showModal}
            onHide={() => {
                clearForm()
                setShowModal(false)
                setError(null)
            }}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title><i className="bi bi-pencil-square" style={{ fontSize: '30px' }}></i> Actualizar idioma</Modal.Title>
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

                            <Form.Group className="mb-3" controlId="formBasicName">
                                <Form.Label><i className="bi bi-translate"></i> Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Nombre del idioma"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </Form.Group>

                        </div>

                        <hr />

                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="warning" type="submit">
                                <i className="bi bi-pencil-square"></i> Actualizar
                            </Button>
                            <Button variant="danger" onClick={() => {
                                clearForm()
                                setShowModal(false)
                                setError(null)
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

export default UpdateLanguageModal