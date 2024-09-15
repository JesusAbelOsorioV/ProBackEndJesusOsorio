import sendEmail from './sendEmail.js'
import { logger } from './logger.js'
import { userService } from '../service/service.js'
import { __dirname } from '../utils.js'
import connectDB from '../config/index.js'

const timeToRemove = 1000 * 60 * 60 * 24 * 2;

const checkInactiveU = 1000 * 60 * 60;

function formatTime(ms) {
    const segundos = Math.floor((ms / 1000) % 60);
    const minutos = Math.floor((ms / (1000 * 60)) % 60);
    const horas = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const dias = Math.floor(ms / (1000 * 60 * 60 * 24));
    return `${dias} Días ${horas} Horas ${minutos} Minutos ${segundos} Segundos`;
}

const inactUserRemove = async () => {
    try {
        logger.info("Buscando los usuarios sin actividad");

        const users = await userService.getUsers();
        const dateNow = new Date();
        let usersRemoved = 0;

        for (const user of users.docs) {
            const lastConnectionDate = new Date(user.last_connection || null);
            const diferenTime = dateNow - lastConnectionDate;

            if (user.last_connection && diferenTime > timeToRemove) {
                await sendEmail({
                    email: user.email,
                    subject: 'La cuenta fue eliminada inactividada',
                    html: `
                        <h1>Hola, ${user.first_name} ${user.last_name}</h1>
                        <p>Tu cuenta ${user.email} fue eliminada por motivis de inactividad ${formatTime(diffTime)}.</p>
                    `,
                });
                await userService.delateUser({ _id: user._id });
                logger.info(`El usuario ${user.email} fue eliminado por inactividad durante ${formatTime(diffTime)}.`);
                usersRemoved++;
            }
        }

        if (usersRemoved > 0) {
            logger.info(`${usersRemoved} Usuarios inactivos eliminados.`);
            process.send({ type: 'incativeUserRemove', message: `${usersRemoved} usuarios eliminados` });
        } else {
            process.send({ type: 'inactiveUserRemove', message: 'sin usuarios inactivos,' });
        }
    } catch (error) {
        logger.error(`Error al eliminar usuarios inactivos: ${error.message}`);
        process.send({ type: 'error', message: `Error: ${error.message}` });
    }
};

const checkingInactiveU = () => {
    logger.info("Búsqueda de usuarios inactivos");
    setInterval(() => {
        inactUserRemove();
    }, checkInactiveU);
};

process.on('message', async (message) => {
    if (message === 'busqueda-de-usuarios-inactivos') {
        await connectDB();
        checkingInactiveU();
    }
});