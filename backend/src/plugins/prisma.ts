import 'dotenv/config'

import fp from 'fastify-plugin'
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const PrismaPlugin = fp(async (fastify) => {
  const pool = new Pool({
    // connectionString: 'postgresql://postgres:jSyKTKBbtMKNjMfQdggFKHTSmLCMmXvT@shuttle.proxy.rlwy.net:30141/railway',
    connectionString: process.env.DATABASE_URL,
  })

  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter })

  try {
    // await prisma.$connect()
    // await prisma.user.count() // Test query to ensure connection is valid
    console.log('✅ Connected to database')
  } catch (err) {
    console.error('❌ Failed to connect to database:', err)
    throw err
  }


  fastify.decorate('prisma', prisma)

  // Fecha conexão ao encerrar o servidor
  fastify.addHook('onClose', async () => {
    await prisma.$disconnect()
  })
})

export default PrismaPlugin
