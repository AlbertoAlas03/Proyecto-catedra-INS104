import Footer from "../components/Footer"
import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import NavBar from "../components/Navbar"
import OffCanvas from "../components/OffCanvas"
import { useAuth } from "../hooks/contexts/auth-context"
import { useNavigate } from "react-router-dom"

const Home = () => {

    const [show, setshow] = useState(false)
    const navigate = useNavigate()
    const { token } = useAuth()

    useEffect(() => {
        if (!token) {
            navigate('/', { replace: true })
        }
    }, [token, navigate])

    return (
        <>
            <NavBar setshow={setshow} />
            <OffCanvas show={show} setshow={setshow} />
            <Footer />
            {/* Contenido dinamico */}
            <Outlet />
        </>
    )
}

export default Home