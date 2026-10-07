import { useEffect, useState } from "react"
import { Modal, Form, Container, Button } from "react-bootstrap"
import useUser from "../hooks/use-user"
import Swal from "sweetalert2"

const UpdateAccountModal = ({ showModal, setShowModal, updateData, token }) => {

    const { update } = useUser()

    const [error, setError] = useState(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [name, setName] = useState('')
    const [last_name, setLast_name] = useState('')
    const [user_id, setUser_id] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsProcessing(true)
        setError(null)

        const data = {
            usuario_id: user_id,
            nombre: name,
            apellido: last_name
        }

        try {

            const response = await update(token, data)

            if (response) {
                await Swal.fire({
                    title: response.message,
                    icon: 'success',
                    allowEscapeKey: false,
                    allowOutsideClick: false
                })
                setIsProcessing(false)
                setShowModal()
            }

        } catch (error) {
            setError(error.message || 'Ocurrio un error al actualuzar su perfil')
            setIsProcessing(false)
        }
    }

    const ClearForm = () => {
        setName('')
        setLast_name('')
    }

    useEffect(() => {
        if (updateData) {
            setUser_id(updateData.usuario_id || '')
            setName(updateData.nombre || '')
            setLast_name(updateData.apellido || '')
        }
    }, [updateData])

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
                <Modal.Title><i className="bi bi-pencil-square"></i> Actualizar perfil</Modal.Title>
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

                            <Form.Group className="mb-3" controlId="formBasicforNameAccount">
                                <Form.Label><i className="bi bi-file-person"></i> Nombres</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingrese sus nombres"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicforLastNameAccount">
                                <Form.Label><i className="bi bi-file-person"></i> Apellidos</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingrese sus apellidos"
                                    value={last_name}
                                    onChange={(e) => setLast_name(e.target.value)}
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

export default UpdateAccountModal