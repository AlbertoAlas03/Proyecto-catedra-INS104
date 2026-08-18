import { createContext, useState, useEffect, useContext } from "react";

export const LanguageContext = createContext()

export const LanguageProvider = ({ children }) => {

    const [Language, setLanguages] = useState([])

    return (
        <LanguageContext.Provider value={{
            Language,
            setLanguages
        }}>
            {children}
        </LanguageContext.Provider>
    )
}

export const CallLanguage = () => useContext(LanguageContext)