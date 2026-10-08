import { useState } from 'react'
import { url_list_cursos } from '../utils/request-url'
import { useAuth } from './contexts/auth-context'
import useRefreshToken from './use-refreshToken'
import useLogin from './use-login'
import { CallCourses } from './contexts/course-context'

const useCourse = () => {

    const { setToken } = useAuth()

    const { setCourses } = CallCourses()

    const { refresh } = useRefreshToken()

    const { logout } = useLogin()

    const [cursos, setcursos] = useState([])
    const [loading, setLoading] = useState(true)

    const list_course = async (token) => {

        setLoading(true)

        const response = await fetch(url_list_cursos, {
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
                        return await list_course(token_nuevo)
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

        setcursos(data.data)
        setCourses(data.data)
        setLoading(false)
    }

    return { list_course, cursos, loading }
}

export default useCourse