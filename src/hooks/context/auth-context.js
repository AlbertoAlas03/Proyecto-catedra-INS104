import { createContext, useState, useContext, useEffect } from "react";
import { get_session } from "../use-session";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

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
            //nothing to do
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