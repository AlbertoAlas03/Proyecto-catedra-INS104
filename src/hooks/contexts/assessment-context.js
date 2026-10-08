import { createContext, useState, useEffect, useContext } from "react";

export const AssessmentContext = createContext()

export const AssessmentProvider = ({ children }) => {

    const [assessment, setAssessment] = useState([])

    return (
        <AssessmentContext.Provider value={{
            assessment,
            setAssessment
        }}>
            {children}
        </AssessmentContext.Provider>
    )
}

export const CallAssessment = () => useContext(AssessmentContext)