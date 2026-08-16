import jwt from "jsonwebtoken"
import dotenv from 'dotenv'

dotenv.config()

const authenticate = (req, res, next) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            message: 'Token no proporcionado'
        })
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, usuario) => {
        if (error) {
            return res.status(403).json({
                message_about_token: 'Token inválido o expirado, acceso denegado'
            });
        }
        req.usuario = usuario;
        next();
    });
}

export default authenticate