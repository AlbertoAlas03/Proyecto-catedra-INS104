import { url_list_notas, url_registrar_nota, url_update_nota } from '../utils/request-url'
import useRefreshToken from './use-refreshToken'
import useLogin from './use-login'
import { useState } from 'react'
import { useAuth } from './contexts/auth-context'

const UseGrade = () => {

    const [notas, setNotas] = useState([])
    const [nota_final, setNota_final] = useState('')
    const [loading, setLoading] = useState(true)

    const { setToken } = useAuth()

    const { refresh } = useRefreshToken()

    const { logout } = useLogin()

    const list_notas = async (token, estudiante_id) => {
        setLoading(true)
        const response = await fetch(url_list_notas, {
            method: 'POST',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ estudiante_id })
        })

        if (!response.ok) {

            const errorData = await response.json()

            if (errorData.message_about_token) {

                const modal_validacion = window.confirm('Tu sesión a expirado, ¿Desea renovarla?')

                if (modal_validacion) {

                    const response_token = await refresh(setToken)

                    const token_nuevo = response_token.token_nuevo

                    if (token_nuevo) {
                        return await list_notas(token_nuevo, estudiante_id)
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

    const add_nota = async (token, Data) => {

        const RequestData = {
            evaluacion_id: Data.evaluacion_id,
            estudiante_id: Data.estudiante_id,
            curso_id: Data.curso_id,
            puntaje_obtenido: Data.puntaje_obtenido,
            email: Data.email
        }

        const response = await fetch(url_registrar_nota, {
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
                        return await add_nota(token_nuevo, Data)
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

    const update_nota = async (token, dataUpdate) => {

        const RequestData = {
            nota_id: dataUpdate.nota_id,
            evaluacion_id: dataUpdate.evaluacion_id,
            estudiante_id: dataUpdate.estudiante_id,
            puntaje_obtenido: dataUpdate.puntaje_obtenido
        }

        const response = await fetch(url_update_nota, {
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
                        return await update_nota(token_nuevo, dataUpdate)
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

    return { list_notas, notas, loading, nota_final, add_nota, update_nota }
}

export default UseGrade