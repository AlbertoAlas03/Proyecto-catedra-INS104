import { useEffect, useState } from "react"
import { Button, Modal, Form } from 'react-bootstrap';
import useUser from "../hooks/use-user";
import Swal from "sweetalert2";

const UpdateUserModal = ({
    showModal,
    setShowModal,
    DataUpdate,
    token,
    list_user,
    setUserSelected,
    setuserID,
    setisSearching,
    setsearchData
}) => {

    const [name, setName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [role, setrole] = useState('')
    const [id_usuario, setId_usuario] = useState('')
    const [isProcessing, setisProcessing] = useState(false)
    const [error, setError] = useState(null)

    const { update_user } = useUser()

    const roles = [
        "administrador",
        "profesor",
        "estudiante"
    ]

    const handleSubmit = async (e) => {
        e.preventDefault()
        setisProcessing(true)
        setError(null)

        const data = {
            usuario_id: id_usuario,
            nombre: name,
            apellido: lastName,
            email: email,
            telefono: phone,
            rol: role
        }

        try {

            const response = await update_user(token, data)

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
                list_user(token)
                setUserSelected(null)
                setuserID('')
                setisSearching(false)
                setsearchData(null)
            }

        } catch (error) {

            setError(error.message || 'Hubo un error al actualizar el usuario')
            setisProcessing(false)
        }
    }

    const clearForm = () => {
        setEmail('')
        setLastName('')
        setName('')
        setId_usuario('')
        setPhone('')
        setrole('')
    }

    useEffect(() => {
        if (DataUpdate) {
            setId_usuario(DataUpdate.usuario_id)
            setName(DataUpdate.nombre || 'Sin nombre')
            setLastName(DataUpdate.apellido || 'Sin apellidos')
            setEmail(DataUpdate.email || 'Sin email')
            setPhone(DataUpdate.telefono || 'Sin telefono')
            setrole(DataUpdate.rol)
        }
    }, [DataUpdate])

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
                <Modal.Title><i className="bi bi-person-gear" style={{ fontSize: '30px' }}></i> Actualizar usuario</Modal.Title>
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

                            <div className="col-md-6">
                                <Form.Group className="mb-3" controlId="formBasicName">
                                    <Form.Label><i className="bi bi-file-earmark-person"></i> Nombres</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nombres del usuario"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formBasicLastName">
                                    <Form.Label><i className="bi bi-file-earmark-person"></i> Apellidos</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Apellidos del usuario"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label><i className="bi bi-envelope"></i> Correo electrónico</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Email del usuario"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </Form.Group>
                            </div>

                            <div className="col-md-6">
                                <Form.Group className="mb-3" controlId="formBasicPhone">
                                    <Form.Label><i className="bi bi-telephone"></i> Teléfono</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Teléfono del usuario"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formBasicRol">
                                    <Form.Label><i className="bi bi-person-vcard"></i> Rol del usuario</Form.Label>
                                    <Form.Select value={role} onChange={(e) => setrole(e.target.value)}>
                                        <option value=''>Seleccionar rol</option>
                                        {
                                            roles.map((r, index) => (
                                                <option value={r} key={index}>{r}</option>
                                            ))
                                        }
                                    </Form.Select>
                                </Form.Group>
                            </div>

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

export default UpdateUserModal