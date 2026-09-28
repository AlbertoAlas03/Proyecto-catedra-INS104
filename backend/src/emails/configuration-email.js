import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const Transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.KEY_EMAIL
    }
})

export default Transporter