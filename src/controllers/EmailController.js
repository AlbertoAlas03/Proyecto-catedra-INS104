import Transporter from "../emails/configuration-email.js";
import dotenv from 'dotenv'
import change_password from '../models/change_password.js'
import usuario from '../models/usuario.js'
import bcrypt from "bcryptjs";

dotenv.config()

export const sendEmail = async (req, res, next) => {

    try {
        const { email } = req.body

        if (!email) {
            return res.status(400).json({
                message: 'Debe ingresar su correo elétronico'
            })
        }

        const verify = await change_password.findOne({
            where: {
                email: email
            }
        })

        if (!verify) {
            const code = Math.floor(100000 + Math.random() * 900000);

            const mailOptions = {
                from: process.env.EMAIL,
                to: email,
                subject: 'Cambio de contraseña',
                html: `<h1>Hola!</h1><p> Estas realizando un cambio de contraseña, tu codigo de verificación es: <strong>${code}</strong></p>`
            }

            await Transporter.sendMail(mailOptions)

            await change_password.create({
                email: email,
                code: code
            })

            return res.status(200).json({
                message: 'Se ha enviado un codigo de verificación a tu correo eléctronico, por favor verifique'
            })

        } else {
            return res.status(200).json({
                message: 'Ya tenías activo un proceso de cambio de contraseña, verifica tu correo eléctronico'
            })
        }

    } catch (error) {

        console.log('Error al mandar el email: ', error.message)

        return res.status(500).json({
            message: 'Error al mandar el email',
            error: error.message
        })
    }
}

export const ChangePassword = async (req, res, next) => {
    try {

        const { email, code, password, confirm_password } = req.body

        if (!email || !code || !password || !confirm_password) {
            return res.status(400).json({
                message: 'Faltan campos obligatorios, por favor verifique'
            })
        }

        const user = await usuario.findOne({
            where: {
                email: email
            }
        })

        if (!user) {
            return res.status(404).json({
                message: 'Este usuario no esta registrado, por favor verifique'
            })
        }

        const request = await change_password.findOne({
            where: {
                email: email
            }
        })

        if (!request) {
            return res.status(404).json({
                message: 'No tienes petición de cambio de contraseña, por favor verifica'
            })
        }

        if (parseInt(code) !== request.code) {
            return res.status(400).json({
                message: 'Codigo de verificación incorrecto, por favor verifique'
            })
        } else if (password !== confirm_password) {
            return res.status(400).json({
                message: 'Las contraseñas no coinciden, por favor verifica'
            })
        }

        const passwordHash = bcrypt.hashSync(password, 10)

        await user.update({
            password: passwordHash
        })

        await request.destroy()

        return res.status(200).json({
            message: '¡Cambio de contraseña exitoso!'
        })

    } catch (error) {

        console.log('Error al cambiar la contraseña: ', error.message)

        return res.status(500).json({
            message: 'Error al cambiar la contraseña',
            error: error.message
        })
    }
}

export const cancel_change = async (req, res, next) => {
    try {

        const { email } = req.body

        if (!email) {
            return res.status(400).json({
                message: 'Se debe ingresar el correo'
            })
        }

        const checkout = await change_password.findOne({
            where: {
                email: email
            }
        })

        if (!checkout) {
            return res.status(404).json({
                message: 'No tienes ninguna petición de cambio de contraseña activa'
            })
        }

        await checkout.destroy()

        return res.status(200).json({
            message: '¡Petición de cambio de contraseña cancelada con exito!'
        })

    } catch (error) {

        console.log('Error al cancelar el cambio de contraseña: ', error.message)

        return res.status(500).json({
            message: 'Error al cancelar el cambio de contraseña',
            error: error.message
        })
    }
}