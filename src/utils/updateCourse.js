import curso from "../models/curso.js";
import { Op } from "sequelize";

const update_cursos = async () => {
    try {

        const [count_finalizados] = await curso.update(
            { estado: 'finalizado' },
            {
                where: {
                    estado: 'activo',
                    fecha_fin: {
                        [Op.lt]: new Date().toLocaleDateString('sv-SE')
                    }
                }
            }
        );

        const [count_iniciados] = await curso.update(
            { estado: 'activo' },
            {
                where: {
                    estado: 'no iniciado',
                    fecha_inicio: {
                        [Op.startsWith]: new Date().toLocaleDateString('sv-SE')
                    }
                }
            }
        )

        console.log(`✅ Cursos actualizados a finalizado: ${count_finalizados}`);
        console.log(`✅ Cursos actualizados a activo: ${count_iniciados}`);

    } catch (error) {
        console.error('❌ Error al actualizar los cursos:', error.message);
    }
}

export default update_cursos