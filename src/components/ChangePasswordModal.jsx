import { useState } from "react"
import { Modal, Form, Container, Button, InputGroup } from "react-bootstrap"
import useChangePassword from "../hooks/use-change-password"
import Swal from "sweetalert2"
import { useNavigate } from "react-router-dom"

const ChangePasswordModal = ({ showModal, setShowModal, email, setEmail, setLoading }) => {

    const { changePassword, cancelChange } = useChangePassword()

    const navigate = useNavigate()

    const [error, setError] = useState(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [code, setCode] = useState('')
    const [seePassword, setSeePassword] = useState(false)
    const [seeConfirmPassword, setseeConfirmPassword] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsProcessing(true)
        setError(null)

        const data = {
            email: email,
            code: code,
            password: password,
            confirm_password: confirmPassword
        }

        try {

            const response = await changePassword(data)

            if (response) {
                await Swal.fire({
                    title: response.message,
                    icon: "success",
                    allowEscapeKey: false,
                    allowOutsideClick: false
                });
                actions()
                navigate('/', { replace: true })
            }

        } catch (error) {
            setError(error.message || 'Hubo un error al cambiar la contraseña')
            setIsProcessing(false)
        }
    }

    const handleCancelChange = async () => {

        const modal = await Swal.fire({
            title: '¿Estás seguro que deseas cancelar el cambio de contraseña?',
            icon: 'info',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
            allowEscapeKey: false,
            allowOutsideClick: false,
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            }
        })

        if (modal.isConfirmed) {
            setIsProcessing(true)
            setError(null)
            try {

                const response = await cancelChange(email)

                if (response) {
                    await Swal.fire({
                        title: response.message,
                        icon: "success",
                        allowEscapeKey: false,
                        allowOutsideClick: false
                    })
                    actions()
                }

            } catch (error) {

                await Swal.fire({
                    title: error.message || 'Hubo un error al cancelar el cambio de contraseña',
                    icon: 'error',
                    allowOutsideClick: false,
                    allowEscapeKey: false
                })
                setIsProcessing(false)
            }
        }
    }

    const handleSeePassword = () => {
        setSeePassword(!seePassword)
    }

    const handleSeeConfirmPassword = () => {
        setseeConfirmPassword(!seeConfirmPassword)
    }

    const ClearForm = () => {
        setPassword('')
        setConfirmPassword('')
        setCode('')
        setEmail('')
    }

    const actions = () => {
        setShowModal()
        ClearForm()
        setIsProcessing(false)
        setLoading(false)
    }

    return (
        <Modal
            show={showModal}
            onHide={() => handleCancelChange()}
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

                            <Form.Group className="mb-4">
                                <Form.Label><i className="bi bi-lock"></i> Nueva contraseña</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type={seePassword ? 'text' : 'password'}
                                        placeholder="Ingrese la nueva contraseña"
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

                            <Form.Group className="mb-4">
                                <Form.Label><i className="bi bi-lock"></i> Confirmar contraseña</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type={seeConfirmPassword ? 'text' : 'password'}
                                        placeholder="Ingrese nuevamente la nueva contraseña"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                    <Button variant="outline-success" onClick={(e) => handleSeeConfirmPassword(e)}>
                                        {
                                            seeConfirmPassword ? (
                                                <i className="bi bi-eye-slash"></i>
                                            ) : (
                                                <i className="bi bi-eye"></i>
                                            )
                                        }

                                    </Button>
                                </InputGroup>

                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicforLastNameAccount">
                                <Form.Label><i className="bi bi-shield-lock"></i> Codigo de verificación</Form.Label>
                                <Form.Control
                                    type="text"
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