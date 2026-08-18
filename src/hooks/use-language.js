import Url from "../utils/url-data"
import useRefreshToken from "./use-refreshToken"
import { useAuth } from "./context/auth-context"
import { useState } from "react"
import useLogin from "./use-login"
import { CallLanguage } from "./context/language-context"

const useLanguage = () => {

    const [language, setLenguage] = useState([])
    const [search, setsearch] = useState(null)
    const [loading, setLoading] = useState(true)
    const [paginaActual, setPaginaActual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const limite = 12;

    const { setLanguages } = CallLanguage()

    const { url_list_idiomas, url_add_idioma, url_delete_idioma, url_update_idioma, url_search_idioma } = Url()

    const { refresh } = useRefreshToken()

    const { setToken } = useAuth()

    const { logout } = useLogin()

    const list_idiomas = async (token) => {

        setLoading(true)

        const response = await fetch(url_list_idiomas + `?page=${paginaActual}&limit=${limite}`, {
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

                        return await list_idiomas(token_nuevo)

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

        setLenguage(data.data)
        setLanguages(data.data)
        setTotalPaginas(data.totalPaginas)
        setLoading(false)
    }

    const add_idioma = async (token, nombre) => {

        const response = await fetch(url_add_idioma, {
            method: 'POST',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ nombre })
        })

        if (!response.ok) {

            const ErrorData = await response.json()

            if (ErrorData.message_about_token) {

                const modal_validacion = window.confirm('Tu sesión a expirado, ¿Desea renovarla?')

                if (modal_validacion) {

                    const response_token = await refresh(setToken)

                    const token_nuevo = response_token.token_nuevo

                    if (token_nuevo) {

                        return await add_idioma(token_nuevo, nombre)

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

    const delete_idioma = async (idioma_id, token) => {

        const response = await fetch(url_delete_idioma, {
            method: 'DELETE',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ idioma_id })
        })

        if (!response.ok) {

            const ErrorData = await response.json()

            if (ErrorData.message_about_token) {

                const modal_validacion = window.confirm('Tu sesión a expirado, ¿Desea renovarla?')

                if (modal_validacion) {

                    const response_token = await refresh(setToken)

                    const token_nuevo = response_token.token_nuevo

                    if (token_nuevo) {

                        return await delete_idioma(idioma_id, token_nuevo)

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

    const update_idioma = async (token, updateData) => {

        const idiomaData = {
            idioma_id: updateData.idioma_id,
            nombre: updateData.nombre
        }

        const response = await fetch(url_update_idioma, {
            method: 'PUT',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`
            },
            body: JSON.stringify(idiomaData)
        })

        if (!response.ok) {

            const ErrorData = await response.json()

            if (ErrorData.message_about_token) {

                const modal_validacion = window.confirm('Tu sesión a expirado, ¿Desea renovarla?')

                if (modal_validacion) {

                    const response_token = await refresh(setToken)

                    const token_nuevo = response_token.token_nuevo

                    if (token_nuevo) {

                        return await update_idioma(token_nuevo, updateData)

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

    const search_idioma = async (token, idioma_id) => {

        const response = await fetch(url_search_idioma, {
            method: 'POST',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ idioma_id })
        })

        if (!response.ok) {

            const ErrorData = await response.json()

            if (ErrorData.message_about_token) {

                const modal_validacion = window.confirm('Tu sesión a expirado, ¿Desea renovarla?')

                if (modal_validacion) {

                    const response_token = await refresh(setToken)

                    const token_nuevo = response_token.token_nuevo

                    if (token_nuevo) {

                        return await search_idioma(token_nuevo, idioma_id)

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

        setsearch(data.data)

        return data
    }

    return {
        list_idiomas,
        language,
        add_idioma,
        delete_idioma,
        update_idioma,
        search_idioma,
        search,
        setsearch,
        loading,
        totalPaginas,
        paginaActual,
        setPaginaActual
    }

}

export default useLanguage