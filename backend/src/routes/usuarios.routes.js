import express from 'express'
import { 
  getMiPerfil, 
  editarPerfil,
  getAllUsuarios,   // 👈 nuevo
  toggleActivo     // 👈 nuevo
} from '../controllers/usuarios.controller.js'
import { verificarToken, soloAdmin } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.get('/mi-perfil', verificarToken, getMiPerfil)
router.put('/mi-perfil', verificarToken, editarPerfil)

// Admin
router.get('/', verificarToken, soloAdmin, getAllUsuarios)
router.patch('/:id/activo', verificarToken, soloAdmin, toggleActivo)

export default router