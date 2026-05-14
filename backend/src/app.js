//# configuras express aquí

import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.routes.js'
import adminRoutes from './routes/admin.routes.js'
import restaurantesRoutes from './routes/restaurantes.routes.js'

const app = express()

app.use(cors())
app.use(express.json())

// Rutas
app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/restaurantes', restaurantesRoutes)
// app.use('/api/ejemplo', ejemploRoutes)

export default app