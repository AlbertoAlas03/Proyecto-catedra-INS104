import NoData from "../components/NoData"
import useTeacherAssigment from "../hooks/use-teacher-assigment"
import { useEffect, useState } from "react"
import { useAuth } from "../hooks/context/auth-context"
import AssigmentTeacherModal from "../components/AssigmentTeacherModal"
import Swal from "sweetalert2"
import UpdateAssignmentModal from "../components/UpdateAssignmentModal"
import Select from "react-select"
import { Container, Spinner } from "react-bootstrap"
import useCourse from "../hooks/use-course"

const TeacherAssigment = () => {

    const [showAssigmentModal, setshowAssigmentModal] = useState(false)
    const [updateData, setupdateData] = useState([])
    const [showUpdateModal, setShowUpdateModal] = useState(false)
    const [isSearching, setisSearching] = useState(false)
    const [AssignmentSelected, setAssignmentSelected] = useState(null)
    const [assignmentID, setassignmentID] = useState('')

    const { list_cursos_no_iniciados } = useCourse()

    const {
        list_teacher_assigment,
        teacherAssigment,
        delete_assingment,
        search_assignment,
        searchData,
        setsearchData,
        loading,
        list_teachers,
        totalPaginas,
        paginaActual,
        setPaginaActual
    } = useTeacherAssigment()

    const { token } = useAuth()

    const optionsTeacherAssignment = teacherAssigment.map((t) => ({
        value: t.asignacion_id,
        label: `${t.profesor.apellido} - ${t.curso.nombre} - ${t.curso.programa} - ${t.curso.modalidad}`
    }))

    const handleChangeAssignment = (assignmentSelected) => {
        setAssignmentSelected(assignmentSelected)
        setassignmentID(assignmentSelected ? assignmentSelected.value : '')
    }

    const handledelete = async (asignacion_id) => {

        const response_modal = await Swal.fire({
            title: "¿Estas seguro de eliminar esta asignación?",
            icon: "warning",
            allowEscapeKey: false,
            allowOutsideClick: false,
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            }
        })

        if (response_modal.isConfirmed) {
            try {

                const response = await delete_assingment(token, asignacion_id)

                if (response) {
                    await Swal.fire({
                        title: response.message,
                        icon: "success",
                        draggable: false,
                        allowEscapeKey: false,
                        allowOutsideClick: false
                    })
                    list_teacher_assigment(token)
                    setassignmentID('')
                    setisSearching(false)
                    setAssignmentSelected(null)
                    setsearchData(null)
                }

            } catch (error) {

                alert(error.message || 'Error al eliminar la asignacion')
            }
        }
    }

    const showModalDeleteWarning = async () => {
        await Swal.fire({
            title: "No puedes eliminar esta asignación porque esta activa!",
            icon: "error",
            draggable: false,
            allowEscapeKey: false,
            allowOutsideClick: false
        })
    }


    const showModalUpdateWarning = async () => {
        await Swal.fire({
            title: "No puedes actualizar esta asignación!",
            icon: "error",
            draggable: false,
            allowEscapeKey: false,
            allowOutsideClick: false
        })
    }

    const handleReset = () => {
        setAssignmentSelected(null)
        setisSearching(false)
        setassignmentID('')
        setsearchData(null)
    }

    const handleSearch = async () => {
        try {

            await search_assignment(token, assignmentID)
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
        list_teacher_assigment(token)
        list_cursos_no_iniciados(token)
        list_teachers(token)
    }, [paginaActual])

    if (loading) {
        return (
            <Container
                fluid
                className="d-flex flex-column justify-content-center align-items-center"
                style={{ height: '100vh', background: '#f5f7fa' }}
            >
                <Spinner animation="border" variant="primary" role="status" style={{ width: '4rem', height: '4rem' }} />

                <p className="mt-4 fs-5 text-secondary">Cargando, por favor espera...</p>
            </Container>
        )
    }

    return (
        <>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className="h2"><i className="bi bi-person-video3"></i> Asignación de profesores</h1>
            </div>
            <div className="row g-4 mb-3 align-items-center">
                <div className="col-auto">
                    <button type="button" className="btn btn-success" onClick={() => setshowAssigmentModal(true)}><i className="bi bi-plus"></i> Nueva asignación</button>
                </div>
                <div className="col ms-auto">
                    <div className="d-flex" style={{ maxWidth: '400px', marginLeft: 'auto' }}>
                        <Select
                            isDisabled={isSearching}
                            className="w-100"
                            options={optionsTeacherAssignment}
                            value={AssignmentSelected}
                            onChange={handleChangeAssignment}
                            placeholder="Buscar asignación..."
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
                    searchData ? (
                        <div className="table-responsive">
                            <table className="table table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Profesor</th>
                                        <th scope="col">Correo</th>
                                        <th scope="col">Curso</th>
                                        <th scope="col">Idioma</th>
                                        <th scope="col">Programa</th>
                                        <th scope="col">Modalidad</th>
                                        <th scope="col">Horario</th>
                                        <th scope="col">Inscritos</th>
                                        <th scope="col">Estado</th>
                                        <th scope="col">Fecha de asignación</th>
                                        <th scope="col">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        <tr key={searchData.asignacion_id}>
                                            <th scope="row">{searchData.asignacion_id}</th>
                                            <td>{searchData.profesor.nombre + ' ' + searchData.profesor.apellido}</td>
                                            <td>{searchData.profesor.email}</td>
                                            <td>{searchData.curso.nombre}</td>
                                            <td>{searchData.curso.idioma.nombre}</td>
                                            <td>{searchData.curso.programa}</td>
                                            <td>{searchData.curso.modalidad}</td>
                                            <td>{searchData.curso.horario}</td>
                                            <td className="text-center">{searchData.curso.total_inscripciones}</td>
                                            <td className="text-center">
                                                <span
                                                    className={searchData.curso.estado === 'activo' ? 'badge text-bg-success' : searchData.curso.estado === 'finalizado' ? 'badge text-bg-danger' : 'badge text-bg-warning'}
                                                >
                                                    {searchData.curso.estado}
                                                </span>
                                            </td>
                                            <td>{searchData ? new Date(searchData.fecha_asignacion).toISOString().split('T')[0] : 'Fecha no disponible'}</td>
                                            <td>

                                                <div className="d-flex">
                                                    <button type="button" className='btn btn-warning' onClick={() => {
                                                        if (searchData.curso.estado === 'activo' || searchData.curso.estado === 'finalizado') {
                                                            showModalUpdateWarning()
                                                        } else {

                                                            const updateData = {
                                                                asignacion_id: searchData.asignacion_id,
                                                                curso_id: searchData.curso_id,
                                                                profesor_id: searchData.profesor_id
                                                            }

                                                            setupdateData(updateData)
                                                            setShowUpdateModal(true)
                                                        }
                                                    }}><i className="bi bi-pencil-square"></i> Actualizar</button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger"
                                                        style={{ marginLeft: '10px' }}
                                                        onClick={() => {
                                                            if (searchData.curso.estado === 'activo') {
                                                                showModalDeleteWarning()
                                                            } else {
                                                                handledelete(searchData.asignacion_id)
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
                        teacherAssigment.length > 0 ? (
                            <>
                                <div className="table-responsive">
                                    <table className="table table-striped table-hover">
                                        <thead>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Profesor</th>
                                                <th scope="col">Correo</th>
                                                <th scope="col">Curso</th>
                                                <th scope="col">Idioma</th>
                                                <th scope="col">Programa</th>
                                                <th scope="col">Modalidad</th>
                                                <th scope="col">Horario</th>
                                                <th scope="col">Inscritos</th>
                                                <th scope="col">Estado</th>
                                                <th scope="col">Fecha de asignación</th>
                                                <th scope="col">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                teacherAssigment.map((Teacher) => (
                                                    <tr key={Teacher.asignacion_id}>
                                                        <th scope="row">{Teacher.asignacion_id}</th>
                                                        <td>{Teacher.profesor.nombre + ' ' + Teacher.profesor.apellido}</td>
                                                        <td>{Teacher.profesor.email}</td>
                                                        <td>{Teacher.curso.nombre}</td>
                                                        <td>{Teacher.curso.idioma.nombre}</td>
                                                        <td>{Teacher.curso.programa}</td>
                                                        <td>{Teacher.curso.modalidad}</td>
                                                        <td>{Teacher.curso.horario}</td>
                                                        <td className="text-center">{Teacher.curso.total_inscripciones}</td>
                                                        <td className="text-center">
                                                            <span
                                                                className={Teacher.curso.estado === 'activo' ? 'badge text-bg-success' : Teacher.curso.estado === 'finalizado' ? 'badge text-bg-danger' : 'badge text-bg-warning'}
                                                            >
                                                                {Teacher.curso.estado}
                                                            </span>
                                                        </td>
                                                        <td>{new Date(Teacher.fecha_asignacion).toISOString().split('T')[0]}</td>
                                                        <td>

                                                            <div className="d-flex">
                                                                <button type="button" className='btn btn-warning' onClick={() => {
                                                                    if (Teacher.curso.estado === 'activo' || Teacher.curso.estado === 'finalizado') {
                                                                        showModalUpdateWarning()
                                                                    } else {

                                                                        const updateData = {
                                                                            asignacion_id: Teacher.asignacion_id,
                                                                            curso_id: Teacher.curso_id,
                                                                            profesor_id: Teacher.profesor_id
                                                                        }

                                                                        setupdateData(updateData)
                                                                        setShowUpdateModal(true)
                                                                    }
                                                                }}><i className="bi bi-pencil-square"></i> Actualizar</button>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-danger"
                                                                    style={{ marginLeft: '10px' }}
                                                                    onClick={() => {
                                                                        if (Teacher.curso.estado === 'activo') {
                                                                            showModalDeleteWarning()
                                                                        } else {
                                                                            handledelete(Teacher.asignacion_id)
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
            {
                showAssigmentModal && (
                    <AssigmentTeacherModal showModal={showAssigmentModal} setShowModal={setshowAssigmentModal} token={token} list_teacher_assigment={list_teacher_assigment} setisSearching={setisSearching} setassignmentID={setassignmentID} setAssignmentSelected={setAssignmentSelected} setsearchData={setsearchData} />
                )
            }
            {
                showUpdateModal && (
                    <UpdateAssignmentModal showModal={showUpdateModal} setShowModal={setShowUpdateModal} token={token} updateData={updateData} list_teacher_assigment={list_teacher_assigment} setisSearching={setisSearching} setassignmentID={setassignmentID} setAssignmentSelected={setAssignmentSelected} setsearchData={setsearchData} />
                )
            }


        </>
    )

}

export default TeacherAssigment