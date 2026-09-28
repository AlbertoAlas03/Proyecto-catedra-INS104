import { useState } from "react"
import Url from "../utils/url-data"
import useRefreshToken from "./use-refreshToken"
import { useAuth } from "./context/auth-context"
import useLogin from "./use-login"
import { CallCourseNotStarted } from "./context/course-not-started-context"

const useCourse = () => {

    const [course, setCourse] = useState([])
    const [courseSearched, setcourseSearched] = useState(null)
    const [loading, setLoading] = useState(true)
    const [paginaActual, setPaginaActual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const limite = 12;

    const { url_list_cursos, url_add_curso, url_delete_curso, url_update_curso, url_list_cursos_no_iniciados, url_search_curso } = Url()

    const { refresh } = useRefreshToken()

    const { setCourseNotStarted } = CallCourseNotStarted()

    const { setToken } = useAuth()

    const { logout } = useLogin()

    const list_course = async (token) => {

        setLoading(true)
        const response = await fetch(url_list_cursos + `?page=${paginaActual}&limit=${limite}`, {
            method: 'GET',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`
            }
        })

        if (!response.ok) {

            const ErrorData = await response.json()

            if (ErrorData.message_about_token) {

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
                throw new Error(ErrorData.message || 'Error en el servidor')
            }
        }

        const data = await response.json()

        setCourse(data.data)
        setTotalPaginas(data.totalPaginas)
        setLoading(false)
    }


    const add_course = async (token, data_course) => {

        const Data = {
            idioma_id: data_course.idioma_id,
            nombre: data_course.nombre,
            descripcion: data_course.descripcion,
            programa: data_course.programa,
            modalidad: data_course.modalidad,
            horario: data_course.horario,
            fecha_inicio: data_course.fecha_inicio,
            fecha_fin: data_course.fecha_fin,
            capacidad_maxima: data_course.capacidad_maxima
        }


        const response = await fetch(url_add_curso, {
            method: 'POST',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`
            },
            body: JSON.stringify(Data)
        })

        if (!response.ok) {

            const ErrorData = await response.json()

            if (ErrorData.message_about_token) {

                const modal_validacion = window.confirm('Tu sesión a expirado, ¿Desea renovarla?')

                if (modal_validacion) {

                    const response_token = await refresh(setToken)

                    const token_nuevo = response_token.token_nuevo

                    if (token_nuevo) {

                        return await add_course(token_nuevo, data_course)

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
                throw new Error(ErrorData.message || 'Error en el servidor')
            }
        }

        const data = await response.json()

        return data
    }

    const delete_course = async (token, curso_id) => {

        const response = await fetch(url_delete_curso, {
            method: 'DELETE',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ curso_id })
        })

        if (!response.ok) {

            const ErrorData = await response.json()

            if (ErrorData.message_about_token) {

                const modal_validacion = window.confirm('Tu sesión a expirado, ¿Desea renovarla?')

                if (modal_validacion) {

                    const response_token = await refresh(setToken)

                    const token_nuevo = response_token.token_nuevo

                    if (token_nuevo) {

                        return await delete_course(token_nuevo, curso_id)

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
                throw new Error(ErrorData.message || 'Error en el servidor')
            }
        }

        const data = await response.json()

        return data
    }

    const update_course = async (token, UpdateData) => {

        const Data = {
            curso_id: UpdateData.curso_id,
            idioma_id: UpdateData.idioma_id,
            nombre: UpdateData.nombre,
            descripcion: UpdateData.descripcion,
            programa: UpdateData.programa,
            modalidad: UpdateData.modalidad,
            horario: UpdateData.horario,
            fecha_inicio: UpdateData.fecha_inicio,
            fecha_fin: UpdateData.fecha_fin,
            capacidad_maxima: UpdateData.capacidad_maxima
        }

        const response = await fetch(url_update_curso, {
            method: 'PUT',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`
            },
            body: JSON.stringify(Data)
        })

        if (!response.ok) {

            const ErrorData = await response.json()

            if (ErrorData.message_about_token) {

                const modal_validacion = window.confirm('Tu sesión a expirado, ¿Desea renovarla?')

                if (modal_validacion) {

                    const response_token = await refresh(setToken)

                    const token_nuevo = response_token.token_nuevo

                    if (token_nuevo) {

                        return await update_course(token_nuevo, UpdateData)

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
                throw new Error(ErrorData.message || 'Error en el servidor')
            }
        }

        const data = await response.json()

        return data
    }

    const list_cursos_no_iniciados = async (token) => {

        const response = await fetch(url_list_cursos_no_iniciados, {
            method: 'GET',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`
            }
        })

        if (!response.ok) {

            const ErrorData = await response.json()

            if (ErrorData.message_about_token) {

                const modal_validacion = window.confirm('Tu sesión a expirado, ¿Desea renovarla?')

                if (modal_validacion) {

                    const response_token = await refresh(setToken)

                    const token_nuevo = response_token.token_nuevo

                    if (token_nuevo) {

                        return await list_cursos_no_iniciados(token_nuevo)

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
                throw new Error(ErrorData.message || 'Error en el servidor')
            }
        }

        const data = await response.json()

        setCourseNotStarted(data.data)
    }

    const search_curso = async (token, curso_id) => {

        const response = await fetch(url_search_curso, {
            method: 'POST',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ curso_id })
        })

        if (!response.ok) {

            const ErrorData = await response.json()

            if (ErrorData.message_about_token) {

                const modal_validacion = window.confirm('Tu sesión a expirado, ¿Desea renovarla?')

                if (modal_validacion) {

                    const response_token = await refresh(setToken)

                    const token_nuevo = response_token.token_nuevo

                    if (token_nuevo) {

                        return await search_curso(token_nuevo, curso_id)

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
                throw new Error(ErrorData.message || 'Error en el servidor')
            }
        }

        const data = await response.json()

        setcourseSearched(data.data)

        return data
    }

    return {
        list_course,
        course,
        add_course,
        delete_course,
        update_course,
        list_cursos_no_iniciados,
        search_curso,
        courseSearched,
        setcourseSearched,
        loading,
        totalPaginas,
        paginaActual,
        setPaginaActual
    }
}

export default useCourse