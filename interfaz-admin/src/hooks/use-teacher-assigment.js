import Url from "../utils/url-data"
import useRefreshToken from "./use-refreshToken"
import { useAuth } from "./context/auth-context"
import { useState } from "react"
import useLogin from "./use-login"
import { CallTeacher } from "./context/teacher-context"

const useTeacherAssigment = () => {

    const [teacherAssigment, setTeacherAssigment] = useState([])
    const [searchData, setsearchData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [paginaActual, setPaginaActual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const limite = 12;

    const {
        url_list_profesores_asignados,
        url_list_profesores,
        url_assign_teacher,
        url_delete_assignment,
        url_update_assignment,
        url_search_asignacion
    } = Url()

    const { setTeachers } = CallTeacher()

    const { refresh } = useRefreshToken()

    const { setToken } = useAuth()

    const { logout } = useLogin()

    const list_teacher_assigment = async (token) => {

        setLoading(true)

        const response = await fetch(url_list_profesores_asignados + `?page=${paginaActual}&limit=${limite}`, {
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

                        return await list_teacher_assigment(token_nuevo)

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

        setTeacherAssigment(data.data)
        setTotalPaginas(data.totalPaginas)
        setLoading(false)
    }

    const list_teachers = async (token) => {

        const response = await fetch(url_list_profesores, {
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

                        return await list_teachers(token_nuevo)

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

        setTeachers(data.data)
    }

    const assign_teacher = async (token, data_assignment) => {

        const Data = {
            curso_id: data_assignment.curso_id,
            profesor_id: data_assignment.profesor_id
        }

        const response = await fetch(url_assign_teacher, {
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

                        return await assign_teacher(token_nuevo, data_assignment)

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

    const delete_assingment = async (token, asignacion_id) => {

        const response = await fetch(url_delete_assignment, {
            method: 'DELETE',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ asignacion_id })
        })

        if (!response.ok) {

            const ErrorData = await response.json()

            if (ErrorData.message_about_token) {

                const modal_validacion = window.confirm('Tu sesión a expirado, ¿Desea renovarla?')

                if (modal_validacion) {

                    const response_token = await refresh(setToken)

                    const token_nuevo = response_token.token_nuevo

                    if (token_nuevo) {

                        return await delete_assingment(token_nuevo, asignacion_id)

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

    const update_assignment = async (token, updateData) => {

        const Data = {
            asignacion_id: updateData.asignacion_id,
            curso_id: updateData.curso_id,
            profesor_id: updateData.profesor_id
        }

        const response = await fetch(url_update_assignment, {
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

                        return await update_assignment(token_nuevo, updateData)

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

    const search_assignment = async (token, asignacion_id) => {

        const response = await fetch(url_search_asignacion, {
            method: 'POST',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ asignacion_id })
        })

        if (!response.ok) {

            const ErrorData = await response.json()

            if (ErrorData.message_about_token) {

                const modal_validacion = window.confirm('Tu sesión a expirado, ¿Desea renovarla?')

                if (modal_validacion) {

                    const response_token = await refresh(setToken)

                    const token_nuevo = response_token.token_nuevo

                    if (token_nuevo) {

                        return await search_assignment(token_nuevo, asignacion_id)

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

        setsearchData(data.data)

        return data
    }

    return {
        list_teacher_assigment,
        teacherAssigment,
        list_teachers,
        assign_teacher,
        delete_assingment,
        update_assignment,
        search_assignment,
        searchData,
        setsearchData,
        loading,
        paginaActual,
        setPaginaActual,
        totalPaginas
    }
}

export default useTeacherAssigment