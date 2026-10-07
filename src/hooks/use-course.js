import { url_get_course, url_courses_not_started } from "../utils/url-data"
import { useAuth } from "./context/auth-context"
import RefreshToken from "./use-refreshToken"
import useLogin from "./use-login"
import { useState } from "react"
import { CallCourses } from "./context/course-context"

const useCourse = () => {

    const [cursos, setCursos] = useState([])
    const [loading, setLoading] = useState(true)
    const [loadingCoursesNotStarted, setLoadingCoursesNotStarted] = useState(true)
    const [coursesNotStarted, setCoursesNotStarted] = useState([])

    const { setCourses } = CallCourses()

    const { setToken } = useAuth()

    const { logout } = useLogin()

    const { refresh } = RefreshToken()

    const get_course = async (token) => {

        const response = await fetch(url_get_course, {
            method: 'POST',
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
                        return await get_course(token_nuevo)
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

        setCursos(data.data)
        setCourses(data.data)
        setLoading(false)
    }

    const get_courses_not_started = async (token) => {

        const response = await fetch(url_courses_not_started, {
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
                        return await get_courses_not_started(token_nuevo)
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

        setCoursesNotStarted(data.data)
        setLoadingCoursesNotStarted(false)
    }

    return { get_course, cursos, loading, get_courses_not_started, coursesNotStarted, loadingCoursesNotStarted }
}

export default useCourse