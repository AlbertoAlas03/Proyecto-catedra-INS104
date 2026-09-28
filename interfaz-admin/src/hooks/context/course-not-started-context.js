import { createContext, useState, useEffect, useContext } from "react";

export const CourseNotStartedContext = createContext()

export const CourseNotStartedProvider = ({ children }) => {

    const [CourseNotStarted, setCourseNotStarted] = useState([])

    return (
        <CourseNotStartedContext.Provider value={{
            CourseNotStarted,
            setCourseNotStarted
        }}>
            {children}
        </CourseNotStartedContext.Provider>
    )
}

export const CallCourseNotStarted = () => useContext(CourseNotStartedContext)