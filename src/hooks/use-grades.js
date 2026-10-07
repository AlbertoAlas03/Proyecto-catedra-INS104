import { url_get_notas } from "../utils/url-data"
import { useParams } from "react-router-dom"
import RefreshToken from "./use-refreshToken"
import { useAuth } from "./context/auth-context"
import useLogin from "./use-login"
import { useState } from "react"

const useGrades = () => {

    const [notas, setNotas] = useState([])
    const [nota_final, setNota_final] = useState(0)
    const [loading, setLoading] = useState(true)

    const { refresh } = RefreshToken()
    
    const { curso_id } = useParams()

    const { setToken } = useAuth()

    const { logout } = useLogin()

    const get_notas = async (token) => {

        const response = await fetch(url_get_notas, {
            method: 'POST',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ curso_id })
        })

        if (!response.ok) {

            const errorData = await response.json()

            if (errorData.message_about_token) {

                const modal_validacion = window.confirm('Tu sesión a expirado, ¿Desea renovarla?')

                if (modal_validacion) {

                    const response_token = await refresh(setToken)

                    const token_nuevo = response_token.token_nuevo

                    if (token_nuevo) {
                        return await get_notas(token_nuevo)
                    } else {
                        return
                    }

                } else {
                    try {

                        const response_logout = await logout()

                        if (response_logout) {
                            alert(response_logout.message)
                            return
                        }

                    } catch (error) {

                        console.log('Error al cerrar sesion: ', error.message)
                        alert(error.message)
                        return
                    }

                }

            } else {
                throw new Error(errorData.message || 'Error en el servidor')
            }
        }

        const data = await response.json()

        setNotas(data.data)
        setNota_final(data.nota_final)
        setLoading(false)
    }

    return { get_notas, notas, nota_final, loading }
}

export default useGrades