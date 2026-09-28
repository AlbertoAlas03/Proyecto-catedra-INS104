import { useEffect, useState } from "react"
import useCourse from "../hooks/use-course"
import { useAuth } from "../hooks/context/auth-context"
import AddCourseModal from "../components/AddCourseModal"
import NoData from '../components/NoData'
import Swal from "sweetalert2"
import UpdateCourseModal from "../components/UpdateCourseModal"
import Select from "react-select"
import { Container, Spinner } from "react-bootstrap"

const Course = () => {

    const [showAddModal, setShowAddModal] = useState(false)
    const [showUpdateModal, setShowUpdateModal] = useState(false)
    const [updateData, setUpdateData] = useState([])
    const [isSearching, setisSearching] = useState(false)
    const [CourseSelected, setCourseSelected] = useState(null)
    const [courseID, setcourseID] = useState('')

    const { list_course, course, delete_course, search_curso, courseSearched, setcourseSearched, loading, totalPaginas, paginaActual, setPaginaActual } = useCourse()

    const { token } = useAuth()

    const optionsCourse = course.map((c) => ({
        value: c.curso_id,
        label: `${c.nombre} - ${c.programa} - ${c.modalidad}`
    }))

    const handleChangeCourse = (CourseSelected) => {

        setCourseSelected(CourseSelected)
        setcourseID(CourseSelected ? CourseSelected.value : '')
    }

    const handleDelete = async (curso_id) => {

        const response_modal = await Swal.fire({
            title: "¿Estas seguro de eliminar este curso?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger",
            },
            allowEscapeKey: false,
            allowOutsideClick: false
        })

        if (response_modal.isConfirmed) {

            try {

                const response = await delete_course(token, curso_id)

                if (response) {
                    await Swal.fire({
                        title: response.message,
                        icon: "success",
                        draggable: false,
                        allowEscapeKey: false,
                        allowOutsideClick: false
                    })
                    list_course(token)
                    setisSearching(false)
                    setCourseSelected(null)
                    setcourseID('')
                    setcourseSearched(null)
                }

            } catch (error) {

                await Swal.fire({
                    title: error.message,
                    icon: "error",
                    draggable: false,
                    allowEscapeKey: false,
                    allowOutsideClick: false
                })
            }
        }

    }

    const handleSearch = async () => {

        try {

            await search_curso(token, courseID)
            setisSearching(true)

        } catch (error) {

            await Swal.fire({
                title: error.message,
                icon: "error",
                draggable: false,
                allowEscapeKey: false,
                allowOutsideClick: false
            })
        }
    }

    const Modal_warning_delete = async () => {
        await Swal.fire({
            title: "¡No puedes eliminar este curso, por que esta activo!",
            icon: "error",
            draggable: false,
            allowEscapeKey: false,
            allowOutsideClick: false
        })
    }

    const modal_warning_udpate = async () => {
        await Swal.fire({
            title: "¡No puedes actualizar este curso!",
            icon: "error",
            draggable: false,
            allowEscapeKey: false,
            allowOutsideClick: false
        })
    }

    const handleReset = () => {
        setisSearching(false)
        setCourseSelected(null)
        setcourseID('')
        setcourseSearched(null)
    }

    const siguiente = () => {
        if (paginaActual < totalPaginas) {
            setPaginaActual(paginaActual + 1)
        }
    }

    const anterior = () => {
        if (paginaActual > 1) {
            setPaginaActual(paginaActual - 1)
        }
    }

    useEffect(() => {
        list_course(token)
    }, [paginaActual])

    if (loading) {
        return (
            <Container
                fluid
                className="d-flex flex-column justify-content-center align-items-center"
                style={{ height: '100vh', background: '#f5f7fa' }}
            >
                <Spinner animation="border" variant="primary" role="status" style={{ width: '4rem', height: '4rem' }} />

                <p className="mt-4 fs-5 text-secondary">Cargando cursos, por favor espera...</p>
            </Container>
        )
    }

    return (
        <>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className="h2"><i className="bi bi-journal"></i> Gestión de cursos</h1>
            </div>
            <div className="row g-4 mb-3 align-items-center">
                <div className="col-auto">
                    <button type="button" className="btn btn-success" onClick={() => setShowAddModal(true)}><i className="bi bi-journal-plus"></i> Registrar nuevo curso</button>
                </div>
                <div className="col ms-auto">
                    <div className="d-flex" style={{ maxWidth: '400px', marginLeft: 'auto' }}>
                        <Select
                            isDisabled={isSearching}
                            className="w-100"
                            options={optionsCourse}
                            value={CourseSelected}
                            onChange={handleChangeCourse}
                            placeholder="Buscar curso..."
                            isClearable
                            noOptionsMessage={() => 'No hay coincidencias'}
                        />
                        <button type="button" className={isSearching ? 'btn btn-success' : 'btn btn-primary'} style={{ marginLeft: '5px' }}
                            onClick={() => {
                                if (isSearching) {
                                    handleReset()
                                } else {
                                    handleSearch()
                                }

                            }}>
                            <i className={isSearching ? 'bi bi-arrow-repeat' : 'bi bi-search'}></i>
                        </button>
                    </div>
                </div>
                {
                    courseSearched ? (
                        <div className="table-responsive">
                            <table className="table table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Nombre</th>
                                        <th scope="col">Descripción</th>
                                        <th scope="col">Idioma</th>
                                        <th scope="col">Programa</th>
                                        <th scope="col">Modalidad</th>
                                        <th scope="col">Horario</th>
                                        <th scope="col">Fecha inicio</th>
                                        <th scope="col">Fecha fin</th>
                                        <th scope="col">Cupos</th>
                                        <th scope="col">Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {

                                        <tr key={courseSearched.curso_id}>
                                            <th scope="row">{courseSearched.curso_id}</th>
                                            <td>{courseSearched.nombre}</td>
                                            <td>{courseSearched.descripcion}</td>
                                            <td>{courseSearched.idioma.nombre}</td>
                                            <td>{courseSearched.programa}</td>
                                            <td>{courseSearched.modalidad}</td>
                                            <td>{courseSearched.horario}</td>
                                            <td>{courseSearched ? new Date(courseSearched.fecha_inicio).toISOString().split('T')[0] : 'Fecha no disponible'}</td>
                                            <td>{courseSearched ? new Date(courseSearched.fecha_fin).toISOString().split('T')[0] : 'Fecha no disponible'}</td>
                                            <td className="text-center">{courseSearched.capacidad_maxima}</td>
                                            <td className="text-center">
                                                <span className={
                                                    courseSearched.estado === 'activo' ? 'badge text-bg-success' : courseSearched.estado === 'finalizado' ? 'badge text-bg-danger' : 'badge text-bg-warning'
                                                }>
                                                    {
                                                        courseSearched.estado === 'activo' ? 'activo' : courseSearched.estado === 'finalizado' ? 'finalizado' : 'no iniciado'
                                                    }
                                                </span>
                                            </td>
                                            <td>
                                                <div className="d-flex">
                                                    <button type="button" className='btn btn-warning' onClick={() => {

                                                        if (courseSearched.estado === 'activo' || courseSearched.estado === 'finalizado') {
                                                            modal_warning_udpate()
                                                        } else {

                                                            const data = {
                                                                curso_id: courseSearched.curso_id,
                                                                idioma_id: courseSearched.idioma.idioma_id,
                                                                nombre: courseSearched.nombre,
                                                                descripcion: courseSearched.descripcion,
                                                                programa: courseSearched.programa,
                                                                modalidad: courseSearched.modalidad,
                                                                horario: courseSearched.horario,
                                                                fecha_inicio: new Date(courseSearched.fecha_inicio).toISOString().split('T')[0],
                                                                fecha_fin: new Date(courseSearched.fecha_fin).toISOString().split('T')[0],
                                                                capacidad_maxima: courseSearched.capacidad_maxima
                                                            }

                                                            setUpdateData(data)

                                                            setShowUpdateModal(true)
                                                        }

                                                    }}><i className='bi bi-pencil-square'></i> Actualizar</button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger"
                                                        style={{ marginLeft: '10px' }}
                                                        onClick={() => {
                                                            if (courseSearched.estado === 'activo') {
                                                                Modal_warning_delete()
                                                            } else {
                                                                handleDelete(courseSearched.curso_id)
                                                            }
                                                        }}
                                                    ><i className="bi bi-trash3"></i> Eliminar</button>
                                                </div>
                                            </td>
                                        </tr>

                                    }

                                </tbody>
                            </table>
                        </div>
                    ) : (
                        course.length > 0 ? (
                            <>
                                <div className="table-responsive">
                                    <table className="table table-striped table-hover">
                                        <thead>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Nombre</th>
                                                <th scope="col">Descripción</th>
                                                <th scope="col">Idioma</th>
                                                <th scope="col">Programa</th>
                                                <th scope="col">Modalidad</th>
                                                <th scope="col">Horario</th>
                                                <th scope="col">Fecha inicio</th>
                                                <th scope="col">Fecha fin</th>
                                                <th scope="col">Cupos</th>
                                                <th scope="col">Estado</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                course.map((Course) => (
                                                    <tr key={Course.curso_id}>
                                                        <th scope="row">{Course.curso_id}</th>
                                                        <td>{Course.nombre}</td>
                                                        <td>{Course.descripcion}</td>
                                                        <td>{Course.idioma.nombre}</td>
                                                        <td>{Course.programa}</td>
                                                        <td>{Course.modalidad}</td>
                                                        <td>{Course.horario}</td>
                                                        <td>{new Date(Course.fecha_inicio).toISOString().split('T')[0]}</td>
                                                        <td>{new Date(Course.fecha_fin).toISOString().split('T')[0]}</td>
                                                        <td className="text-center">{Course.capacidad_maxima}</td>
                                                        <td className="text-center">
                                                            <span className={
                                                                Course.estado === 'activo' ? 'badge text-bg-success' : Course.estado === 'finalizado' ? 'badge text-bg-danger' : 'badge text-bg-warning'
                                                            }>
                                                                {
                                                                    Course.estado === 'activo' ? 'activo' : Course.estado === 'finalizado' ? 'finalizado' : 'no iniciado'
                                                                }
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <div className="d-flex">
                                                                <button type="button" className='btn btn-warning' onClick={() => {

                                                                    if (Course.estado === 'activo' || Course.estado === 'finalizado') {
                                                                        modal_warning_udpate()
                                                                    } else {

                                                                        const data = {
                                                                            curso_id: Course.curso_id,
                                                                            idioma_id: Course.idioma.idioma_id,
                                                                            nombre: Course.nombre,
                                                                            descripcion: Course.descripcion,
                                                                            programa: Course.programa,
                                                                            modalidad: Course.modalidad,
                                                                            horario: Course.horario,
                                                                            fecha_inicio: new Date(Course.fecha_inicio).toISOString().split('T')[0],
                                                                            fecha_fin: new Date(Course.fecha_fin).toISOString().split('T')[0],
                                                                            capacidad_maxima: Course.capacidad_maxima
                                                                        }

                                                                        setUpdateData(data)

                                                                        setShowUpdateModal(true)
                                                                    }

                                                                }}><i className='bi bi-pencil-square'></i> Actualizar</button>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-danger"
                                                                    style={{ marginLeft: '10px' }}
                                                                    onClick={() => {
                                                                        if (Course.estado === 'activo') {
                                                                            Modal_warning_delete()
                                                                        } else {
                                                                            handleDelete(Course.curso_id)
                                                                        }
                                                                    }}
                                                                ><i className="bi bi-trash3"></i> Eliminar</button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            }

                                        </tbody>
                                    </table>
                                </div>
                                <div className="d-flex justify-content-center">
                                    <ul className="pagination">

                                        <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}>
                                            <button className="page-link" onClick={anterior} disabled={paginaActual === 1}>
                                                ← Anterior
                                            </button>
                                        </li>

                                        {Array.from({ length: totalPaginas }, (_, index) => {
                                            const numero = index + 1;
                                            return (
                                                <li
                                                    key={numero}
                                                    className={`page-item ${paginaActual === numero ? 'active' : ''}`}
                                                >
                                                    <button
                                                        className="page-link"
                                                        onClick={() => setPaginaActual(numero)}
                                                    >
                                                        {numero}
                                                    </button>
                                                </li>
                                            );
                                        })}

                                        <li className={`page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`}>
                                            <button
                                                className="page-link"
                                                onClick={siguiente}
                                                disabled={paginaActual === totalPaginas}
                                            >
                                                Siguiente →
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </>
                        ) : (
                            <NoData />
                        )
                    )

                }
            </div >

            <AddCourseModal showModal={showAddModal} setShowModal={setShowAddModal} token={token} list_course={list_course} setcourseID={setcourseID} setCourseSelected={setCourseSelected} setisSearching={setisSearching} setcourseSearched={setcourseSearched} />

            <UpdateCourseModal showModal={showUpdateModal} setShowModal={setShowUpdateModal} updateData={updateData} token={token} list_course={list_course} setcourseID={setcourseID} setCourseSelected={setCourseSelected} setisSearching={setisSearching} setcourseSearched={setcourseSearched} />

        </>
    )
}

export default Course