import { Router } from "express"

// Controllers
import { checkuser, createUsers, editUser, getUserById, loginUser, myProfile } from "../controller/userController"

// Middlewares
import verifyToken from "../middleware/verify-token"

// Validations
import { userCreateValidation, userEditValidation, userLoginValidation } from "../middleware/userValidations"
import { imageUpload } from "../middleware/image-uploader"

const router = Router()

router.post("/register", userCreateValidation(), createUsers)
router.post("/login", userLoginValidation(), loginUser)

router.get("/checkuser", checkuser)

router.patch("/edit", verifyToken, imageUpload.single("image"), userEditValidation(), editUser)

router.get("/myprofile", verifyToken, myProfile)

router.get("/:id", verifyToken, getUserById)



export default router