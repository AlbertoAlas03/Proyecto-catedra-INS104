import { DataTypes } from "sequelize";
import { sequelize } from '../database/db_connection.js'

const sesion = sequelize.define('sesiones', {
    sesion_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'usuarios',
            key: 'usuario_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    token: {
        type: DataTypes.STRING(255),
        allowNull: false
    }
}, {
    tableName: 'sesiones',
    timestamps: true
})

export default sesion