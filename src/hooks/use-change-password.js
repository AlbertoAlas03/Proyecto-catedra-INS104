import { url_send_email, url_change_password, url_cancel_change } from "../utils/url-data"

const useChangePassword = () => {

    const sendEmail = async (email) => {

        const response = await fetch(url_send_email, {
            method: 'POST',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || 'Error en el servidor')
        }

        const data = await response.json()
        return data
    }

    const changePassword = async (Data) => {

        const response = await fetch(url_change_password, {
            method: 'POST',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(Data)
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || 'Error en el servidor')
        }

        const data = await response.json()
        return data
    }

    const cancelChange = async (email) => {

        const response = await fetch(url_cancel_change, {
            method: 'POST',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || 'Error en el servidor')
        }

        const data = await response.json()
        return data

    }

    return { sendEmail, changePassword, cancelChange }
}

export default useChangePassword