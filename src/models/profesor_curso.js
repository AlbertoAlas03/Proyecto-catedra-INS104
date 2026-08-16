import { DataTypes } from "sequelize";
import { sequelize } from '../database/db_connection.js'

const profesor_curso = sequelize.define('profesor_curso', {
    asignacion_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    profesor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'usuarios',
            key: 'usuario_id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
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
    fecha_asignacion: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'profesor_curso',
    timestamps: false
})

export default profesor_curso