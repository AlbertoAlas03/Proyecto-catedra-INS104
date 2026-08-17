import { useEffect, useState } from "react"
import { Modal, Form, Button } from "react-bootstrap"
import useUser from "../hooks/use-user"
import Swal from "sweetalert2"

const UpdateDataUserModal = ({ showModal, updateData, setShowModal, token }) => {

    const [error, setError] = useState(null)
    const [isProcessing, setisProcessing] = useState(false)
    const [name, setName] = useState('')
    const [last_name, setLast_name] = useState('')
    const [email, setEmail] = useState('')
    const [UsuarioID, setUsuarioID] = useState('')

    const { update_account } = useUser()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setisProcessing(true)
        setError(null)

        const data = {
            usuario_id: UsuarioID,
            nombre: name,
            apellido: last_name,
            email: email
        }

        try {
            const response = await update_account(token, data)

            if (response) {
                await Swal.fire({
                    title: response.message,
                    icon: "success",
                    draggable: false,
                    allowOutsideClick: false,
                    allowEscapeKey: false
                })
                ClearForm()
                setShowModal(false)
                setisProcessing(false)
            }
        } catch (error) {

            setError(error.message || 'Error al actualizar')
            setisProcessing(false)
        }
    }

    const ClearForm = () => {
        setUsuarioID('')
        setName('')
        setLast_name('')
        setEmail('')
    }

    useEffect(() => {
        if (updateData) {
            setName(updateData.nombre || '')
            setEmail(updateData.email || '')
            setUsuarioID(updateData.usuario_id || '')
            setLast_name(updateData.apellido || '')
        }
    }, [updateData])

    return (
        <Modal
            show={showModal}
            onHide={() => {
                setError(null)
                ClearForm()
                setShowModal(false)
            }}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title><i className="bi bi-pencil-square" style={{ fontSize: '30px' }}></i> Actualizar tu usuario</Modal.Title>
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

                            <Form.Group className="mb-3" controlId="formBasicNamenewUser">
                                <Form.Label><i className="bi bi-person"></i> Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingresa tu nombre"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicLastNameNewUser">
                                <Form.Label><i className="bi bi-person-badge"></i> Apellido</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingresa tu apellido"
                                    value={last_name}
                                    onChange={(e) => setLast_name(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicEmailNewUser">
                                <Form.Label><i className="bi bi-envelope-at"></i> Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Ingresa tu nuevo correo eléctronico"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Form.Group>
                        </div>

                        <hr />

                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="warning" type="submit">
                                <i className="bi bi-pencil-square"></i> Actualizar
                            </Button>
                            <Button variant="danger" onClick={() => {
                                setError(null)
                                ClearForm()
                                setShowModal(false)
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

export default UpdateDataUserModal