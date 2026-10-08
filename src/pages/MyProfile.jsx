import { Button, Container } from "react-bootstrap"
import { useAuth } from '../hooks/contexts/auth-context'
import { useState } from "react"
import UpdateAccountModal from "../components/UpdateAccountModal"
import Swal from "sweetalert2"
import useChangePassword from "../hooks/use-change-password"
import ChangePasswordModal from "../components/ChangePasswordModal"

const MyProfile = () => {

    const [isProcessing, setIsProcessing] = useState(false)
    const [showUpdateModal, setShowUpdateModal] = useState(false)
    const [updateData, setUpdateData] = useState(null)
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false)

    const { sendEmail } = useChangePassword()

    const { user, token } = useAuth()

    const handleUpdateData = async () => {

        const modal = await Swal.fire({
            icon: 'warning',
            title: '¿Estás seguro que quieres actualizar tu perfil?',
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
            const data = {
                usuario_id: user.usuario_id,
                nombre: user.nombre,
                apellido: user.apellido
            }

            setUpdateData(data)
            setShowUpdateModal(true)
        }
    }

    const handleSendEmail = async () => {

        const modal = await Swal.fire({
            icon: 'warning',
            title: '¿Estás seguro que quieres cambiar tu contraseña?',
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

                const response = await sendEmail(token, user.email)

                if (response) {
                    await Swal.fire({
                        title: response.message,
                        icon: "success",
                        draggable: false,
                        allowEscapeKey: false,
                        allowOutsideClick: false
                    })
                    setShowChangePasswordModal(true)
                    setIsProcessing(false)
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

    return (
        <>
            <Container className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className="h2"><i className="bi bi-person-gear" style={{ fontSize: '40px' }}></i> Mi perfil</h1>
            </Container>
            <Container className="d-flex justify-content-center align-items-center">
                <Container className="mb-4">
                    <Container className="card shadow-sm">
                        <Container className="card-header text-center">
                            <strong>Información de tu perfil</strong>
                        </Container>
                        <Container className="card-body">
                            <p><strong>Usuario:</strong> {`${user ? user.nombre : ''} ${user ? user.apellido : ''}`}</p>
                            <p><strong>Email:</strong> {`${user ? user.email : ''}`}</p>
                            <p><strong>Rol:</strong> {`${user ? user.rol : ''}`}</p>
                            <p><strong>Fecha de registro:</strong> {`${user ? new Date(user.fecha_registro).toISOString().split('T')[0] : ''}`}</p>
                            <button disabled={isProcessing} className="btn btn-primary" onClick={() => handleUpdateData()}
                            ><i className="bi bi-pencil-square"></i> Actualizar datos</button>
                            <hr className="my-3" />

                            <p>Puedes cambiar tu contraseña dando click aquí, se te enviará un código a tu correo eléctronico.</p>

                            <Button disabled={isProcessing} type="submit" className="btn btn-warning" onClick={() => handleSendEmail()}>
                                {
                                    isProcessing ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            <span className="ms-2">Procesando...</span>
                                        </>
                                    ) : (
                                        <span>
                                            <i className="bi bi-key"></i> Cambiar contraseña
                                        </span>
                                    )
                                }
                            </Button>

                        </Container>
                    </Container>
                </Container>
            </Container>
            <UpdateAccountModal showModal={showUpdateModal} setShowModal={() => setShowUpdateModal(false)} updateData={updateData} token={token} />
            <ChangePasswordModal showModal={showChangePasswordModal} setShowModal={() => setShowChangePasswordModal(false)} token={token} email={user ? user.email : ''} />
        </>
    )
}

export default MyProfile