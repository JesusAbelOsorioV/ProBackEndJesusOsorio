import { userService } from "../service/service.js";

 export class UserController {
    constructor(){
        this.userService = userService;
    }

    getUsers = async (req, res) =>{
        const users = await userService.getUsers()
        res.send({ status: 'success', payload: users })
    }
    getUserBy = async (req, res) =>{
        const {uid} = req.params
        const userFound = await userService.getUserBy({ _id: uid })
        res.send({ status: 'success', payload: userFound })
    }
    createUser = async (req, res) =>{
        const {body} = req
        const resul = await userService.createUser(body)
        res.send({ status: 'success', payload: resul})
    }
    userUpdate = async (req, res) =>{
        const { uid } = req.params;
        const { first_name, last_name, password } = req.body;

        
            const userFound = await userService.getUserBy({ _id: uid });
            if (!userFound) {
                return res.status(404).send({ status: 'error', message: 'User no encontrado' });
            }

            const updatedUser = {};
            if (first_name) updatedUser.first_name = first_name;
            if (last_name) updatedUser.last_name = last_name;
            if (password) updatedUser.password = password;

            if (Object.keys(updatedUser).length === 0) {
                return res.status(400).send({ status: 'error', message: 'No hay nada para actualizar' });
            }

            const result = await userService.update({ _id: uid }, updatedUser);

            if (result.nModified === 0) {
                return res.status(400).send({ status: 'error', message: 'no se aplicaron los cambios' });
            }

            res.status(200).send({ status: 'success', message: `Usuario actualizado ${result}` });

        
    }
    updateRole = async (req, res) => {
        const { uid } = req.params;
        const { role } = req.body;

        const validRoles = ['user', 'premium'];
        if (!validRoles.includes(role)) {
            return res.status(400).send({ status: 'error', error: 'No es valio, deberia ser user o premium' });
        }

        try {
            const userFound = await userService.getUserBy({ _id: uid });
            if (!userFound || userFound.role === 'admin') {
                return res.status(404).send({ status: 'error', message: 'No existe o no esta atorizado para modificar' });
            }

            const userRoleToUpdate = await userService.updateUser({ _id: uid }, { role: role });

            res.status(200).send({ status: 'success', message: `Usuario actualizado, el nuevo rol es: ${role}` });

        } catch (error) {
            res.status(500).send({ status: 'Error', message: error });
        }
    };
}