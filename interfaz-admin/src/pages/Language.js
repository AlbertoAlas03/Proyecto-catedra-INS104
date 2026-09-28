import { useEffect, useState } from "react"
import useLanguage from "../hooks/use-language"
import { useAuth } from "../hooks/context/auth-context"
import AddLanguageModal from "../components/AddLanguageModal"
import UpdateLanguageModal from "../components/UpdateLanguageModal"
import Swal from "sweetalert2"
import NoData from "../components/NoData"
import Select from "react-select"
import { Container, Spinner } from "react-bootstrap"

const Language = () => {

    const [showAddModal, setShowAddModal] = useState(false)
    const [showUpdateModal, setShowUpdateModal] = useState(false)
    const [updateData, setUpdateData] = useState([])
    const [LanguageSelected, setLanguageSelected] = useState(null)
    const [idiomaID, setidiomaID] = useState('')
    const [isSearching, setisSearching] = useState(false)

    const { list_idiomas, language, delete_idioma, search_idioma, search, setsearch, loading, paginaActual, setPaginaActual, totalPaginas } = useLanguage()

    const { token } = useAuth()

    const optionsLanguage = language.map((l) => ({
        value: l.idioma_id,
        label: `${l.nombre}`
    }));

    const handleChangeLanguage = (LanguageSelected) => {

        setLanguageSelected(LanguageSelected)
        setidiomaID(LanguageSelected ? LanguageSelected.value : '')
    }

    const handleSearch = async () => {
        try {

            await search_idioma(token, idiomaID)
            setisSearching(true)
        } catch (error) {

            await Swal.fire({
                title: error.message,
                icon: "warning",
                draggable: false,
                allowEscapeKey: false,
                allowOutsideClick: false
            })
        }
    }

    const handleDelete = async (idioma_id) => {

        const modal_confim = await Swal.fire({
            title: "¿Estas seguro de eliminar este idioma?",
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

        if (modal_confim.isConfirmed) {
            try {

                const response = await delete_idioma(idioma_id, token)

                if (response) {
                    await Swal.fire({
                        title: response.message,
                        icon: "success",
                        draggable: false,
                        allowEscapeKey: false,
                        allowOutsideClick: false
                    })

                    list_idiomas(token)
                    setsearch(null)
                    setisSearching(false)
                    setLanguageSelected(null)
                    setidiomaID('')
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

    const handleReset = () => {
        setisSearching(false)
        setLanguageSelected(null)
        setidiomaID('')
        setsearch(null)
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
        list_idiomas(token)
    }, [paginaActual])

    if (loading) {
        return (
            <Container
                fluid
                className="d-flex flex-column justify-content-center align-items-center"
                style={{ height: '100vh', background: '#f5f7fa' }}
            >
                <Spinner animation="border" variant="primary" role="status" style={{ width: '4rem', height: '4rem' }} />

                <p className="mt-4 fs-5 text-secondary">Cargando idiomas, por favor espera...</p>
            </Container>
        )
    }

    return (
        <>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className="h2"><i className="bi bi-translate"></i> Gestión de idiomas</h1>
            </div>
            <div className="row g-4 mb-3 align-items-center">
                <div className="col-auto">
                    <button type="button" className="btn btn-success" onClick={() => setShowAddModal(true)}>
                        <i className="bi bi-plus"></i> Registrar nuevo idioma
                    </button>
                </div>
                <div className="col ms-auto">
                    <div className="d-flex" style={{ maxWidth: '400px', marginLeft: 'auto' }}>
                        <Select
                            isDisabled={isSearching}
                            className="w-100"
                            options={optionsLanguage}
                            value={LanguageSelected}
                            onChange={handleChangeLanguage}
                            placeholder="Buscar idioma..."
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
                    search ? (
                        <div className="table-responsive">
                            <table className="table table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Nombre</th>
                                        <th scope="col">Fecha registro</th>
                                        <th scope="col">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        <tr key={search.idioma_id}>
                                            <th scope="row">{search.idioma_id}</th>
                                            <td>{search.nombre}</td>
                                            <td>{search.createdAt ? new Date(search?.createdAt).toISOString().split('T')[0] : 'fecha no disponible'}</td>
                                            <td>
                                                <div className="d-flex">
                                                    <button type="button" className='btn btn-warning' onClick={() => {
                                                        setShowUpdateModal(true)

                                                        const data = {
                                                            idioma_id: search.idioma_id,
                                                            nombre: search.nombre
                                                        }

                                                        setUpdateData(data)
                                                    }}><i className='bi bi-pencil-square'></i> Actualizar</button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger"
                                                        style={{ marginLeft: '10px' }}
                                                        onClick={() => handleDelete(search.idioma_id)}
                                                    ><i className="bi bi-trash3"></i> Eliminar</button>
                                                </div>
                                            </td>
                                        </tr>

                                    }

                                </tbody>
                            </table>
                        </div>
                    ) : (
                        language.length > 0 ? (
                            <>
                                <div className="table-responsive">
                                    <table className="table table-striped table-hover">
                                        <thead>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Nombre</th>
                                                <th scope="col">Fecha registro</th>
                                                <th scope="col">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                language.map((Language) => (
                                                    <tr key={Language.idioma_id}>
                                                        <th scope="row">{Language.idioma_id}</th>
                                                        <td>{Language.nombre}</td>
                                                        <td>{new Date(Language.createdAt).toISOString().split('T')[0]}</td>
                                                        <td>
                                                            <div className="d-flex">
                                                                <button type="button" className='btn btn-warning' onClick={() => {
                                                                    setShowUpdateModal(true)

                                                                    const data = {
                                                                        idioma_id: Language.idioma_id,
                                                                        nombre: Language.nombre
                                                                    }

                                                                    setUpdateData(data)

                                                                }}><i className='bi bi-pencil-square'></i> Actualizar</button>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-danger"
                                                                    style={{ marginLeft: '10px' }}
                                                                    onClick={() => handleDelete(Language.idioma_id)}
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

            <AddLanguageModal showModal={showAddModal} setShowModal={setShowAddModal} list_idiomas={list_idiomas} token={token} setsearch={setsearch} setisSearching={setisSearching} setLanguageSelected={setLanguageSelected} setidiomaID={setidiomaID} />
            <UpdateLanguageModal showModal={showUpdateModal} setShowModal={setShowUpdateModal} updateData={updateData} token={token} list_idiomas={list_idiomas} setUpdateData={setUpdateData} setsearch={setsearch} setisSearching={setisSearching} setLanguageSelected={setLanguageSelected} setidiomaID={setidiomaID} />
        </>
    )
}

export default Language