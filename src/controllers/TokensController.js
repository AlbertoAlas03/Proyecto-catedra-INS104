import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import generateToken from '../utils/generateTokens.js'

dotenv.config()

const refreshToken = async (req, res, next) => {
    try {

        const refreshToken = req.cookies.refreshToken

        if (!refreshToken) {

            return res.status(401).json({
                message: 'Su sesión a expirado por completo, por favor, vuelva a iniciar sesión'
            })
        }

        jwt.verify(refreshToken, process.env.REFRESH_SECRET, (error, usuario) => {

            if (error) {

                res.clearCookie('refreshToken', {
                    httpOnly: true,
                    sameSite: 'strict',
                    secure: false,
                });

                return res.status(403).json({
                    message: 'Su sesión ha caducado, por favor, vuelve a iniciar sesión'
                })
            }

            const newAccessToken = generateToken(usuario);

            return res.status(200).json({
                message: 'Sesión extendida con exito!',
                token_nuevo: newAccessToken.accessToken
            });
        });

    } catch (error) {

        console.log('Error al refrescar el token: ', error.message)

        return res.status(500).json({
            message: 'Error al refrescar el token',
            error: error.message
        })
    }
}

export default refreshToken
