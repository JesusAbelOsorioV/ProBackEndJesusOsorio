import { Router } from "express";
import { UserController } from "../../controllers/user.controller.js";
import authorization from "../../middlewares/authorization.middleware.js";
import passportCall from "../../middlewares/passportCall.middlewares.js";
import { uploader } from "../../middlewares/subirFile.js";

const router = Router()
const{
    createUser,
    uploadDocument,
    getUsers,
    getUserBy,
    userUpdate,
    updateRole

} = new UserController()

router.post('/user', createUser)
router.post('/user/:uid/documents', passportCall('jwt'), authorization('admin', 'premium'),uploader ,uploadDocument)
router.get('/user', getUsers)
router.get('/user/:uid', getUserBy)
router.put('/user/:uid', passportCall('jwt') ,authorization('admin', 'premium') ,userUpdate)
router.put('/user/premium/:uid', updateRole)

export default router;