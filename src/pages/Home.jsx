import { useEffect, useState } from "react"
import { useAuth } from "../hooks/context/auth-context"
import { useNavigate } from "react-router-dom"
import { Outlet } from "react-router-dom"
import Footer from "../components/Footer"
import NavBar from "../components/Navbar"
import OffCanvas from "../components/OffCanvas"

const Home = () => {

    const [show, setshow] = useState(false)

    const { token } = useAuth()

    const navigate = useNavigate()

    useEffect(() => {

        if (!token) {
            navigate('/', { replace: true })
        }

    }, [token, navigate])

    return (
        <>
            <NavBar setshow={setshow} />
            <OffCanvas show={show} setshow={setshow} />
            <Outlet /> {/*Contenido dinamico */}
            <Footer />
        </>
    )
}

export default Home