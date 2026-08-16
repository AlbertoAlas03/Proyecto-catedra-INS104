import { Op } from "sequelize";
import curso from "../models/curso.js";
import idioma from "../models/idioma.js"

export const list_cursos = async (req, res, next) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const offset = (page - 1) * limit;

        const { count, rows } = await curso.findAndCountAll({
            include: [{
                model: idioma,
                as: 'idioma'
            }],
            limit,
            offset,
            order: [['curso_id', 'ASC']]
        })

        const totalPaginas = Math.ceil(count / limit);

        return res.status(200).json({
            message: 'Cursos registrados',
            paginaActual: page,
            totalPaginas: totalPaginas,
            totalRegistros: count,
            data: rows
        })

    } catch (error) {

        console.log('Error al listar los cursos: ', error.message)

        return res.status(500).json({
            message: 'Error al listar los cursos',
            error: error.message
        })
    }
}

export const create_curso = async (req, res, next) => {
    try {

        const {
            idioma_id,
            nombre,
            descripcion,
            programa,
            modalidad,
            horario,
            fecha_inicio,
            fecha_fin,
            capacidad_maxima
        } = req.body

        if (!idioma_id || !nombre || !descripcion || !programa || !modalidad || !horario || !fecha_fin || !fecha_inicio || !capacidad_maxima) {
            return res.status(400).json({
                message: 'Faltan campos obligatorios, por favor verifique'
            })
        }

        const today = new Date().toLocaleDateString('sv-SE')

        const Idioma = await idioma.findOne({
            where: {
                idioma_id: idioma_id
            }
        })

        if (!Idioma) {
            return res.status(404).json({
                message: 'El idioma del curso no esta registrado, por favor verifique'
            })
        }

        const exists_curso = await curso.findOne({
            where: {
                nombre: nombre
            }
        })

        if (exists_curso) {
            return res.status(400).json({
                message: 'Ya existe un curso con este nombre'
            })
        }

        if (fecha_inicio <= today) {
            return res.status(400).json({
                message: 'La fecha de inicio debe ser posterior a la fecha actual'
            });
        }

        if (fecha_fin <= today) {
            return res.status(400).json({
                message: 'La fecha de fin debe ser posterior a la fecha actual'
            });
        }

        if (fecha_inicio >= fecha_fin) {
            return res.status(400).json({
                message: 'La fecha de fin debe ser posterior a la fecha de inicio'
            });
        }

        if (capacidad_maxima <= 0) {
            return res.status(400).json({
                message: 'Dato no válido en cupos, por favor verifique'
            })
        }

        await curso.create({
            idioma_id: idioma_id,
            nombre: nombre,
            descripcion: descripcion,
            programa: programa,
            modalidad: modalidad,
            horario: horario,
            fecha_inicio: fecha_inicio,
            fecha_fin: fecha_fin,
            capacidad_maxima: capacidad_maxima
        })

        return res.status(200).json({
            message: 'Curso creado con exito!'
        })

    } catch (error) {

        console.log('Error al crear el curso: ', error.message)

        return res.status(500).json({
            message: 'Error al crear el curso',
            error: error.message
        })
    }
}

export const update_curso = async (req, res, next) => {
    try {

        const {
            curso_id,
            idioma_id,
            nombre,
            descripcion,
            programa,
            modalidad,
            horario,
            fecha_inicio,
            fecha_fin,
            capacidad_maxima
        } = req.body

        if (!curso_id || !idioma_id || !nombre || !descripcion || !programa || !modalidad || !horario || !fecha_fin || !fecha_inicio || !capacidad_maxima) {
            return res.status(400).json({
                message: 'Faltan campos obligatorios, por favor verifique'
            })
        }

        const today = new Date().toLocaleDateString('sv-SE')

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

        const Idioma = await idioma.findOne({
            where: {
                idioma_id: idioma_id
            }
        })

        if (!Idioma) {
            return res.status(404).json({
                message: 'El idioma del curso no esta registrado, por favor verifique'
            })
        }

        const exists_curso = await curso.findOne({
            where: {
                nombre: nombre,
                curso_id: { [Op.ne]: curso_id }
            }
        })

        if (exists_curso) {
            return res.status(400).json({
                message: 'Ya existe un curso con este nombre'
            })
        }


        if (fecha_inicio <= today) {
            return res.status(400).json({
                message: 'La fecha de inicio debe ser posterior a la fecha actual'
            });
        }

        if (fecha_fin <= today) {
            return res.status(400).json({
                message: 'La fecha de fin debe ser posterior a la fecha actual'
            });
        }

        if (fecha_inicio >= fecha_fin) {
            return res.status(400).json({
                message: 'La fecha de fin debe ser posterior a la fecha de inicio'
            });
        }

        if (capacidad_maxima <= 0) {
            return res.status(400).json({
                message: 'Dato no válido en cupos, por favor verifique'
            })
        }

        await Curso.update({
            idioma_id: idioma_id,
            nombre: nombre,
            descripcion: descripcion,
            programa: programa,
            modalidad: modalidad,
            horario: horario,
            fecha_inicio: fecha_inicio,
            fecha_fin: fecha_fin,
            capacidad_maxima: capacidad_maxima
        })

        return res.status(200).json({
            message: 'Curso actualizado con exito!'
        })

    } catch (error) {

        console.log('Error al actualizar el curso: ', error.message)

        return res.status(500).json({
            message: 'Error al actualizar el curso',
            error: error.message
        })
    }
}

export const delete_curso = async (req, res, next) => {
    try {

        const { curso_id } = req.body

        if (!curso_id) {
            return res.status(400).json({
                message: 'El id del curso es obligatorio, por favor verifique'
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

        await Curso.destroy()

        return res.status(200).json({
            message: 'Curso eliminado con exito!'
        })
    } catch (error) {

        console.log('Error al eliminar el curso: ', error.message)

        return res.status(500).json({
            message: 'Error al eliminar el curso',
            error: error.message
        })
    }
}

export const list_cursos_no_iniciados = async (req, res, next) => {
    try {

        const cursos = await curso.findAll({
            where: {
                estado: 'no iniciado'
            },
            attributes: ['curso_id', 'nombre', 'programa', 'modalidad']
        })

        return res.status(200).json({
            message: 'Cursos no iniciados',
            data: cursos
        })

    } catch (error) {

        console.log('Error al listar todos los cursos no iniciados: ', error.message)

        return res.status(500).json({
            message: 'Error al listar todos los cursos no iniciados',
            error: error.message
        })
    }
}

export const list_course_by_id = async (req, res, next) => {
    try {

        const { curso_id } = req.body

        if (!curso_id) {
            return res.status(400).json({
                message: 'Debe seleccionar un curso o buscarlo por su codigo, por favor verifique'
            })
        }

        const Curso = await curso.findOne({
            where: {
                curso_id: curso_id
            },
            include: [{
                model: idioma,
                as: 'idioma'
            }]
        })

        if (!Curso) {
            return res.status(404).json({
                message: 'Curso no registrado, por favor verifique'
            })
        }

        return res.status(200).json({
            message: 'Curso encontrado!',
            data: Curso
        })

    } catch (error) {

        console.log('Error al buscar el curso por su id: ', error.message)

        return res.status(500).json({
            message: 'Error al buscar el curso por su id',
            error: error.message
        })
    }
}

export const list_more_courses_not_started = async (req, res, next) => {
    try {

        const cursos = await curso.findAll({
            where: {
                estado: 'no iniciado'
            },
            attributes: ['curso_id', 'nombre', 'programa', 'modalidad', 'horario', 'fecha_inicio', 'fecha_fin', 'capacidad_maxima']
        })

        return res.status(200).json({
            message: 'Cursos no iniciados',
            data: cursos
        })

    } catch (error) {

        console.log('Error al listar todos los cursos no iniciados: ', error.message)

        return res.status(500).json({
            message: 'Error al listar todos los cursos no iniciados',
            error: error.message
        })
    }
}