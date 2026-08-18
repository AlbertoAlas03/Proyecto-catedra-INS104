import Url from "../utils/url-data";
import { useAuth } from "./context/auth-context";

const useLogin = () => {

    const { url_login, url_logout } = Url()

    const { setToken, setUser } = useAuth()

    const login = async (usuario) => {

        const Usuario = {
            email: usuario.email,
            password: usuario.password
        }

        const response = await fetch(url_login, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(Usuario),
            credentials: "include"
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
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            credentials: "include"
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || "Error en el servidor");
        }

        const data = await response.json()

        setToken(null)
        setUser(null)

        return data
    }

    return { login, logout }
}

export default useLogin