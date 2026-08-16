'use strict'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { sequelize } from './database/db_connection.js'
import dotenv from 'dotenv'
import iniciar_relaciones from './models/relaciones.js'
import routes from './routes/index.js'
import cookieParser from 'cookie-parser'
import nodeCron from 'node-cron'
import update_cursos from './utils/updateCourse.js'

iniciar_relaciones()
dotenv.config()

const app = express()

//function for the connection to the database
const db_connection = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexión exitosa');
        await sequelize.sync({ force: false }); //creacion de tablas 
    } catch (error) {
        console.log("❌ error al conectar a mysql: ", error);
        process.exit(1)
    }
}

//check if the connection to the database is successful
db_connection();

//updating courses
nodeCron.schedule('0 0 * * *', () => {
    console.log('⏰ Actualizando cursos...');
    update_cursos();
});

//settings
const port = process.env.PORT || 3002;
app.set('json spaces', 2);

//middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin: [process.env.URL_ADMIN, process.env.URL_TEACHER, process.env.URL_STUDENT],
    credentials: true
}));

//routes
app.use(routes);

//starting the server
app.listen(port, () => {
    console.log('➡️ Server listening on port ' + port)
})