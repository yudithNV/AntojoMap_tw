import express from 'express'
import { getMiPerfil, editarPerfil } from '../controllers/usuarios.controller.js'
import { verificarToken } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.get('/mi-perfil', verificarToken, getMiPerfil)
router.put('/mi-perfil', verificarToken, editarPerfil)

export default router