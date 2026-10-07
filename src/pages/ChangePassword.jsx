import { Container, Card, Image, Form, InputGroup, Button } from "react-bootstrap"
import Footer from "../components/Footer"
import fondo from '../assets/img/background_login.jpg'
import img_email from '../assets/img/email.png'
import { useState } from "react"
import useChangePassword from "../hooks/use-change-password"
import Swal from "sweetalert2"
import ChangePasswordModal from "../components/ChangePasswordModal"
import { useNavigate } from "react-router-dom"

const ChangePassword = () => {

    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [showModal, setShowModal] = useState(false)

    const navigate = useNavigate()

    const { sendEmail } = useChangePassword()

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        setError(null)

        try {

            const response = await sendEmail(email)

            if (response) {
                await Swal.fire({
                    title: response.message,
                    icon: "success",
                    allowEscapeKey: false,
                    allowOutsideClick: false
                });

                setShowModal(true)
            }

        } catch (error) {
            setError(error.message || 'Hubo un error al solicitar el cambio de contraseña')
            setLoading(false)
        }
    }

    return (
        <>
            <Container fluid style={{
                backgroundImage: `url(${fondo})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                height: "100vh"
            }}>
                <Container className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                    <Card className="rounded-3 w-75" style={{ maxWidth: '500px' }}>
                        <Card.Body>
                            <Image src={img_email} className="img-fluid mx-auto d-block mb-4" style={{ width: '100px', height: '100px' }} />
                            {
                                loading ? (
                                    <div className="alert alert-info d-flex align-items-center" role="alert">
                                        <i className="bi bi-hourglass-split me-2"></i>
                                        Procesando...
                                    </div>
                                ) : (
                                    error ? (
                                        <Container className="alert alert-danger d-flex align-items-center" role="alert">
                                            <button className="me-2" style={{ background: 'transparent', border: 'none' }} onClick={() => setError(null)}>
                                                <i className="bi bi-x-circle-fill"></i>
                                            </button>
                                            <span>{error}</span>
                                        </Container>
                                    ) : (
                                        <Container className="alert alert-success d-flex align-items-center" role="alert">
                                            <span><strong>Ingresa tu correo electrónico registrado, se te enviara un codigo de verificación para poder cambiar tu contraseña.</strong></span>
                                        </Container>
                                    ))

                            }
                            <Form onSubmit={handleSubmit}>
                                <fieldset disabled={loading}>
                                    <Form.Group className="mb-4">
                                        <Form.Label><i className="bi bi-envelope-at"></i> Correo eléctronico</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="Ingresa tu correo eléctronico"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Button className="btn btn-success w-100" type="submit" style={{ marginBottom: '10px' }}>Aceptar</Button>
                                    <Button className="btn btn-danger w-100" onClick={() => navigate('/', { replace: true })}>Cancelar</Button>
                                </fieldset>
                            </Form>
                        </Card.Body >
                    </Card >
                </Container >
                <Footer />
            </Container>
            <ChangePasswordModal showModal={showModal} setShowModal={() => setShowModal(false)} email={email} setEmail={setEmail} setLoading={setLoading} />
        </>
    )
}

export default ChangePassword