import idioma from "../models/idioma.js";
import curso from "../models/curso.js";
import { Op } from "sequelize";

export const list_idiomas = async (req, res, next) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const offset = (page - 1) * limit;

        const { count, rows } = await idioma.findAndCountAll({
            limit,
            offset,
            order: [['idioma_id', 'ASC']]
        })

        const totalPaginas = Math.ceil(count / limit);

        return res.status(200).json({
            message: 'Idiomas registrados',
            paginaActual: page,
            totalPaginas: totalPaginas,
            totalRegistros: count,
            data: rows
        })

    } catch (error) {

        console.log("Error al listar los idiomas: ", error.message)

        return res.status(500).json({
            message: 'Error al listar los idiomas',
            error: error.message
        })

    }
}

export const create_idioma = async (req, res, next) => {
    try {

        const { nombre } = req.body

        if (!nombre) {
            return res.status(400).json({
                message: 'Debes ingresar el nombre del idioma ha registrar'
            })
        }

        const exists_idioma = await idioma.findOne({
            where: {
                nombre: nombre
            }
        })

        if (exists_idioma) {
            return res.status(400).json({
                message: 'Ya existe un idioma con este nombre, por favor verifique'
            })
        }

        await idioma.create({
            nombre: nombre
        })

        return res.status(200).json({
            message: 'Idioma registrado con exito!'
        })

    } catch (error) {

        console.log('Error al agregar un nuevo idioma: ', error.message)

        return res.status(500).json({
            message: 'Error al agregar un nuevo idioma',
            error: error.message
        })

    }
}

export const update_idioma = async (req, res, next) => {
    try {

        const { idioma_id, nombre } = req.body

        if (!nombre || !idioma_id) {
            return res.status(400).json({
                message: 'Faltan campos obligatorios, por favor verifique'
            })
        }

        const Idioma = await idioma.findOne({
            where: {
                idioma_id: idioma_id
            }
        })

        if (!Idioma) {
            return res.status(404).json({
                message: 'Este idioma no esta registrado, por favor verifique'
            })
        }

        const exists_idioma = await idioma.findOne({
            where: {
                nombre: nombre,
                idioma_id: { [Op.ne]: idioma_id }
            }
        })

        if (exists_idioma) {
            return res.status(400).json({
                message: 'Ya existe un idioma registrado con este nombre'
            })
        }

        await Idioma.update({
            nombre: nombre
        })

        return res.status(200).json({
            message: 'Idioma actualizado con exito!'
        })

    } catch (error) {
        console.log('Error al actualizar el idioma: ', error.message)
        return res.status(500).json({
            message: 'Error al actualizar el idioma',
            error: error.message
        })
    }
}

export const delete_idioma = async (req, res, next) => {
    try {

        const { idioma_id } = req.body

        if (!idioma_id) {
            return res.status(400).json({
                message: 'El id del idioma es requerido, por favor verifique'
            })
        }

        const Idioma = await idioma.findOne({
            where: {
                idioma_id: idioma_id
            }
        })

        if (!Idioma) {
            return res.status(404).json({
                message: 'Este idioma no esta registrado, por favor verifique'
            })
        }

        const cursos = await curso.findOne({
            where: {
                idioma_id: idioma_id,
                estado: 'activo'
            }
        })

        if (cursos) {
            return res.status(400).json({
                message: '¡No puedes eliminar este idioma, existen cursos activos asignados a el!'
            })
        }

        await Idioma.destroy()

        return res.status(200).json({
            message: 'Idioma eliminado con exito!'
        })

    } catch (error) {
        console.log('Error al eliminar el idioma: ', error.message)
        return res.status(500).json({
            message: 'Error al eliminar el idioma',
            error: error.message
        })
    }
}

export const list_idioma_by_id = async (req, res, next) => {
    try {

        const { idioma_id } = req.body

        if (!idioma_id) {
            return res.status(400).json({
                message: 'Debe seleccionar un idioma o buscarlo por su codigo, por favor verifique'
            })
        }

        const Idioma = await idioma.findOne({
            where: {
                idioma_id: idioma_id
            }
        })

        if (!Idioma) {
            return res.status(404).json({
                message: 'Idioma no encontrado'
            })
        }

        return res.status(200).json({
            message: 'Idioma encontrado!',
            data: Idioma
        })

    } catch (error) {

        console.log('Error al obtener el idioma por su id: ', error.message)

        return res.status(500).json({
            message: 'Error al obtener el idioma por su id',
            error: error.message
        })
    }
}