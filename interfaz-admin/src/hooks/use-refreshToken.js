import Url from "../utils/url-data"
import useLogin from "./use-login"

const useRefreshToken = () => {

    const { url_renovar_sesion } = Url()

    const { logout } = useLogin()

    const refresh = async (setToken) => {

        const response = await fetch(url_renovar_sesion, {
            method: 'GET',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            credentials: "include"
        })

        if (!response.ok) {

            const ErrorData = await response.json()

            alert(ErrorData.message)

            return await logout()
        }

        const data = await response.json()

        setToken(data.token_nuevo)
        alert(data.message)

        return data
    }

    return { refresh }
}

export default useRefreshToken