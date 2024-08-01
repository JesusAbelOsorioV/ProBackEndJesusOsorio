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

export const sendRecoveryPass = async ({email, subject, html}) =>{
    try{
     const sendEmail = await transport.sendMail({
        from: 'Ecommers correo<josorio2094@gmail.com>',
        to: email,
        subject,
        html
    })
    console.info('Email enviado: ', sendEmail.response )   
    }catch(error){
        console.error('error al enviar email:', error)
    }
    
}
