import { useState } from "react"
import { Modal, Form, Container, Button, InputGroup } from "react-bootstrap"
import useChangePassword from "../hooks/use-change-password"
import Swal from "sweetalert2"

const ChangePasswordModal = ({ showModal, setShowModal, token, email }) => {

    const [error, setError] = useState(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [password, setPassword] = useState('')
    const [confirm_password, setConfirm_password] = useState('')
    const [code, setCode] = useState('')
    const [seePassword, setseePassword] = useState(false)
    const [seePasswordConfirm, setSeePasswordConfirm] = useState(false)

    const { changePassword, cancelChange } = useChangePassword()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsProcessing(true)
        setError(null)

        const data = {
            email: email,
            code: code,
            password: password,
            confirm_password: confirm_password
        }

        try {

            const response = await changePassword(token, data)

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
            }
        } catch (error) {
            setError(error.message || 'Hubo un error al cambiar la contraseña')
            setIsProcessing(false)
        }
    }

    const handleCancelChange = async () => {
        const modal = await Swal.fire({
            icon: 'question',
            title: '¿Estás seguro que quieres cancelar el cambio de contraseña?',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
            allowEscapeKey: false,
            allowOutsideClick: false,
            customClass: {
                confirmButton: 'btn btn-warning',
                cancelButton: 'btn btn-danger'
            }
        })

        if (modal.isConfirmed) {

            setIsProcessing(true)

            try {

                const response = await cancelChange(token, email)

                if (response) {
                    await Swal.fire({
                        title: response.message,
                        icon: "success",
                        draggable: false,
                        allowEscapeKey: false,
                        allowOutsideClick: false
                    })
                    ClearForm()
                    setError(null)
                    setIsProcessing(false)
                    setShowModal()
                }

            } catch (error) {
                await Swal.fire({
                    title: error.message,
                    icon: "error",
                    draggable: false,
                    allowEscapeKey: false,
                    allowOutsideClick: false
                })
                setIsProcessing(false)
            }
        }
    }

    const handleSeePassword = (e) => {
        e.preventDefault()
        setseePassword(!seePassword)
    }

    const handleSeePasswordConfirm = (e) => {
        e.preventDefault()
        setSeePasswordConfirm(!seePasswordConfirm)
    }

    const ClearForm = () => {
        setCode('')
        setConfirm_password('')
        setPassword('')
    }

    return (
        <Modal
            show={showModal}
            onHide={() =>
                handleCancelChange()
            }
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title><i className="bi bi-key"></i> Cambiar contraseña</Modal.Title>
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

                            <Form.Group className="mb-3" controlId="formBasicforChangePassword">
                                <Form.Label><i className="bi bi-lock"></i> Nueva contraseña</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type={seePassword ? 'text' : 'password'}
                                        placeholder="Ingrese su nueva contraseña"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <Button variant="outline-success" onClick={(e) => handleSeePassword(e)}>
                                        {
                                            seePassword ? (
                                                <i className="bi bi-eye-slash"></i>
                                            ) : (
                                                <i className="bi bi-eye"></i>
                                            )
                                        }

                                    </Button>
                                </InputGroup>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicforConfirmPassword">
                                <Form.Label><i className="bi bi-lock"></i> Confirmar contraseña</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type={seePasswordConfirm ? 'text' : 'password'}
                                        placeholder="Ingrese nuevamente su nueva contraseña"
                                        value={confirm_password}
                                        onChange={(e) => setConfirm_password(e.target.value)}
                                    />
                                    <Button variant="outline-success" onClick={(e) => handleSeePasswordConfirm(e)}>
                                        {
                                            seePasswordConfirm ? (
                                                <i className="bi bi-eye-slash"></i>
                                            ) : (
                                                <i className="bi bi-eye"></i>
                                            )
                                        }

                                    </Button>
                                </InputGroup>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicforCode">
                                <Form.Label><i className="bi bi-shield-lock"></i> Codigo de verificación</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Ingrese el codigo de verificación"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                />
                            </Form.Group>

                        </Container>
                        <hr />
                        <Container className="d-flex justify-content-end gap-2">
                            <Button variant="danger" onClick={() => handleCancelChange()}>
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

export default ChangePasswordModal