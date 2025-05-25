import {Router} from "express"

// Controllers
import { createUsers } from "../controller/userController"

const router = Router()

router.post("/register", createUsers /* verfyToken, */ /*createUser */ )
router.post("/login", /* verfyToken, */ /*loginUser */ )

router.get("/checkuser", /* checkuser */ )

router.patch("/edit", /* verfyToken, imageUpload, editUser */)

router.get("/myprofile", /* verifyToken, myProfile */)

router.get("/:id", /* getUserById */ )



export default router