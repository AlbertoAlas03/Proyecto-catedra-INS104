import { useState } from 'react'
import url from '../utils/url-data'
import { useAuth } from './context/auth-context'
import useLogin from './use-login'
import useRefreshToken from './use-refreshToken'

const useCount = () => {

    const [count, setCount] = useState([])
    const [loading, setLoading] = useState(true)

    const { url_count } = url()
    const { logout } = useLogin()
    const { refresh } = useRefreshToken()

    const { setToken } = useAuth()

    const count_registros = async (token) => {
        setLoading(true)
        const response = await fetch(url_count, {
            method: 'GET',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`
            }
        })

        if (!response.ok) {

            const errorData = await response.json()

            if (errorData.message_about_token) {

                const modal_validacion = window.confirm('Tu sesión a expirado, ¿Desea renovarla?')

                if (modal_validacion) {

                    const response_token = await refresh(setToken)

                    const token_nuevo = response_token.token_nuevo

                    if (token_nuevo) {
                        return await count_registros(token_nuevo)
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

        setCount(data.data)
        setLoading(false)
    }

    return { count_registros, count, loading }
}

export default useCount