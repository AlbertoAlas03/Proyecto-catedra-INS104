import { url_list_evaluaciones, url_create_evaluacion, url_delete_evaluacion, url_update_evaluacion } from '../utils/request-url'
import { useAuth } from './contexts/auth-context'
import { useParams } from 'react-router-dom'
import useRefreshToken from './use-refreshToken'
import useLogin from './use-login'
import { useState } from 'react'
import { CallAssessment } from '../hooks/contexts/assessment-context'

const useAssessment = () => {

    const [evaluaciones, setEvaluaciones] = useState([])
    const [porcentaje_total, setPorcentaje_total] = useState(0)
    const [loading, setLoading] = useState(true)

    const { setAssessment } = CallAssessment()

    const { logout } = useLogin()

    const { setToken } = useAuth()

    const { curso_id } = useParams()

    const { refresh } = useRefreshToken()

    const list_evaluaciones = async (token) => {

        const response = await fetch(url_list_evaluaciones, {
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
                        return await list_evaluaciones(token_nuevo)
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

        setEvaluaciones(data.data)
        setPorcentaje_total(data.total_porcentaje)
        setAssessment(data.data)
        setLoading(false)
    }

    const create_assessment = async (Data, token) => {

        const RequestData = {
            curso_id: curso_id,
            nombre: Data.nombre,
            descripcion: Data.descripcion,
            porcentaje: Data.porcentaje
        }

        const response = await fetch(url_create_evaluacion, {
            method: 'POST',
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
                        return await create_assessment(Data, token_nuevo)
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

        return data
    }

    const delete_assessment = async (token, evaluacion_id) => {

        const response = await fetch(url_delete_evaluacion, {
            method: 'DELETE',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ evaluacion_id })
        })

        if (!response.ok) {

            const errorData = await response.json()

            if (errorData.message_about_token) {

                const modal_validacion = window.confirm('Tu sesión a expirado, ¿Desea renovarla?')

                if (modal_validacion) {

                    const response_token = await refresh(setToken)

                    const token_nuevo = response_token.token_nuevo

                    if (token_nuevo) {
                        return await delete_assessment(token_nuevo, evaluacion_id)
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
        return data
    }

    const update_assessment = async (token, UpdateData) => {

        const RequestData = {
            curso_id: curso_id,
            evaluacion_id: UpdateData.evaluacion_id,
            nombre: UpdateData.nombre,
            descripcion: UpdateData.descripcion,
            porcentaje: UpdateData.porcentaje
        }

        const response = await fetch(url_update_evaluacion, {
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
                        return await update_assessment(token_nuevo, UpdateData)
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
        return data
    }

    return { list_evaluaciones, evaluaciones, loading, create_assessment, delete_assessment, porcentaje_total, update_assessment }

}

export default useAssessment