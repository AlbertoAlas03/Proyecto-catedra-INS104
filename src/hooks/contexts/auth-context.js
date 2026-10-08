import { createContext, useState, useContext, useEffect } from "react";
import useSession from "../use-session";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const { get_session } = useSession()

    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null)

    const fetchData = async () => {
        try {

            const response = await get_session()

            if (response) {
                setToken(response.data.token)
                setUser(response.data.usuario)
            }

        } catch (error) {

        }
    }

    useEffect(() => {
        fetchData()
    }, []);


    return (
        <AuthContext.Provider value={{ token, setToken, user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);