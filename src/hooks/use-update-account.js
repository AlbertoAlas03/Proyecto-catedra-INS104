import { url_update_account } from '../utils/request-url'
import useRefreshToken from './use-refreshToken'
import { useAuth } from './contexts/auth-context'
import useLogin from './use-login'

const useUpdateAccount = () => {

    const { refresh } = useRefreshToken()

    const { logout } = useLogin()

    const { setToken, setUser } = useAuth()

    const update_account = async (token, updateData) => {

        const RequestData = {
            usuario_id: updateData.usuario_id,
            nombre: updateData.nombre,
            apellido: updateData.apellido
        }

        const response = await fetch(url_update_account, {
            method: 'PUT',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`
            },
            body: JSON.stringify(RequestData)
        })


        if (!response.ok) {

            const errorData = await response.json()

            if (errorData.message_about_token) {

                const modal_validacion = window.confirm('Tu sesión a expirado, ¿Desea renovarla?')

                if (modal_validacion) {

                    const response_token = await refresh(setToken)

                    const token_nuevo = response_token.token_nuevo

                    if (token_nuevo) {
                        return await update_account(token_nuevo, updateData)
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
        setUser(data.usuario)
        return data
    }

    return { update_account }
}

export default useUpdateAccount