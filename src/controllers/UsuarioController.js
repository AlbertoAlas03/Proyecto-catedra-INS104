import usuario from "../models/usuario.js";
import sesion from '../models/sesion.js'
import { Op } from "sequelize";
import bcrypt from "bcryptjs";
import generateTokens from "../utils/generateTokens.js";
import validateData from "../utils/validateData.js";
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config()

const { validateEmail, validatePhone } = validateData()

export const list_usuario = async (req, res, next) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const offset = (page - 1) * limit;

        const { count, rows } = await usuario.findAndCountAll({
            limit,
            offset,
            order: [['usuario_id', 'ASC']]
        })

        const totalPaginas = Math.ceil(count / limit);

        return res.status(200).json({
            message: 'Usuarios registrados',
            paginaActual: page,
            totalPaginas: totalPaginas,
            totalRegistros: count,
            data: rows
        })

    } catch (error) {

        console.log('Error al listar los usuarios: ', error.message)

        return res.status(500).json({
            message: 'Error al listar los usuarios',
            error: error.message
        })
    }
}

export const create_usuario = async (req, res, next) => {
    try {

        const { nombre, apellido, email, password, telefono, rol } = req.body

        if (!nombre || !apellido || !email || !password || !telefono || !rol) {
            return res.status(400).json({
                message: 'Faltan campos obligatorios, por favor verifique'
            })
        }

        const exists_email_usuario = await usuario.findOne({
            where: {
                email: email
            }
        })

        if (exists_email_usuario) {
            return res.status(400).json({
                message: 'Este correo eléctronico ya esta registrado!'
            })
        } else if (!validatePhone(telefono)) {
            return res.status(400).json({
                message: 'Formato de telefono no válido'
            })
        } else if (!validateEmail(email)) {
            return res.status(400).json({
                message: 'Formato de email no válido'
            })
        }

        const passwordHash = bcrypt.hashSync(password, 10)

        await usuario.create({
            nombre: nombre,
            apellido: apellido,
            email: email,
            password: passwordHash,
            telefono: telefono,
            rol: rol
        })

        return res.status(200).json({
            message: 'Usuario registrado con exito!'
        })

    } catch (error) {

        console.log('Error al registrarse: ', error.message)

        return res.status(500).json({
            message: 'Error al registrarse',
            error: error.message
        })
    }
}

export const update_usuario = async (req, res, next) => {
    try {

        const { usuario_id, nombre, apellido, email, telefono, rol } = req.body

        if (!usuario_id || !nombre || !apellido || !email || !telefono || !rol) {
            return res.status(400).json({
                message: 'Faltan campos obligatorios, por favor verifique'
            })
        }

        const Usuario = await usuario.findOne({
            where: {
                usuario_id: usuario_id
            }
        })

        if (!Usuario) {
            return res.status(404).json({
                message: 'Este usuario no esta registrado, por favor verifique'
            })
        }

        const exists_email_usuario = await usuario.findOne({
            where: {
                email: email,
                usuario_id: { [Op.ne]: usuario_id }
            }
        })

        if (exists_email_usuario) {
            return res.status(400).json({
                message: 'Este correo eléctronico ya esta registrado!'
            })
        } else if (!validatePhone(telefono)) {
            return res.status(400).json({
                message: 'Formato de telefono no válido'
            })
        } else if (!validateEmail(email)) {
            return res.status(400).json({
                message: 'Formato de email no válido'
            })
        }

        await Usuario.update({
            nombre: nombre,
            apellido: apellido,
            email: email,
            telefono: telefono,
            rol: rol
        })

        return res.status(200).json({
            message: 'Usuario actualizado con exito!'
        })

    } catch (error) {

        console.log('Error al actualizar el usuario: ', error.message)

        return res.status(500).json({
            message: 'Error al actualizar el usuario',
            error: error.message
        })
    }
}

export const habilitar_usuario = async (req, res, next) => {
    try {

        const { usuario_id } = req.body

        if (!usuario_id) {
            return res.status(400).json({
                message: 'El id del usuario es obligatorio, por favor verifique'
            })
        }

        const Usuario = await usuario.findOne({
            where: {
                usuario_id: usuario_id
            }
        })

        if (!Usuario) {
            return res.status(404).json({
                message: 'Este usuario no esta registrado, por favor verifique'
            })
        }

        await Usuario.update({
            activo: true
        })

        return res.status(200).json({
            message: 'Usuario habilitado con exito!'
        })

    } catch (error) {

        console.log('Error al eliminar el usuario: ', error.message)

        return res.status(500).json({
            message: 'Error al eliminar el usuario',
            error: error.message
        })
    }
}

export const inhabilitar_usuario = async (req, res, next) => {
    try {

        const { usuario_id } = req.body

        if (!usuario_id) {
            return res.status(400).json({
                message: 'El id del usuario es obligatorio, por favor verifique'
            })
        }

        const Usuario = await usuario.findOne({
            where: {
                usuario_id: usuario_id
            }
        })

        if (!Usuario) {
            return res.status(404).json({
                message: 'Este usuario no esta registrado, por favor verifique'
            })
        }

        await Usuario.update({
            activo: false
        })

        return res.status(200).json({
            message: 'Usuario inhabilitado con exito!'
        })

    } catch (error) {

        console.log('Error al eliminar el usuario: ', error.message)

        return res.status(500).json({
            message: 'Error al eliminar el usuario',
            error: error.message
        })
    }
}

export const list_usuarios_profesores = async (req, res, next) => {
    try {

        const profesores = await usuario.findAll({
            where: {
                rol: 'profesor'
            },
            attributes: ['usuario_id', 'nombre', 'apellido']
        })

        return res.status(200).json({
            message: 'Usuarios profesores registrados',
            data: profesores
        })

    } catch (error) {

        console.log('Error al obtener los usarios profesores: ', error.message)

        return res.status(500).json({
            message: 'Error al obtener los usarios profesores',
            error: error.message
        })
    }
}

export const login = async (req, res, next) => {
    try {

        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                message: 'El correo electrónico y la contraseña son obligatorios, por favor verifique'
            })
        }

        const Usuario = await usuario.findOne({
            where: {
                email: email
            }
        })

        if (!Usuario) {
            return res.status(404).json({
                message: 'Este usuario no esta registrado, por favor verifique'
            })
        }

        if (!bcrypt.compareSync(password, Usuario.password)) {
            return res.status(401).json({
                message: 'Contraseña incorrecta, por favor verifique'
            })
        } else if (!Usuario.activo) {
            return res.status(400).json({
                message: 'Tu usuario esta inhabilitado, debes contactar a algún administrador'
            })
        }

        const tokens = generateTokens(Usuario)

        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 4200000
        });

        await sesion.create({
            usuario_id: Usuario.usuario_id,
            token: tokens.accessToken
        })

        res.cookie('session', tokens.sessionToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 7200000
        })

        return res.status(200).json({
            message: 'Inicio de sesión exitoso',
            usuario: {
                usuario_id: Usuario.usuario_id,
                nombre: Usuario.nombre,
                apellido: Usuario.apellido,
                email: Usuario.email,
                rol: Usuario.rol,
                fecha_registro: Usuario.fecha_registro
            },
            token: tokens.accessToken
        })

    } catch (error) {

        console.log('Error al iniciar sesión: ', error.message)

        return res.status(500).json({
            message: 'Error al iniciar sesión',
            error: error.message
        })
    }
}

export const logout = async (req, res, next) => {
    try {

        const usuario_id = req.cookies.session

        res.clearCookie('refreshToken', {
            httpOnly: true,
            sameSite: 'strict',
            secure: false,
        });

        await sesion.destroy({
            where: {
                usuario_id: usuario_id
            }
        })

        res.clearCookie('session', {
            httpOnly: true,
            sameSite: 'strict',
            secure: false,
        });

        return res.status(200).json({
            message: 'Sesión cerrada correctamente'
        })

    } catch (error) {

        console.log('Error al cerrar sesión: ', error.message)

        return res.status(500).json({
            message: 'Sesión cerrada',
            error: error.message
        })
    }
}

export const sesion_activa = async (req, res, next) => {
    try {

        const cookie_request = req.cookies.session

        if (!cookie_request) {
            return res.status(401).json({
                message: 'Hubo un error, por favor vuelva a iniciar sesión'
            })
        }

        const verify = jwt.verify(cookie_request, process.env.SESSION_SECRET)

        const usuario_id = verify.usuario_id

        const Usuario = await sesion.findOne({
            where: {
                usuario_id: usuario_id
            },
            include: [{
                model: usuario,
                as: 'usuario',
                attributes: ['usuario_id', 'nombre', 'apellido', 'email', 'rol', 'fecha_registro']
            }]
        })

        if (!Usuario) {
            return res.status(404).json({
                message: 'Aún no has inicado sesión'
            })
        }

        return res.status(200).json({
            message: 'usuario con sesión',
            data: Usuario
        })

    } catch (error) {

        console.log('Error sobre la sesion activa: ', error.message)

        return res.status(500).json({
            message: 'Error sobre la sesion activa',
            error: error.message
        })
    }
}

export const list_user_by_id = async (req, res, next) => {
    try {

        const { usuario_id } = req.body

        if (!usuario_id) {
            return res.status(400).json({
                message: 'Debe seleccionar un usuario o buscarlo por su codigo, por favor verifique'
            })
        }

        const Usuario = await usuario.findOne({
            where: {
                usuario_id: usuario_id
            }
        })

        if (!Usuario) {
            return res.status(404).json({
                message: 'El usuario no esta registrado, por favor verifique'
            })
        }

        return res.status(200).json({
            message: 'Usuario encontrado!',
            data: Usuario
        })

    } catch (error) {

        console.log('Error al buscar el usuario por su id: ', error.message)

        return res.status(500).json({
            message: 'Error al buscar el usuario por su id',
            error: error.message
        })
    }
}

export const update_account = async (req, res, next) => {
    try {

        const { usuario_id, nombre, apellido, email } = req.body

        if (!usuario_id || !nombre || !apellido || !email) {
            return res.status(400).json({
                message: "Faltan campos obligatorios, por favor verifique"
            })
        }

        const User = await usuario.findOne({
            where: {
                email: email,
                usuario_id: { [Op.ne]: usuario_id }
            }
        })

        if (User) {
            return res.status(400).json({
                message: 'Ya existe un usuario registrado con este correo eléctronico, por favor verifique'
            })
        } else if (!validateEmail(email)) {
            return res.status(400).json({
                message: 'Formato de correo eléctronico no válido'
            })
        }

        await usuario.update({
            nombre: nombre,
            apellido: apellido,
            email: email
        }, {
            where: {
                usuario_id: usuario_id
            }
        })

        const newUser = await usuario.findOne({
            where: {
                usuario_id: usuario_id
            },
            attributes: ['usuario_id', 'nombre', 'apellido', 'email', 'rol', 'fecha_registro']
        })

        return res.status(200).json({
            message: "¡Cuenta actualizada con exito!",
            usuario: newUser
        })

    } catch (error) {

        console.log('Error al actualizar la cuenta: ', error.message)

        return res.status(500).json({
            message: 'Error al actualizar la cuenta',
            error: error.message
        })
    }
}

export const update_account_users = async (req, res, next) => {
    try {

        const { usuario_id, nombre, apellido } = req.body

        if (!usuario_id || !nombre || !apellido) {
            return res.status(400).json({
                message: "Faltan campos obligatorios, por favor verifique"
            })
        }

        await usuario.update({
            nombre: nombre,
            apellido: apellido
        }, {
            where: {
                usuario_id: usuario_id
            }
        })

        const newUser = await usuario.findOne({
            where: {
                usuario_id: usuario_id
            },
            attributes: ['usuario_id', 'nombre', 'apellido', 'email', 'rol', 'fecha_registro']
        })

        return res.status(200).json({
            message: "¡Cuenta actualizada con exito!",
            usuario: newUser
        })

    } catch (error) {

        console.log('Error al actualizar la cuenta: ', error.message)

        return res.status(500).json({
            message: 'Error al actualizar la cuenta',
            error: error.message
        })
    }
}

