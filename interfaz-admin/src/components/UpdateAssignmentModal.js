import { useEffect, useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import Select from 'react-select';
import useTeacherAssigment from '../hooks/use-teacher-assigment';
import Swal from 'sweetalert2';
import { CallCourseNotStarted } from '../hooks/context/course-not-started-context';
import { CallTeacher } from '../hooks/context/teacher-context';

const UpdateAssignmentModal = ({
    showModal,
    setShowModal,
    token,
    updateData,
    list_teacher_assigment,
    setisSearching,
    setassignmentID,
    setAssignmentSelected,
    setsearchData
}) => {

    const [error, setError] = useState(null)
    const [isProcessing, setisProcessing] = useState(false)
    const [selectedCourse, setSelectedCourse] = useState(null)
    const [courseId, setCourseId] = useState('')
    const [selectedTeacher, setSelectedTeacher] = useState(null)
    const [teacherId, setTeacherId] = useState('')
    const [assignmentID, setAssignmentID] = useState('')

    const { update_assignment } = useTeacherAssigment()

    const { Teachers } = CallTeacher()

    const { CourseNotStarted } = CallCourseNotStarted()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setisProcessing(true)
        setError(null)

        const data_assignment = {
            asignacion_id: assignmentID,
            curso_id: courseId,
            profesor_id: teacherId
        }

        try {

            const response = await update_assignment(token, data_assignment)

            if (response) {
                await Swal.fire({
                    title: response.message,
                    icon: "success",
                    draggable: false,
                    allowEscapeKey: false,
                    allowOutsideClick: false
                })
                setisProcessing(false)
                setShowModal(false)
                clearForm()
                list_teacher_assigment(token)
                setisSearching(false)
                setAssignmentSelected(null)
                setassignmentID('')
                setsearchData(null)
            }

        } catch (error) {

            setError(error.message || 'No se pudo actualizar la asignacion')
            setisProcessing(false)
        }
    }


    const handleChangeTeacher = (TeacherSelected) => {

        setSelectedTeacher(TeacherSelected)
        setTeacherId(TeacherSelected ? TeacherSelected.value : '')
    }

    const handleChangeCourse = (CourseSelected) => {

        setSelectedCourse(CourseSelected)
        setCourseId(CourseSelected ? CourseSelected.value : '')
    }

    const optionsTeacher = Teachers.map((t) => ({
        value: t.usuario_id,
        label: `${t.nombre} ${t.apellido}`
    }));

    const optionsCourse = CourseNotStarted.map((c) => ({
        value: c.curso_id,
        label: `${c.nombre} - ${c.programa} - ${c.modalidad}`
    }))

    const clearForm = () => {
        setSelectedCourse(null)
        setSelectedTeacher(null)
        setCourseId('')
        setTeacherId('')
        setAssignmentID('')
    }

    useEffect(() => {
        if (updateData && Teachers.length > 0 && CourseNotStarted.length > 0) {
            const FoundTeacher = optionsTeacher.find(opt => opt.value === updateData.profesor_id)
            setSelectedTeacher(FoundTeacher)
            setTeacherId(updateData.profesor_id)

            const FoundCourse = optionsCourse.find(opt => opt.value === updateData.curso_id)
            setSelectedCourse(FoundCourse)
            setCourseId(updateData.curso_id)

            setAssignmentID(updateData.asignacion_id)
        }
    }, [updateData, Teachers, CourseNotStarted])

    return (
        <Modal
            show={showModal}
            onHide={() => {
                setShowModal(false)
                setError(null)
                clearForm()
            }}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title><i className="bi bi-pencil-square" style={{ fontSize: '30px' }}></i> Actualizar asignación</Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <Form onSubmit={handleSubmit}>
                    {error && (
                        <div className="alert alert-danger d-flex align-items-center" role="alert">
                            <button className="me-2" style={{ background: 'transparent', border: 'none' }} onClick={() => setError(null)}>
                                <i className="bi bi-x-circle-fill"></i>
                            </button>
                            {error}
                        </div>
                    )}
                    {isProcessing && (
                        <div className="alert alert-info d-flex align-items-center" role="alert">
                            <i className="bi bi-hourglass-split me-2"></i>
                            Procesando, por favor espere...
                        </div>
                    )}
                    <fieldset disabled={isProcessing}>
                        <div className="row">

                            <div className="mb-3">
                                <label className="form-label">
                                    <i className="bi bi-person-video3"></i> Profesores
                                </label>
                                <Select
                                    options={optionsTeacher}
                                    value={selectedTeacher}
                                    onChange={handleChangeTeacher}
                                    placeholder="Seleccionar profesor..."
                                    isClearable
                                    noOptionsMessage={() => 'No hay coincidencias'}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">
                                    <i className="bi bi-journal"></i> Cursos
                                </label>
                                <Select
                                    options={optionsCourse}
                                    value={selectedCourse}
                                    onChange={handleChangeCourse}
                                    placeholder="Seleccionar curso..."
                                    isClearable
                                    noOptionsMessage={() => 'No hay coincidencias'}
                                />
                            </div>

                        </div>

                        <hr />

                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="success" type="submit">
                                <i className="bi bi-check-lg"></i> Actualizar
                            </Button>
                            <Button variant="danger" onClick={() => {
                                setShowModal(false)
                                setError(null)
                                clearForm()
                            }}>
                                <i className="bi bi-x"></i> Cancelar
                            </Button>
                        </div>
                    </fieldset>
                </Form>

            </Modal.Body>
        </Modal >
    )

}

export default UpdateAssignmentModal