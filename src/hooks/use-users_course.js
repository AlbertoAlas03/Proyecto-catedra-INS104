import { url_get_users } from '../utils/url-data'
import RefreshToken from "./use-refreshToken"
import { useAuth } from './context/auth-context'
import useLogin from './use-login'
import { useState } from 'react'

const useUsersCourse = () => {

    const [students, setStudents] = useState([])
    const [teacher, setTeacher] = useState(null)
    const [loading, setLoading] = useState(true)

    const { setToken } = useAuth()

    const { logout } = useLogin()

    const { refresh } = RefreshToken()

    const users_course = async (token, curso_id) => {

        const response = await fetch(url_get_users, {
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
                        return await users_course(token_nuevo, curso_id)
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
        setStudents(data.usuarios_estudiantes)
        setTeacher(data.profesor)
        setLoading(false)
    }

    return { users_course, students, teacher, loading }

}

export default useUsersCourse