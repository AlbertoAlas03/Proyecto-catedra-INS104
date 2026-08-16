import curso from "../models/curso.js"
import idioma from "../models/idioma.js";
import inscripcion from "../models/inscripcion.js"
import profesor_curso from "../models/profesor_curso.js";
import usuario from "../models/usuario.js"
import { Op } from "sequelize";

export const list_estudiantes = async (req, res, next) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const offset = (page - 1) * limit;

        const { curso_id } = req.body

        if (!curso_id) {
            return res.status(400).json({
                message: 'El id del curso es obligatorio, por favor verifique'
            })
        }

        const { count, rows } = await inscripcion.findAndCountAll({
            where: {
                curso_id: curso_id
            },
            include: [{
                model: usuario,
                as: 'estudiante',
                attributes: ['usuario_id', 'nombre', 'apellido', 'email', 'telefono', 'activo']
            }, {
                model: curso,
                as: 'curso',
                attributes: ['nombre', 'programa', 'modalidad']
            }],
            limit,
            offset,
            order: [['inscripcion_id', 'ASC']]
        })

        const totalPaginas = Math.ceil(count / limit);

        return res.status(200).json({
            message: 'Estudiantes del curso',
            paginaActual: page,
            totalPaginas: totalPaginas,
            totalRegistros: count,
            data: rows
        })

    } catch (error) {

        console.log('Error al obtener los estudiantes: ', error.message)

        return res.status(500).json({
            message: 'Error al obtener los estudiantes',
            error: error.message
        })
    }
}

export const inscripcion_estudiante = async (req, res, next) => {
    try {

        const { curso_id } = req.body

        const estudiante_id = req.usuario.usuario_id

        if (!estudiante_id || !curso_id) {
            return res.status(400).json({
                message: 'Faltan datos obligatorios, por favor verifique'
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

        // const inscripcion_exists = await inscripcion.findOne({
        //     where: {
        //         curso_id: curso_id,
        //         estudiante_id: estudiante_id
        //     }
        // })

        // if (inscripcion_exists) {
        //     return res.status(400).json({
        //         message: 'Ya estas registrado en este curso, por favor verifica'
        //     })
        // }

        const verify_hours = await inscripcion.findAll({
            where: {
                estudiante_id: estudiante_id
            },
            include: [{
                model: curso,
                as: 'curso',
                attributes: ['horario']
            }]
        })

        const error_hours = verify_hours.some(ins => ins.curso.horario === Curso.horario)

        if (error_hours) {
            return res.status(400).json({
                message: 'Ya estas inscrito a un curso con el mismo horario, por favor verifica'
            })
        }

        await inscripcion.create({
            estudiante_id: estudiante_id,
            curso_id: curso_id
        })

        const new_cupo = Curso.capacidad_maxima - 1

        await Curso.update({
            capacidad_maxima: new_cupo
        })

        const new_cursos = await inscripcion.findAll({
            where: {
                estudiante_id: estudiante_id
            },
            include: [{
                model: curso,
                as: 'curso',
                attributes: ['curso_id', 'idioma_id', 'nombre', 'descripcion', 'programa', 'modalidad', 'horario', 'estado'],
                where: {
                    estado: {
                        [Op.in]: ['activo', 'no iniciado']
                    }
                },
                include: [{
                    model: idioma,
                    as: 'idioma'
                }]
            }]
        })

        return res.status(200).json({
            message: 'Inscripción exitosa',
            data: new_cursos
        })

    } catch (error) {

        console.log('Error al inscribirse al curso: ', error.message)

        return res.status(500).json({
            message: 'Error al inscribirse al curso',
            error: error.message
        })

    }
}

export const get_my_course = async (req, res, next) => {
    try {

        //const { estudiante_id } = req.body
        const estudiante_id = req.usuario.usuario_id

        if (!estudiante_id) {
            return res.status(400).json({
                message: 'El id del estudiante es obligatorio'
            })
        }

        const cursos = await inscripcion.findAll({
            where: {
                estudiante_id: estudiante_id
            },
            include: [{
                model: curso,
                as: 'curso',
                attributes: ['curso_id', 'idioma_id', 'nombre', 'descripcion', 'programa', 'modalidad', 'horario', 'estado', 'fecha_inicio', 'fecha_fin'],
                where: {
                    estado: {
                        [Op.in]: ['activo', 'no iniciado']
                    }
                },
                include: [{
                    model: idioma,
                    as: 'idioma'
                }]
            }]
        })

        return res.status(200).json({
            message: 'Cursos a los que estas inscrito',
            data: cursos
        })

    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener los cursos asignados',
            error: error.message
        })
    }
}

export const get_users_curso = async (req, res, next) => {
    try {

        const { curso_id } = req.body

        if (!curso_id) {
            return res.status(400).json({
                message: 'el id del curso es obligatorio'
            })
        }

        const usuarios_estudiantes = await inscripcion.findAll({
            where: {
                curso_id: curso_id
            },
            include: [{
                model: usuario,
                as: 'estudiante',
                attributes: ['nombre', 'apellido', 'email', 'rol']
            }]
        })

        const profesor = await profesor_curso.findOne({
            where: {
                curso_id: curso_id
            },
            include: [{
                model: usuario,
                as: 'profesor',
                attributes: ['nombre', 'apellido', 'email', 'rol']
            }]
        })

        return res.status(200).json({
            message: 'Usuarios inscritos al curso',
            usuarios_estudiantes: usuarios_estudiantes,
            profesor: profesor
        })

    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener los demas usuarios inscritos',
            error: error.message
        })
    }
}