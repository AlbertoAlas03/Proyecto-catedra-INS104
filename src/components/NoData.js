import img_data from '../assets/img/no_data.png'

const NoData = () => {
    return (
        <div className="text-center mt-5">
            <img
                src={img_data}
                alt="Sin datos"
                width="150"
                height="150"
                className="mb-3"
            />
            <h4 className="text-muted">No se encontraron registros</h4>
            <p className="text-muted">Agrega uno para empezar.</p>
        </div>
    )
}

export default NoData