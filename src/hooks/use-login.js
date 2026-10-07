import { url_login, url_logout } from "../utils/url-data"
import { useAuth } from "./context/auth-context"

const useLogin = () => {

    const { setToken, setUser } = useAuth()

    const login = async (userData) => {

        const response = await fetch(url_login, {
            method: 'POST',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            credentials: 'include',
            body: JSON.stringify(userData)
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || "Error en el servidor");
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