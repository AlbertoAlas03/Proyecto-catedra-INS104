import { Navbar, Button, Container, NavDropdown } from "react-bootstrap"
import { Link } from "react-router-dom"
import Swal from "sweetalert2"
import useLogin from "../hooks/use-login"
import { useAuth } from "../hooks/context/auth-context"

const NavBar = ({ setshow }) => {

    const { logout } = useLogin()

    const { user } = useAuth()

    const handleLogout = async () => {
        const modal_confirm = await Swal.fire({
            title: '¿Estas seguro que quieres cerrar sesión?',
            icon: 'question',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
            allowEscapeKey: false,
            allowOutsideClick: false,
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            }
        })

        if (modal_confirm.isConfirmed) {
            try {

                const response = await logout()

                if (response) {
                    alert(response.message)
                }

            } catch (error) {

                await Swal.fire({
                    title: error.message,
                    icon: 'error',
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                    draggable: false
                })
            }
        }
    }

    return (
        <Navbar className="bg-body-tertiary sticky-top">
            <Container>
                <Button className="btn btn-dark ms-3" onClick={() => setshow(true)}>
                    <i className="bi bi-list"></i>
                </Button>
                <Navbar.Collapse className="justify-content-end">
                    <NavDropdown title={user ? `${user.nombre} ${user.apellido}` : ''} id="basic-nav-dropdown">
                        <NavDropdown.Item as={Link} to="/home/myaccount"><i className="bi bi-person"></i> Mi perfil</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item onClick={() => handleLogout()}>
                            <i className="bi bi-box-arrow-left"></i> Cerrar sesión
                        </NavDropdown.Item>
                    </NavDropdown>
                </Navbar.Collapse>
            </Container>
        </Navbar >
    )

}

export default NavBar