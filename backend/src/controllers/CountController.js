import curso from "../models/curso.js";
import usuario from "../models/usuario.js";
import idioma from "../models/idioma.js";

const count = async (req, res, next) => {
    try {

        const count_profesores = await usuario.count({
            where: {
                rol: 'profesor',
                activo: true
            }
        })

        const count_estudiantes = await usuario.count({
            where: {
                rol: 'estudiante',
                activo: true
            }
        })

        const count_idiomas = await idioma.count()

        const count_cursos_activos = await curso.count({
            where: {
                estado: 'activo'
            }
        })

        return res.status(200).json({
            message: 'Total de registros',
            data: {
                count_profesores: count_profesores,
                count_estudiantes: count_estudiantes,
                count_idiomas: count_idiomas,
                count_cursos_activos: count_cursos_activos
            }
        })

    } catch (error) {

        console.log('Error al totalizar los registros: ', error.message)

        return res.status(500).json({
            message: 'Error al totalizar los registros',
            error: error.message
        })
    }
}

export default count