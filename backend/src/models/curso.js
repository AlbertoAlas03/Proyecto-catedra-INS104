import { DataTypes } from "sequelize";
import { sequelize } from '../database/db_connection.js'

const curso = sequelize.define('cursos', {
    curso_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    idioma_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'idiomas',
            key: 'idioma_id'
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
        allowNull: true
    },
    programa: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    modalidad: {
        type: DataTypes.ENUM('Presencial', 'En línea'),
        allowNull: false,
        validate: {
            isIn: {
                args: [['Presencial', 'En línea']],
                msg: 'Solamente existen las modalidades presencial y virtual, por favor verifique'
            }
        }
    },
    horario: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    fecha_inicio: {
        type: DataTypes.DATE,
        allowNull: false
    },
    fecha_fin: {
        type: DataTypes.DATE,
        allowNull: false
    },
    capacidad_maxima: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    estado: {
        type: DataTypes.ENUM('activo', 'finalizado', 'no iniciado'),
        allowNull: false,
        validate: {
            isIn: {
                args: [['activo', 'finalizado', 'no iniciado']],
                msg: 'El estado del curso debe ser activo, finalizado o no iniciado, por favor verifique'
            }
        },
        defaultValue: 'no iniciado'
    }
}, {
    tableName: 'cursos',
    timestamps: true
})

export default curso