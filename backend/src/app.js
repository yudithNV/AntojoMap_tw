//# configuras express aquí

import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.routes.js'
import adminRoutes from './routes/admin.routes.js'
import restaurantesRoutes from './routes/restaurantes.routes.js'
import menuRoutes from './routes/menu.routes.js'
import almuerzosRoutes from './routes/almuerzos.routes.js'
import feedbackRoutes from './routes/feedback.routes.js'
import favoritosRoutes from './routes/favoritos.routes.js'
import reportesRoutes from './routes/reportes.routes.js'

const app = express()

app.use(cors())
app.use(express.json())

// Rutas
app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/restaurantes', restaurantesRoutes)
app.use('/api/menu', menuRoutes)
app.use('/api/almuerzos', almuerzosRoutes)
app.use('/api/feedbacks', feedbackRoutes)
app.use('/api/favoritos', favoritosRoutes)
app.use('/api/reportes', reportesRoutes)

export default app