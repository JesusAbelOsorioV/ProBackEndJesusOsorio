import { Router } from "express";
import { UserController } from "../../controllers/user.controller.js";
import authorization from "../../middlewares/authorization.middleware.js";

const router = Router()
const{
    createUser,
    getUsers,
    getUserBy,
    userUpdate,
    updateRole

} = new UserController()

router.post('/user', createUser)
router.get('/user', getUsers)
router.get('/user/:uid', getUserBy)
router.put('/user/:uid', authorization('admin', 'premium') ,userUpdate)
router.put('/user/premium/:uid', updateRole)

export default router;