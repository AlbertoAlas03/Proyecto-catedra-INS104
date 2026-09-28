import data from "../data/data"

const Url = () => {

    const url_login = data + 'login'
    const url_logout = data + 'logout'
    const url_count = data + 'count'
    const url_renovar_sesion = data + 'refresh_token'
    const url_list_user = data + 'list_usuarios'
    const url_add_user = data + 'add_usuario'
    const url_enable_user = data + 'habilitar_usuario'
    const url_disable_user = data + 'inhabilitar_usuario'
    const url_update_user = data + 'update_usuario'
    const url_session = data + 'session'
    const url_list_idiomas = data + 'list_idiomas'
    const url_add_idioma = data + 'add_idioma'
    const url_delete_idioma = data + 'delete_idioma'
    const url_update_idioma = data + 'update_idioma'
    const url_list_cursos = data + 'list_cursos'
    const url_add_curso = data + 'add_curso'
    const url_delete_curso = data + 'delete_curso'
    const url_update_curso = data + 'update_curso'
    const url_list_profesores_asignados = data + 'list_profesores_cursos'
    const url_list_profesores = data + 'list_usuarios_profesores'
    const url_list_cursos_no_iniciados = data + 'list_cursos_no_iniciados'
    const url_assign_teacher = data + 'asignar_curso_profesor'
    const url_delete_assignment = data + 'delete_profesor_curso'
    const url_update_assignment = data + 'update_profesor_curso'
    const url_search_idioma = data + 'search_idioma'
    const url_search_curso = data + 'search_curso'
    const url_search_asignacion = data + 'search_asignacion'
    const url_search_usuario = data + 'search_usuario'
    const url_send_code = data + 'send_email'
    const url_change_password = data + 'change_password'
    const url_cancel_change = data + 'cancel_change'
    const url_update_account = data + 'update_account'

    return {
        url_login,
        url_logout,
        url_count,
        url_renovar_sesion,
        url_list_user,
        url_add_user,
        url_enable_user,
        url_disable_user,
        url_update_user,
        url_session,
        url_list_idiomas,
        url_add_idioma,
        url_delete_idioma,
        url_update_idioma,
        url_list_cursos,
        url_add_curso,
        url_delete_curso,
        url_update_curso,
        url_list_profesores_asignados,
        url_list_profesores,
        url_list_cursos_no_iniciados,
        url_assign_teacher,
        url_delete_assignment,
        url_update_assignment,
        url_search_idioma,
        url_search_curso,
        url_search_asignacion,
        url_search_usuario,
        url_send_code,
        url_change_password,
        url_cancel_change,
        url_update_account
    }
}

export default Url