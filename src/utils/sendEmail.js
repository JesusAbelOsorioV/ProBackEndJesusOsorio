import nodemeiler from 'nodemailer'
import { objectConfig } from '../config/index.js'

const { gmail_user, gmail_pass } = objectConfig
const transport = nodemeiler.createTransport({
    service:'gmail',
    port: 587,
    auth: {
        user: gmail_user,
        pass: gmail_pass
    }
})

export const sendEmail = async () =>{
    return await transport.sendMail({
        from: 'Ecommers correo<josorio2094@gmail.com>',
        to: 'abelosorio2001@gmail.com',
        subject: 'Ecommers Jesus Osorio',
        html: `<div>Email de Ecommers Jesus</div>`
    })
}
