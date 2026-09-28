import { DataTypes } from "sequelize";
import { sequelize } from '../database/db_connection.js'

const inscripcion = sequelize.define('inscripciones', {
    inscripcion_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        unique: true,
        autoIncrement: true
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
    fecha_inscripcion: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    estado: {
        type: DataTypes.ENUM('activa', 'completada', 'cancelada'),
        allowNull: false,
        defaultValue: 'activa'
    }
}, {
    tableName: 'inscripciones',
    timestamps: false
})

export default inscripcion