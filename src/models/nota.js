import { DataTypes } from "sequelize";
import { sequelize } from "../database/db_connection.js";

const nota = sequelize.define('notas', {
    nota_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    evaluacion_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'evaluaciones',
            key: 'evaluacion_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    estudiante_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'usuarios',
            key: 'usuario_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    curso_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'cursos',
            key: 'curso_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    puntaje_obtenido: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false
    },
    fecha_calificacion: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    nota_final: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false
    }
}, {
    tableName: 'notas',
    timestamps: false
})

export default nota