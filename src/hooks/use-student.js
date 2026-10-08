import { url_list_estudiantes } from '../utils/request-url'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import useRefreshToken from './use-refreshToken'
import { useAuth } from './contexts/auth-context'
import useLogin from './use-login'

const useStudent = () => {

    const [student, setStudent] = useState([])
    const [loading, setLoading] = useState(true)
    const [paginaActual, setPaginaActual] = useState(1)
    const [totalPaginas, setTotalPaginas] = useState(1)
    const limite = 12

    const { logout } = useLogin()

    const { setToken } = useAuth()

    const { refresh } = useRefreshToken()

    const { curso_id } = useParams()

    const list_estudiantes = async (token) => {

        setLoading(true)

        const response = await fetch(url_list_estudiantes + `?page=${paginaActual}&limit=${limite}`, {
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
                        return await list_estudiantes(token_nuevo)
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

        setStudent(data.data)
        setTotalPaginas(data.totalPaginas)
        setLoading(false)
    }

    return { list_estudiantes, student, loading, paginaActual, setPaginaActual, totalPaginas }
}

export default useStudent