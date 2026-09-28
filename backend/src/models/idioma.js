import { DataTypes } from "sequelize";
import { sequelize } from '../database/db_connection.js'

const idioma = sequelize.define('idiomas', {
    idioma_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'idiomas',
    timestamps: true
})

export default idioma