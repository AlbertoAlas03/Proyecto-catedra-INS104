import React, { useState } from "react";
import { useAuth } from '../hooks/context/auth-context'
import useChangePassword from "../hooks/use-change-password";
import Swal from "sweetalert2";
import ChangePasswordModal from "../components/ChangePasswordModal";
import UpdateDataUserModal from "../components/UpdateDataUserModal";

const Configuration = () => {

    const [isProcessing, setisProcessing] = useState(false)
    const [showModal, setshowModal] = useState(false)
    const [showUpdateModal, setshowUpdateModal] = useState(false)
    const [data, setData] = useState(null)

    const { user, token } = useAuth()

    const { send_code } = useChangePassword()

    const handleSendCode = async () => {

        const modal_confirm = await Swal.fire({
            title: '¿Estás seguro que deseas cambiar tu contraseña?',
            icon: 'warning',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
            customClass: {
                cancelButton: 'btn btn-danger',
                confirmButton: 'btn btn-success'
            },
            allowEscapeKey: false,
            allowOutsideClick: false
        })

        if (modal_confirm.isConfirmed) {
            setisProcessing(true)
            try {

                const response = await send_code(token, user.email)

                if (response) {
                    await Swal.fire({
                        title: response.message,
                        icon: "success",
                        draggable: false,
                        allowEscapeKey: false,
                        allowOutsideClick: false
                    })
                    setisProcessing(false)
                    setshowModal(true)
                }
            } catch (error) {

                await Swal.fire({
                    title: error.message,
                    icon: "error",
                    draggable: false,
                    allowEscapeKey: false,
                    allowOutsideClick: false
                });
                setisProcessing(false)
            }
        }

    }

    const handleUpdateData = async () => {

        const modal = await Swal.fire({
            title: '¿Estás seguro que quieres actualizar tu perfil?',
            icon: 'warning',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
            customClass: {
                cancelButton: 'btn btn-danger',
                confirmButton: 'btn btn-success'
            },
            allowEscapeKey: false,
            allowOutsideClick: false
        })

        if (modal.isConfirmed) {
            const data = {
                usuario_id: user.usuario_id,
                nombre: user.nombre,
                apellido: user.apellido,
                email: user.email
            }

            setData(data)
            setshowUpdateModal(true)
        }

    }

    return (
        <>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className="h2"><i className="bi bi-gear"></i> Configuración</h1>
            </div>
            <div className="row">

                <div className="mb-4">
                    <div className="card shadow-sm">
                        <div className="card-header text-center">
                            <strong>Información del usuario</strong>
                        </div>
                        <div className="card-body">
                            <p><strong>Usuario:</strong> {`${user ? user.nombre : ''} ${user ? user.apellido : ''}`}</p>
                            <p><strong>Email:</strong> {`${user ? user.email : ''}`}</p>
                            <p><strong>Rol:</strong> {`${user ? user.rol : ''}`}</p>
                            <p><strong>Fecha de registro:</strong> {`${user ? new Date(user.fecha_registro).toISOString().split('T')[0] : ''}`}</p>
                            <button disabled={isProcessing} className="btn btn-primary" onClick={() => handleUpdateData()}
                            ><i className="bi bi-pencil-square"></i> Actualizar datos</button>
                            <hr className="my-3" />

                            <p>Puedes cambiar tu contraseña dando click aquí, se te enviará un código a tu correo eléctronico.</p>

                            <button disabled={isProcessing} type="submit" className="btn btn-warning" onClick={() => handleSendCode()}>
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
                            </button>

                        </div>
                    </div>
                </div>
            </div>
            {
                showModal && (
                    <ChangePasswordModal showModal={showModal} setShowModal={setshowModal} user={user} token={token} />
                )
            }

            <UpdateDataUserModal showModal={showUpdateModal} updateData={data} setShowModal={setshowUpdateModal} token={token} />

        </>
    );
};

export default Configuration