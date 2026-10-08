import { url_login, url_logout } from '../utils/request-url'
import { useAuth } from './contexts/auth-context'

const useLogin = () => {

    const { setToken, setUser } = useAuth()

    const login = async (Data) => {

        const LoginData = {
            email: Data.email,
            password: Data.password
        }

        const response = await fetch(url_login, {
            method: 'POST',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(LoginData),
            credentials: 'include'
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.message || 'Error en el servidor')
        }

        const data = await response.json()

        setToken(data.token)
        setUser(data.usuario)

        return data

    }

    const logout = async () => {

        const response = await fetch(url_logout, {
            method: 'GET',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            credentials: 'include'
        })

        if (!response.ok) {
            setToken(null)
            setUser(null)
        }

        const data = await response.json()
        setToken(null)
        setUser(null)
        return data
    }

    return { login, logout }
}

export default useLogin