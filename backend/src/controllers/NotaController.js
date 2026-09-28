import nota from "../models/nota.js"
import evaluacion from "../models/evaluacion.js"
import usuario from "../models/usuario.js"
import { Op } from "sequelize"
import Transporter from "../emails/configuration-email.js"
import dotenv from 'dotenv'

dotenv.config()

export const list_notas_estudiante = async (req, res, next) => {
    try {

        const { estudiante_id } = req.body

        if (!estudiante_id) {
            return res.status(400).json({
                message: 'El id del estudiante es obligatorio, por favor verifique'
            })
        }

        const notas = await nota.findAll({
            where: {
                estudiante_id: estudiante_id
            },
            attributes: ['nota_id', 'evaluacion_id', 'estudiante_id', 'puntaje_obtenido', 'nota_final'],
            include: [{
                model: evaluacion,
                as: 'evaluacion',
                attributes: ['evaluacion_id', 'nombre', 'descripcion', 'porcentaje']
            }, {
                model: usuario,
                as: 'estudiante'
            }]
        })

        const nota_final = await nota.sum('nota_final', {
            where: {
                estudiante_id: estudiante_id
            }
        })

        return res.status(200).json({
            message: 'Notas del estudiante',
            data: notas,
            nota_final: nota_final
        })

    } catch (error) {

        console.log('Error al obtener las notas del estudiante: ', error.message)

        return res.status(500).json({
            message: 'Error al obtener las notas del estudiante',
            error: error.message
        })
    }
}

export const add_nota = async (req, res, next) => {
    try {

        const { evaluacion_id, estudiante_id, curso_id, puntaje_obtenido, email } = req.body

        if (!evaluacion_id || !estudiante_id || !curso_id || !puntaje_obtenido || !email) {
            return res.status(400).json({
                message: 'Faltan campos obligatorios, por favor verifique'
            })
        } else if (puntaje_obtenido <= 0 || puntaje_obtenido > 10) {
            return res.status(400).json({
                message: 'Hay un error con el puntaje obtenido, por favor verifique'
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

        const estudiante = await usuario.findOne({
            where: {
                usuario_id: estudiante_id,
                email: email
            }
        })

        if (!estudiante) {
            return res.status(404).json({
                message: 'Este estudiante no esta registrado, por favor verifique'
            })
        }

        const exists_evaluacion_registrada = await nota.findOne({
            where: {
                evaluacion_id: evaluacion_id,
                estudiante_id: estudiante_id
            }
        })

        if (exists_evaluacion_registrada) {
            return res.status(400).json({
                message: 'Esta evaluacion ya esta registrada, por favor verifique'
            })
        }

        const nota_final = (Evaluacion.porcentaje * puntaje_obtenido).toFixed(2);

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: `Notificación sobre nota de la evaluación ${Evaluacion.nombre}`,
            html: `<h1>Buen día estimado estudiante <strong>${estudiante.nombre} ${estudiante.apellido}</strong>,</h1><p> notificarte que tu nota respecto a esta evaluación ya esta publicada en el portal estudiantil, saludos.</p>`
        }

        await Transporter.sendMail(mailOptions)

        await nota.create({
            evaluacion_id: evaluacion_id,
            estudiante_id: estudiante_id,
            curso_id: curso_id,
            puntaje_obtenido: puntaje_obtenido,
            nota_final: nota_final
        })

        return res.status(200).json({
            message: 'Nota registrada con exito!'
        })

    } catch (error) {

        console.log('Error al agregar la nota: ', error.message)

        return res.status(500).json({
            message: 'Error al agregar la nota',
            error: error.message
        })
    }
}

export const update_nota = async (req, res, next) => {
    try {

        const { nota_id, evaluacion_id, estudiante_id, puntaje_obtenido } = req.body

        if (!nota_id || !evaluacion_id || !puntaje_obtenido || !estudiante_id) {
            return res.status(400).json({
                message: 'Faltan campos obligatorios, por favor verifique'
            })
        }

        const estudiante = await usuario.findOne({
            where: {
                usuario_id: estudiante_id
            }
        })

        const Nota = await nota.findOne({
            where: {
                nota_id: nota_id
            }
        })

        if (!Nota) {
            return res.status(404).json({
                message: 'Este registro de nota no existe, por favor verifique'
            })
        }

        const Evaluacion = await evaluacion.findOne({
            where: {
                evaluacion_id: evaluacion_id
            }
        })

        if (!Evaluacion) {
            return res.status(404).json({
                message: 'Esta evaluacion no existe, por favor verifique'
            })
        }

        const exists_evaluacion_registrada = await nota.findOne({
            where: {
                evaluacion_id: evaluacion_id,
                estudiante_id: estudiante_id,
                nota_id: { [Op.ne]: nota_id }
            }
        })

        if (exists_evaluacion_registrada) {
            return res.status(400).json({
                message: 'Esta evaluación ya está registrada con su respectiva nota para este estudiante, por favor verifique'
            });
        }

        const nota_final = parseFloat((Evaluacion.porcentaje * puntaje_obtenido).toFixed(2));

        const mailOptions = {
            from: process.env.EMAIL,
            to: estudiante.email,
            subject: `Notificación sobre nota de la evaluación ${Evaluacion.nombre}`,
            html: `<h1>Buen día estimado estudiante <strong>${estudiante.nombre} ${estudiante.apellido}</strong>,</h1><p> notificarte que tu nota respecto a esta evaluación ya ha sido actualizada puedes comprobarlo a través del portal estudiantil, saludos.</p>`
        }

        await Transporter.sendMail(mailOptions)

        await Nota.update({
            evaluacion_id: evaluacion_id,
            puntaje_obtenido: puntaje_obtenido,
            nota_final: nota_final
        })

        return res.status(200).json({
            message: 'Registro de nota actualizado!'
        })

    } catch (error) {

        console.log('Error al actualizar la nota: ', error.message)

        return res.status(500).json({
            message: 'Error al actualizar la nota',
            error: error.message
        })
    }
}

export const get_nota_estudiante = async (req, res, next) => {
    try {

        const { curso_id } = req.body
        const estudiante_id = req.usuario.usuario_id

        if (!estudiante_id || !curso_id) {
            return res.status(400).json({
                message: 'El id del estudiante y curso son obligatorios'
            })
        }

        const notas = await nota.findAll({
            where: {
                estudiante_id: estudiante_id,
                curso_id: curso_id
            },
            include: [{
                model: evaluacion,
                as: 'evaluacion'
            }]
        })

        const nota_final = await nota.sum('nota_final', {
            where: {
                estudiante_id: estudiante_id,
                curso_id: curso_id
            }
        })

        return res.status(200).json({
            message: 'Tus notas',
            data: notas,
            nota_final: nota_final
        })

    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener las notas',
            error: error.message
        })
    }
}