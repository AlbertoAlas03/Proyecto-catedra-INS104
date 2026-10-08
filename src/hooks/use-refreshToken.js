import { url_refresh_token } from "../utils/request-url"
import useLogin from "./use-login"

const useRefreshToken = () => {

    const { logout } = useLogin()

    const refresh = async (setToken) => {

        const response = await fetch(url_refresh_token, {
            method: 'GET',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            credentials: 'include'
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