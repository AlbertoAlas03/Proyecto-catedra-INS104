import { url_session } from '../utils/request-url'

const useSession = () => {

    const get_session = async () => {

        const response = await fetch(url_session, {
            method: 'GET',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            credentials: 'include'
        });

        if (!response.ok) {
            const ErrorData = await response.json();
            throw new Error(ErrorData.message || 'Error en el servidor');
        }

        const data = await response.json();

        return data
    }

    return { get_session }
}

export default useSession