import { useState } from "react"
import { Modal, Form, Button } from "react-bootstrap"
import useChangePassword from "../hooks/use-change-password"
import Swal from "sweetalert2"

const ChangePasswordModal = ({ showModal, setShowModal, user, token }) => {

    const [error, setError] = useState(null)
    const [isProcessing, setisProcessing] = useState(false)
    const [newPassword, setnewPassword] = useState('')
    const [confirm_password, setconfirm_password] = useState('')
    const [code, setcode] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setshowConfirmPassword] = useState(false)

    const { change_password, cancel_change } = useChangePassword()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setisProcessing(true)
        setError(null)

        const data = {
            email: user.email,
            code: code,
            password: newPassword,
            confirm_password: confirm_password
        }

        try {

            const response = await change_password(token, data)

            if (response) {

                await Swal.fire({
                    title: response.message,
                    icon: "success",
                    draggable: false,
                    allowEscapeKey: false,
                    allowOutsideClick: false
                })
                setisProcessing(false)
                setShowModal(false)
                clearForm()
            }
        } catch (error) {

            setError(error.message || 'Error al enviar los datos')
            setisProcessing(false)
        }
    }

    const handleCancelChange = async () => {

        setError(null)

        const modal_confirm = await Swal.fire({
            title: '¿Estas seguro de cancelar el cambio de contraseña?',
            icon: 'question',
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

        if (modal_confirm.isConfirmed) {

            setisProcessing(true)

            try {

                const response = await cancel_change(token, user.email)

                if (response) {
                    await Swal.fire({
                        title: response.message,
                        icon: 'success',
                        draggable: false,
                        allowEscapeKey: false,
                        allowOutsideClick: false
                    })
                    clearForm()
                    setisProcessing(false)
                    setShowModal(false)
                }
            } catch (error) {

                alert(error.message || 'No se pudo cancelar el cambio de contraseña')
            }
        }
    }

    const togglePasswordVisibility = (e) => {
        e.preventDefault();
        setShowPassword(!showPassword)
    }

    const togglePasswordConfirmVisibility = (e) => {
        e.preventDefault();
        setshowConfirmPassword(!showConfirmPassword)
    }

    const clearForm = () => {
        setnewPassword('')
        setconfirm_password('')
        setcode('')
    }

    return (
        <Modal
            show={showModal}
            onHide={() => {
                handleCancelChange()
            }}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title><i className="bi bi-key" style={{ fontSize: '30px' }}></i> Cambiar contraseña</Modal.Title>
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

                            <Form.Group className="mb-3" controlId="formBasicChangePassword">
                                <Form.Label><i className="bi bi-lock"></i> Nueva contraseña</Form.Label>
                                <div className="input-group">
                                    <Form.Control
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Ingrese su nueva contraseña"
                                        value={newPassword}
                                        onChange={(e) => setnewPassword(e.target.value)}
                                    />
                                    <button className="input-group-text" onClick={togglePasswordVisibility}><i className={showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'}></i></button>
                                </div>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicChangePasswordConfirm">
                                <Form.Label><i className="bi bi-lock"></i> Confirmar contraseña</Form.Label>
                                <div className="input-group">
                                    <Form.Control
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="Confirme su nueva contraseña"
                                        value={confirm_password}
                                        onChange={(e) => setconfirm_password(e.target.value)}
                                    />
                                    <button className="input-group-text" onClick={togglePasswordConfirmVisibility}><i className={showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'}></i></button>
                                </div>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicCode">
                                <Form.Label><i className="bi bi-shield-lock"></i> Código de verificación</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Ingrese el codigo de verificación"
                                    value={code}
                                    onChange={(e) => setcode(e.target.value)}
                                />
                            </Form.Group>

                        </div>

                        <hr />

                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="success" type="submit">
                                <i className="bi bi-check-lg"></i> Cambiar contraseña
                            </Button>
                            <Button variant="danger" onClick={() =>
                                handleCancelChange()
                            }>
                                <i className="bi bi-x"></i> Cancelar
                            </Button>
                        </div>
                    </fieldset>
                </Form>

            </Modal.Body>
        </Modal >
    )
}

export default ChangePasswordModal