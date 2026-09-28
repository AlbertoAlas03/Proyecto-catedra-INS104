import { useEffect, useState } from "react"
import { Modal, Button, Form } from "react-bootstrap"
import useCourse from "../hooks/use-course"
import Swal from "sweetalert2"
import { CallLanguage } from "../hooks/context/language-context"
import Select from "react-select"
import { useMemo } from "react"

const UpdateCourseModal = ({ showModal, setShowModal, updateData, token, list_course, setcourseID, setCourseSelected, setisSearching, setcourseSearched }) => {

    const [error, setError] = useState(null)
    const [isProcessing, setisProcessing] = useState(false)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [selectedLanguageId, setSelectedLanguageId] = useState('')
    const [cursoID, setcursoID] = useState('')
    const [program, setProgram] = useState('')
    const [modalidad, setModalidad] = useState('')
    const [horario, setHorario] = useState('')
    const [date_init, setDate_init] = useState(null)
    const [date_finish, setDate_finish] = useState(null)
    const [cupo, setCupo] = useState('')
    const [LanguageSelected, setLanguageSelected] = useState([])

    const { Language } = CallLanguage()

    const { update_course } = useCourse()

    const horarios = [
        "Sábado, 8:00-:11:00 a.m.",
        "Lunes, miércoles y viernes, 7:30-9:00 am",
        "Lunes, miércoles y viernes, 6:00-7:20 p.m.",
        "Sábado, 8:00-11:40 a.m."
    ]

    const programas = [
        "Sabatino en línea",
        "Intensivo en línea",
        "Intensivo presencial",
        "Intensivo sabatino presencial"
    ]

    const modalidades = [
        "En línea",
        "Presencial"
    ]

    const optionsLanguage = useMemo(() =>
        Language.map((L) => ({
            value: L.idioma_id,
            label: `${L.nombre}`
        })),
        [Language]);

    const handleChangeLanguage = (LanguageSelected) => {

        setLanguageSelected(LanguageSelected)
        setSelectedLanguageId(LanguageSelected ? LanguageSelected.value : '')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setisProcessing(true)
        setError(null)

        const data = {
            curso_id: cursoID,
            idioma_id: selectedLanguageId,
            nombre: name,
            descripcion: description,
            programa: program,
            modalidad: modalidad,
            horario: horario,
            fecha_inicio: date_init,
            fecha_fin: date_finish,
            capacidad_maxima: cupo
        }

        try {

            const response = await update_course(token, data)

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
                list_course(token)
                setcourseID('')
                setCourseSelected(null)
                setisSearching(false)
                setcourseSearched(null)
            }

        } catch (error) {

            setError(error.message || 'Error en el servidor')
            setisProcessing(false)

        }
    }

    const clearForm = () => {
        setCupo('')
        setName('')
        setDate_finish(null)
        setDate_init(null)
        setDescription('')
        setSelectedLanguageId('')
        setcursoID('')
        setProgram('')
        setModalidad('')
        setHorario('')
        setLanguageSelected([])
    }

    useEffect(() => {
        if (updateData) {
            setcursoID(updateData.curso_id || 'sin id de curso')
            setName(updateData.nombre || 'Sin nombre')
            setDescription(updateData.descripcion || 'sin descripcion')
            setSelectedLanguageId(updateData.idioma_id || 'Sin id')
            setProgram(updateData.programa || 'sin programa')
            setModalidad(updateData.modalidad || 'sin modalidad')
            setHorario(updateData.horario || 'sin horario')
            setDate_init(updateData.fecha_inicio)
            setDate_finish(updateData.fecha_fin)
            setCupo(updateData.capacidad_maxima || 'no definido')
        }
    }, [updateData])

    useEffect(() => {
        if (selectedLanguageId && optionsLanguage.length > 0) {
            const languageObj = optionsLanguage.find(option => option.value === selectedLanguageId);
            setLanguageSelected(languageObj || null);
        }
    }, [selectedLanguageId, optionsLanguage]);


    return (
        <Modal
            show={showModal}
            onHide={() => {
                setError(null)
                setShowModal(false)
                clearForm()
            }
            }
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title><i className="bi bi-pencil-square" style={{ fontSize: '30px' }}></i> Actualizar curso</Modal.Title>
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

                            <div className="col-md-6">

                                <Form.Group className="mb-3" controlId="formBasicNameCourseedit">
                                    <Form.Label><i className="bi bi-journal-bookmark-fill"></i> Nombre</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nombre del curso"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formBasicDescriptionCourseedit">
                                    <Form.Label><i className="bi bi-journal-bookmark-fill"></i> Descripción</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Descripción del curso"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formBasicLanguageCourseedit">
                                    <Form.Label><i className="bi bi-translate"></i> Idioma</Form.Label>
                                    <Select
                                        className="w-100"
                                        options={optionsLanguage}
                                        value={LanguageSelected}
                                        onChange={handleChangeLanguage}
                                        placeholder="Seleccionar una evaluación..."
                                        isClearable
                                        noOptionsMessage={() => 'No hay coincidencias'}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formBasicProgramCourse">
                                    <Form.Label><i className="bi bi-person-video"></i> Programa</Form.Label>
                                    <Form.Select value={program} onChange={(e) => setProgram(e.target.value)}>
                                        <option value="">Seleccionar programa</option>
                                        {
                                            programas.map((p, index) => (
                                                <option value={p} key={index}>{p}</option>
                                            ))
                                        }
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formBasicModalidadCourse">
                                    <Form.Label><i className="bi bi-person-video3"></i> Modalidad</Form.Label>
                                    <Form.Select value={modalidad} onChange={(e) => setModalidad(e.target.value)}>
                                        <option value="">Seleccionar modalidad</option>
                                        {
                                            modalidades.map((m, index) => (
                                                <option value={m} key={index}>{m}</option>
                                            ))
                                        }
                                    </Form.Select>
                                </Form.Group>

                            </div>

                            <div className="col-md-6">

                                <Form.Group className="mb-3" controlId="formBasicHorario">
                                    <Form.Label><i className="bi bi-clock"></i> Horario</Form.Label>
                                    <Form.Select value={horario} onChange={(e) => setHorario(e.target.value)}>
                                        <option value="">Seleccionar horario</option>
                                        {
                                            horarios.map((h, index) => (
                                                <option value={h} key={index}>{h}</option>
                                            ))
                                        }
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formBasicdateInitCourseedit">
                                    <Form.Label><i className="bi bi-calendar"></i> Fecha inicio</Form.Label>
                                    <Form.Control
                                        type="date"
                                        placeholder="Seleccionar fecha de inicio"
                                        value={date_init || ''}
                                        onChange={(e) => setDate_init(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formBasicdatefinishCourseedit">
                                    <Form.Label><i className="bi bi-calendar"></i> Fecha fin</Form.Label>
                                    <Form.Control
                                        type="date"
                                        placeholder="Seleccionar fecha de fin"
                                        value={date_finish || ''}
                                        onChange={(e) => setDate_finish(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formBasicapacidadedit">
                                    <Form.Label><i className="bi bi-people"></i> Capacidad máxima</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Cupos"
                                        value={cupo}
                                        onChange={(e) => setCupo(e.target.value)}
                                    />
                                </Form.Group>
                            </div>

                        </div>

                        <hr />

                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="warning" type="submit">
                                <i className="bi bi-pencil-square"></i> Actualizar
                            </Button>
                            <Button variant="danger" onClick={() => {
                                clearForm()
                                setShowModal(false)
                                setError(null)
                            }}>
                                <i className="bi bi-x"></i> Cancelar
                            </Button>
                        </div>
                    </fieldset>
                </Form>
            </Modal.Body>
        </Modal>
    )
}

export default UpdateCourseModal