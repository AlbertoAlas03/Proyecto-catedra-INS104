import { Router } from "express";
import { list_idiomas, create_idioma, update_idioma, delete_idioma, list_idioma_by_id } from '../controllers/IdiomaController.js'
import {
    list_usuario,
    create_usuario,
    update_usuario,
    habilitar_usuario,
    inhabilitar_usuario,
    list_usuarios_profesores,
    login,
    logout,
    sesion_activa,
    list_user_by_id,
    update_account,
    update_account_users
} from "../controllers/UsuarioController.js";
import { list_cursos, create_curso, update_curso, delete_curso, list_cursos_no_iniciados, list_course_by_id, list_more_courses_not_started } from "../controllers/CursoController.js";
import { list_profesores_cursos, asignar_profesor_curso, update_profesor_curso, delete_profesor_curso, list_profesor_curso, list_assignment_by_id } from "../controllers/ProfesorCursoController.js"
import { list_estudiantes, inscripcion_estudiante, get_my_course, get_users_curso } from "../controllers/InscripcionController.js"
import { list_evaluacion_curso, create_evaluacion, update_evaluacion, delete_evaluacion } from "../controllers/EvaluacionController.js"
import { list_notas_estudiante, add_nota, update_nota, get_nota_estudiante } from "../controllers/NotaController.js"
import { sendEmail, ChangePassword, cancel_change } from "../controllers/EmailController.js";
import count from "../controllers/CountController.js";
import refreshToken from "../controllers/TokensController.js";
import authenticate from "../middlewares/authenticate.js";

const router = Router()

router.get('/api/test', (req, res) => {
    const data = {
        "id": 1,
        "message": "API is working"
    }
    return res.status(200).json(data)
})

//ruta para login
router.post('/api/login', login)

//ruta para logout
router.get('/api/logout', logout)

//ruta para refrescar token de acceso
router.get('/api/refresh_token', refreshToken)

//enpoint para revisar sesión activa
router.get('/api/session', sesion_activa)

//rutas para gestionar idiomas
router.get('/api/list_idiomas', authenticate, list_idiomas)
router.post('/api/add_idioma', authenticate, create_idioma)
router.put('/api/update_idioma', authenticate, update_idioma)
router.delete('/api/delete_idioma', authenticate, delete_idioma)

//rutas para gestionar usuarios
router.get('/api/list_usuarios', authenticate, list_usuario)
router.post('/api/add_usuario', authenticate, create_usuario)
router.put('/api/update_usuario', authenticate, update_usuario)
router.put('/api/habilitar_usuario', authenticate, habilitar_usuario)
router.put('/api/inhabilitar_usuario', authenticate, inhabilitar_usuario)

//rutas para gestionar cursos
router.get('/api/list_cursos', authenticate, list_cursos)
router.post('/api/add_curso', authenticate, create_curso)
router.put('/api/update_curso', authenticate, update_curso)
router.delete('/api/delete_curso', authenticate, delete_curso)

//rutas para gestionar asignacion de profesores a cursos
router.get('/api/list_profesores_cursos', authenticate, list_profesores_cursos)
router.post('/api/asignar_curso_profesor', authenticate, asignar_profesor_curso)
router.put('/api/update_profesor_curso', authenticate, update_profesor_curso)
router.delete('/api/delete_profesor_curso', authenticate, delete_profesor_curso)

//rutas para profesor de un curso
router.get('/api/list_profesor_curso', authenticate, list_profesor_curso)
router.post('/api/list_estudiante_curso', authenticate, list_estudiantes)

//rutas para gestionar evaluaciones
router.post('/api/list_evaluaciones_curso', authenticate, list_evaluacion_curso)
router.post('/api/add_evaluacion', authenticate, create_evaluacion)
router.put('/api/update_evaluacion', authenticate, update_evaluacion)
router.delete('/api/delete_evaluacion', authenticate, delete_evaluacion)

//rutas para gestionar notas
router.post('/api/list_notas_estudiantes', authenticate, list_notas_estudiante)
router.post('/api/add_nota_estudiante', authenticate, add_nota)
router.put('/api/update_nota_estudiante', authenticate, update_nota)
router.post('/api/get_notas', authenticate, get_nota_estudiante)

//ruta para obtener los usuarios profesores
router.get('/api/list_usuarios_profesores', authenticate, list_usuarios_profesores)

//ruta para obtener los cursos no iniciados
router.get('/api/list_cursos_no_iniciados', authenticate, list_cursos_no_iniciados)

//ruta para obtener los cursos no iniciados para inscribir
router.get('/api/list_cursos_inscripcion', authenticate, list_more_courses_not_started)

//ruta para inscribirse a cursos
router.post('/api/inscripcion_estudiante', authenticate, inscripcion_estudiante)

//ruta para obtener los cursos inscritos de un estudiante
router.post('/api/get_my_course', authenticate, get_my_course)

//ruta para obtener total de registros
router.get('/api/count', authenticate, count)

//ruta para obtener usuarios inscritos
router.post('/api/get_users_curso', authenticate, get_users_curso)

//rutas de busqueda
router.post('/api/search_idioma', authenticate, list_idioma_by_id)
router.post('/api/search_curso', authenticate, list_course_by_id)
router.post('/api/search_asignacion', authenticate, list_assignment_by_id)
router.post('/api/search_usuario', authenticate, list_user_by_id)

//rutas para cambio de contraseña profesores y administradores
router.post('/api/send_email', authenticate, sendEmail)
router.post('/api/change_password', authenticate, ChangePassword)
router.post('/api/cancel_change', authenticate, cancel_change)

router.post('/api/send_email_student', sendEmail)
router.post('/api/change_password_student', ChangePassword)
router.post('/api/cancel_change_student', cancel_change)

//ruta para actualizar cuenta
router.put('/api/update_account', authenticate, update_account)
router.put('/api/update_account_users', authenticate, update_account_users)

export default router