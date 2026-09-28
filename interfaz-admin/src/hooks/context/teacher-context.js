import { createContext, useState, useEffect, useContext } from "react";

export const TeacherContext = createContext()

export const TeacherProvider = ({ children }) => {

    const [Teachers, setTeachers] = useState([])

    return (
        <TeacherContext.Provider value={{
            Teachers,
            setTeachers
        }}>
            {children}
        </TeacherContext.Provider>
    )
}

export const CallTeacher = () => useContext(TeacherContext)