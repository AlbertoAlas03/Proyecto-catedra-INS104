import { DataTypes } from "sequelize";
import { sequelize } from '../database/db_connection.js'

const evaluacion = sequelize.define('evaluaciones', {
    evaluacion_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        unique: true,
        autoIncrement: true
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
    profesor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'usuarios',
            key: 'usuario_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    fecha_creacion: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    porcentaje: {
        type: DataTypes.DECIMAL(7,4),
        allowNull: false
    }
}, {
    tableName: 'evaluaciones',
    timestamps: false
})

export default evaluacion