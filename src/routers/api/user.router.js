import { Router } from "express";
import { UserController } from "../../controllers/user.controller.js";

const router = Router()
const{
    createUser,
    getUsers,
    getUserBy,
    userUpdate

} = new UserController()

router.post('/user', createUser)
router.get('/user', getUsers)
router.get('/user/:uid', getUserBy)
router.put('/user/:uid', userUpdate)

export default router;