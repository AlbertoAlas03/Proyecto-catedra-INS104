import evaluacion from "../models/evaluacion.js";
import curso from "../models/curso.js"
import usuario from "../models/usuario.js"
import { Op } from "sequelize";

export const list_evaluacion_curso = async (req, res, next) => {
    try {

        const { curso_id } = req.body

        if (!curso_id) {
            return res.status(400).json({
                message: 'El id del curso es obligatorio, por favor verifique'
            })
        }

        const evaluaciones = await evaluacion.findAll({
            where: {
                curso_id: curso_id
            }
        })

        const total_porcentaje = await evaluacion.sum('porcentaje', {
            where: {
                curso_id: curso_id
            }
        })

        return res.status(200).json({
            message: 'Evaluaciones del curso',
            data: evaluaciones,
            total_porcentaje: total_porcentaje * 100
        })

    } catch (error) {

        console.log('Error al listar las evaluaciones del curso: ', error.message)

        return res.status(500).json({
            message: 'Error al listar las evaluaciones del curso',
            error: error.message
        })
    }
}

export const create_evaluacion = async (req, res, next) => {
    try {

        const { curso_id, nombre, descripcion, porcentaje } = req.body

        const profesor_id = req.usuario.usuario_id

        if (!curso_id || !profesor_id || !nombre || !descripcion || !porcentaje) {

            return res.status(400).json({
                message: 'Faltan campos obligatorios, por favor verifique'
            })
        } else if (porcentaje <= 0 || porcentaje > 100) {
            return res.status(400).json({
                message: 'Hay un error con el porcentaje, por favor verifique'
            })
        }

        const Curso = await curso.findOne({
            where: {
                curso_id: curso_id
            }
        })

        if (!Curso) {
            return res.status(404).json({
                message: 'Este curso no esta registrado, por favor verifique'
            })
        }

        const profesor = await usuario.findOne({
            where: {
                usuario_id: profesor_id
            }
        })

        if (!profesor) {
            return res.status(404).json({
                message: 'Este profesor no esta registrado, por favor verifique'
            })
        }

        const exists_evaluacion = await evaluacion.findOne({
            where: {
                curso_id: curso_id,
                nombre: nombre
            }
        })

        if (exists_evaluacion) {
            return res.status(400).json({
                message: 'Ya existe una evaluacion con este nombre, por favor verifique'
            })
        }

        const porcentaje_evaluacion = await evaluacion.sum('porcentaje', {
            where: {
                curso_id: curso_id
            }
        })

        const Porcentaje = (porcentaje) / 100

        if ((porcentaje_evaluacion + Porcentaje) > 1) {
            return res.status(400).json({
                message: 'El porcentaje total de las evaluaciones no puede superar el 100%'
            })
        }

        await evaluacion.create({
            curso_id: curso_id,
            profesor_id: profesor_id,
            nombre: nombre,
            descripcion: descripcion,
            porcentaje: Porcentaje
        })

        return res.status(200).json({
            message: 'Evaluacion creada con exito!'
        })

    } catch (error) {

        console.log('Error al crear la evaluacion: ', error.message)

        return res.status(500).json({
            message: 'Error al crear la evaluacion',
            error: error.message
        })
    }
}

export const update_evaluacion = async (req, res, next) => {
    try {

        const { curso_id, evaluacion_id, nombre, descripcion, porcentaje } = req.body

        if (!curso_id || !evaluacion_id || !nombre || !descripcion || !porcentaje) {

            return res.status(400).json({
                message: 'Faltan campos obligatorios, por favor verifique'
            })
        } else if (porcentaje <= 0 || porcentaje > 100) {
            return res.status(400).json({
                message: 'Hay un error con el porcentaje, por favor verifique'
            })
        }

        const Evaluacion = await evaluacion.findOne({
            where: {
                evaluacion_id: evaluacion_id
            }
        })

        if (!Evaluacion) {
            return res.status(404).json({
                message: 'Esta evaluacion no esta registrada, por favor verifique'
            })
        }

        const exists_evaluacion = await evaluacion.findOne({
            where: {
                curso_id: curso_id,
                nombre: nombre,
                evaluacion_id: { [Op.ne]: evaluacion_id }
            }
        })

        if (exists_evaluacion) {
            return res.status(400).json({
                message: 'Ya existe una evaluacion con este nombre, por favor verifique'
            })
        }

        const porcentaje_evaluacion = await evaluacion.sum('porcentaje', {
            where: {
                curso_id: curso_id,
                evaluacion_id: { [Op.ne]: evaluacion_id }
            }
        })

        const Porcentaje = (porcentaje) / 100

        if ((porcentaje_evaluacion + Porcentaje) > 1) {
            return res.status(400).json({
                message: 'El porcentaje total de las evaluaciones no puede superar el 100%'
            })
        }

        await Evaluacion.update({
            nombre: nombre,
            descripcion: descripcion,
            porcentaje: Porcentaje
        })

        return res.status(200).json({
            message: 'Evaluacion actualizada con exito!'
        })

    } catch (error) {

        console.log('Error al actualizar la evaluacion: ', error.message)

        return res.status(500).json({
            message: 'Error al actualizar la evaluacion',
            error: error.message
        })
    }
}

export const delete_evaluacion = async (req, res, next) => {
    try {

        const { evaluacion_id } = req.body

        if (!evaluacion_id) {
            return res.status(400).json({
                message: 'El id de la evaluacion es obligatorio'
            })
        }

        const Evaluacion = await evaluacion.findOne({
            where: {
                evaluacion_id: evaluacion_id
            }
        })

        if (!Evaluacion) {
            return res.status(404).json({
                message: 'Esta evaluacion no esta registrada por favor verifique'
            })
        }

        await Evaluacion.destroy()

        return res.status(200).json({
            message: 'Evaluacion eliminada con exito!'
        })

    } catch (error) {

        console.log('Error al eliminar la evaluacion: ', error.message)

        return res.status(500).json({
            message: 'Error al eliminar la evaluacion',
            error: error.message
        })
    }
}