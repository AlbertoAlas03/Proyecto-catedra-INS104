import { createContext, useState, useContext, useEffect } from "react";

const CourseContext = createContext();

export const CourseProvider = ({ children }) => {

    const [courses, setCourses] = useState([]);
    const [nombre, setNombre] = useState('')
    const [programa, setPrograma] = useState('')
    const [modalidad, setModalidad] = useState('')
    const [estado, setEstado] = useState('')

    return (
        <CourseContext.Provider value={{
            courses,
            setCourses,
            nombre,
            setNombre,
            programa,
            setPrograma,
            modalidad,
            setModalidad,
            estado,
            setEstado
        }}>
            {children}
        </CourseContext.Provider>
    );
};

export const CallCourses = () => useContext(CourseContext);