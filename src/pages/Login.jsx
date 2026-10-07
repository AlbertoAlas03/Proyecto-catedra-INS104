import { Container, Card, Image, Form, Button, InputGroup } from "react-bootstrap"
import logo from '../assets/img/logo.png'
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import fondo from '../assets/img/background_login.jpg'
import Footer from "../components/Footer"
import useLogin from "../hooks/use-login"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/context/auth-context"

const Login = () => {

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [seePassword, setSeePassword] = useState(false)

    const { login } = useLogin()

    const { token } = useAuth()

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        const data = {
            email: email,
            password: password
        }

        try {

            const response = await login(data)

            if (response) {
                navigate('/home', { replace: true })
                setLoading(false)
                ClearForm()
            }

        } catch (error) {
            setError(error.message || 'Hubo un error al inicar sesión')
            setLoading(false)
        }
    }

    const handleSeePassword = () => {
        setSeePassword(!seePassword)
    }

    const ClearForm = () => {
        setEmail('')
        setPassword('')
    }

    useEffect(() => {
        if (token) {
            navigate('/home', { replace: true })
        }
    }, [token, navigate])

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
                            <Image src={logo} className="img-fluid mx-auto d-block mb-4" style={{ width: '220px', height: '100px' }} />
                            {
                                loading ? (
                                    <div className="alert alert-info d-flex align-items-center" role="alert">
                                        <i className="bi bi-hourglass-split me-2"></i>
                                        Iniciando sesión...
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
                                            <span>Puedes iniciar sesión utilizando las credenciales que se le han proporcionado. <strong>Si aún no cuenta con credenciales de acceso, por favor comuníquese con el área administrativa de la Escuela de Idiomas para solicitarlas.</strong></span>
                                        </Container>
                                    ))

                            }
                            <Form onSubmit={handleSubmit}>
                                <fieldset disabled={loading}>
                                    <Form.Group className="mb-4">
                                        <Form.Label><i className="bi bi-envelope-at"></i> Correo eléctronico</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="Correo eléctronico"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-4">
                                        <Form.Label><i className="bi bi-lock"></i> Contraseña</Form.Label>
                                        <InputGroup>
                                            <Form.Control
                                                type={seePassword ? 'text' : 'password'}
                                                placeholder="Contraseña"
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
                                    <Container>
                                        <i className="bi bi-key"></i>
                                        <Link to='/changepassword'>¿Olvidó su contraseña?</Link>
                                    </Container>
                                    <hr />
                                    <Button className="btn btn-primary w-100" type="submit">Iniciar sesión</Button>
                                </fieldset>
                            </Form>
                        </Card.Body >
                    </Card >
                </Container >
                <Footer />
            </Container>
        </>
    )
}

export default Login