import { useEffect, useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import useTeacherAssigment from '../hooks/use-teacher-assigment';
import Swal from 'sweetalert2';
import Select from 'react-select';
import { CallCourseNotStarted } from '../hooks/context/course-not-started-context';
import { CallTeacher } from '../hooks/context/teacher-context';

const AssigmentTeacherModal = ({
    showModal,
    setShowModal,
    token,
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

    const { assign_teacher } = useTeacherAssigment()

    const { CourseNotStarted } = CallCourseNotStarted()

    const { Teachers } = CallTeacher()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setisProcessing(true)
        setError(null)

        const data = {
            curso_id: courseId,
            profesor_id: teacherId
        }

        try {

            const response_assignment = await assign_teacher(token, data)

            if (response_assignment) {
                await Swal.fire({
                    title: response_assignment.message,
                    icon: "success",
                    draggable: false,
                    allowEscapeKey: false,
                    allowOutsideClick: false
                })
                setisProcessing(false)
                setShowModal(false)
                clearDroptowns()
                list_teacher_assigment(token)
                setisSearching(false)
                setAssignmentSelected(null)
                setassignmentID('')
                setsearchData(null)
            }

        } catch (error) {

            setError(error.message || 'Error al asignar al profesor')
            setisProcessing(false)
        }
    }

    const clearDroptowns = () => {
        setSelectedCourse(null)
        setSelectedTeacher(null)
        setCourseId('')
        setTeacherId('')
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

    return (
        <Modal
            show={showModal}
            onHide={() => {
                setShowModal(false)
                setError(null)
                clearDroptowns()
            }}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title><i className="bi bi-person-workspace" style={{ fontSize: '30px' }}></i> Asignar profesor</Modal.Title>
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
                                <i className="bi bi-check-lg"></i> Asignar
                            </Button>
                            <Button variant="danger" onClick={() => {
                                setShowModal(false)
                                setError(null)
                                clearDroptowns()
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

export default AssigmentTeacherModal