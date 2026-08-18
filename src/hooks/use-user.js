import { useState } from 'react'
import useRefreshToken from './use-refreshToken'
import { useAuth } from './context/auth-context'
import url from '../utils/url-data'
import useLogin from './use-login'

const useUser = () => {

    const [usuarios, setUsuarios] = useState([])
    const [searchData, setsearchData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [paginaActual, setPaginaActual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const limite = 12;

    const {
        url_list_user,
        url_add_user,
        url_enable_user,
        url_disable_user,
        url_update_user,
        url_search_usuario,
        url_update_account
    } = url()

    const { logout } = useLogin()

    const { refresh } = useRefreshToken()

    const { setToken, setUser } = useAuth()

    const list_user = async (token) => {

        setLoading(true)

        const response = await fetch(url_list_user + `?page=${paginaActual}&limit=${limite}`, {
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

                        return await list_user(token_nuevo)

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

        setUsuarios(data.data)
        setTotalPaginas(data.totalPaginas)
        setLoading(false)
    }

    const add_usuario = async (token, dataUser) => {

        const usuario = {
            nombre: dataUser.nombre,
            apellido: dataUser.apellido,
            email: dataUser.email,
            password: dataUser.password,
            telefono: dataUser.telefono,
            rol: dataUser.rol
        }

        const response = await fetch(url_add_user, {
            method: 'POST',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`
            },
            body: JSON.stringify(usuario)
        })

        if (!response.ok) {

            const ErrorData = await response.json()

            if (ErrorData.message_about_token) {

                const modal_validacion = window.confirm('Tu sesión a expirado, ¿Desea renovarla?')

                if (modal_validacion) {

                    const response_token = await refresh(setToken)

                    const token_nuevo = response_token.token_nuevo

                    if (token_nuevo) {
                        return await add_usuario(token_nuevo, dataUser)
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

    const enable_user = async (usuario_id, token) => {

        const response = await fetch(url_enable_user, {
            method: 'PUT',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ usuario_id })
        })

        if (!response.ok) {

            const ErrorData = await response.json()

            if (ErrorData.message_about_token) {

                const modal_validacion = window.confirm('Tu sesión a expirado, ¿Desea renovarla?')

                if (modal_validacion) {

                    const response_token = await refresh(setToken)

                    const token_nuevo = response_token.token_nuevo

                    if (token_nuevo) {
                        return await enable_user(usuario_id, token_nuevo)
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

    const disable_user = async (usuario_id, token) => {

        const response = await fetch(url_disable_user, {
            method: 'PUT',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ usuario_id })
        })

        if (!response.ok) {

            const ErrorData = await response.json()

            if (ErrorData.message_about_token) {

                const modal_validacion = window.confirm('Tu sesión a expirado, ¿Desea renovarla?')

                if (modal_validacion) {

                    const response_token = await refresh(setToken)

                    const token_nuevo = response_token.token_nuevo

                    if (token_nuevo) {
                        return await disable_user(usuario_id, token_nuevo)
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

    const update_user = async (token, userData) => {

        const usuario = {
            usuario_id: userData.usuario_id,
            nombre: userData.nombre,
            apellido: userData.apellido,
            email: userData.email,
            telefono: userData.telefono,
            rol: userData.rol
        }

        const response = await fetch(url_update_user, {
            method: 'PUT',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`
            },
            body: JSON.stringify(usuario)
        })

        if (!response.ok) {

            const ErrorData = await response.json()

            if (ErrorData.message_about_token) {

                const modal_validacion = window.confirm('Tu sesión a expirado, ¿Desea renovarla?')

                if (modal_validacion) {

                    const response_token = await refresh(setToken)

                    const token_nuevo = response_token.token_nuevo

                    if (token_nuevo) {
                        return await update_user(token_nuevo, userData)
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

    const search_usuario = async (token, usuario_id) => {

        const response = await fetch(url_search_usuario, {
            method: 'POST',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ usuario_id })
        })

        if (!response.ok) {

            const ErrorData = await response.json()

            if (ErrorData.message_about_token) {

                const modal_validacion = window.confirm('Tu sesión a expirado, ¿Desea renovarla?')

                if (modal_validacion) {

                    const response_token = await refresh(setToken)

                    const token_nuevo = response_token.token_nuevo

                    if (token_nuevo) {
                        return await search_usuario(token_nuevo, usuario_id)
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

    const update_account = async (token, Updatedata) => {

        const Data = {
            usuario_id: Updatedata.usuario_id,
            nombre: Updatedata.nombre,
            apellido: Updatedata.apellido,
            email: Updatedata.email
        }

        const response = await fetch(url_update_account, {
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
                        return await update_account(token_nuevo, Updatedata)
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

        setUser(data.usuario)

        return data
    }

    return {
        list_user,
        usuarios,
        add_usuario,
        enable_user,
        disable_user,
        update_user,
        search_usuario,
        searchData,
        setsearchData,
        update_account,
        loading,
        paginaActual,
        totalPaginas,
        setPaginaActual
    }
}

export default useUser