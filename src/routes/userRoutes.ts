import { Router } from "express"

// Controllers
import { checkuser, createUsers, editUser, getUserById, loginUser, myProfile } from "../controller/userController"

// Middlewares
import verifyToken from "../middleware/verify-token"

// Validations
import { validate } from "../middleware/handleValidation"
import { userCreateValidation, userEditValidation, userLoginValidation } from "../middleware/userValidations"
import { imageUpload } from "../middleware/image-uploader"

const router = Router()

router.post("/register", userCreateValidation(), validate, createUsers)
router.post("/login", userLoginValidation(), validate, loginUser)

router.get("/checkuser", checkuser)

router.patch("/edit", verifyToken, imageUpload.single("image"), userEditValidation(), validate, editUser)

router.get("/myprofile", verifyToken, myProfile)

router.get("/:id", verifyToken, getUserById)



export default router