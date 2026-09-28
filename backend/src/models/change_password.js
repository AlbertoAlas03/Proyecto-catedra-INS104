import { DataTypes } from "sequelize";
import { sequelize } from "../database/db_connection.js";

const change_password = sequelize.define('change_password', {
    cambio_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    code: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'change_password',
    timestamps: false
})

export default change_password
