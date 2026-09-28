import React, { useState, useEffect } from "react";
import logo from "../assets/img/logo.png"
import useLogin from "../hooks/use-login";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/context/auth-context";
import Footer from "../components/Footer"

const Login = () => {

    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate()
    const { token } = useAuth();

    const { login } = useLogin()

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null)
        setLoading(true)

        const usuario = {
            email: email,
            password: password
        }

        try {

            const response = await login(usuario)

            if (response) {

                navigate('/home', { replace: true })
                clearForm()
                setLoading(false)

            }

        } catch (error) {

            console.log('Hubo un error al iniciar sesión: ', error.message)

            setError('Hubo un error al iniciar sesión: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    const togglePasswordVisibility = (e) => {
        e.preventDefault();
        setShowPassword(!showPassword)
    }

    const clearForm = () => {
        setEmail('')
        setPassword('')
    }

    useEffect(() => {
        if (token) {
            navigate('/home', { replace: true });
        }
    }, [token, navigate]);

    return (
        <>
            <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <div className="card shadow-lg rounded-3 w-75" style={{ maxWidth: '500px' }}>
                    <div className="card-body">
                        <h2 className="text-center mb-4" style={{ fontSize: '2rem' }}>Iniciar Sesión</h2>
                        <img src={logo} alt="Usuario" className="img-fluid mx-auto d-block mb-4" style={{ width: '220px', height: '100px' }} />
                        {error && (
                            <div className="alert alert-danger d-flex align-items-center" role="alert">
                                <button className="me-2" style={{ background: 'transparent', border: 'none' }} onClick={() => setError(null)}>
                                    <i className="bi bi-x-circle-fill"></i>
                                </button>
                                {error}
                            </div>
                        )}
                        {loading && (
                            <div className="alert alert-info d-flex align-items-center" role="alert">
                                <i className="bi bi-hourglass-split me-2"></i>
                                Iniciando sesión...
                            </div>
                        )}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="email" className="form-label" style={{ fontSize: '1.1rem' }}>Correo electrónico</label>
                                <input type="email" className="form-control form-control-lg" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Ingrese su correo electrónico" style={{ fontSize: '1.1rem' }} disabled={loading}
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="password" className="form-label" style={{ fontSize: '1.1rem' }}>Contraseña</label>
                                <div className="input-group">
                                    <input type={showPassword ? 'text' : 'password'} className="form-control form-control-lg" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Ingrese su contraseña" style={{ fontSize: '1.1rem' }} disabled={loading}
                                    />
                                    <button className="input-group-text" onClick={togglePasswordVisibility}><i className={showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'}></i></button>
                                </div>
                            </div>

                            <div className="text-center mb-4">
                                <button type="submit" className="btn btn-primary w-100 btn-lg">
                                    {loading ? (
                                        <>
                                            <i className="bi bi-arrow-repeat me-2 spin"></i> Iniciado sesión...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-box-arrow-in-right me-2"></i>
                                            Iniciar Sesión
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div >
            </div >
            <div className="footer fixed-bottom">
                <Footer />
            </div>
        </>
    )
}

export default Login;