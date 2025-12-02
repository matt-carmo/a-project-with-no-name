import fp from 'fastify-plugin'
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient
  }
}

const PrismaPlugin = fp(async (fastify, options) => {
  // Create a PostgreSQL connection pool
  const pool = new Pool({ 
     connectionString: process.env.DATABASE_URL 
  })
  
  // Create the adapter
  const adapter = new PrismaPg(pool)
  
  // Initialize Prisma Client with the adapter
  const prisma = new PrismaClient({ adapter })

  try {
    await prisma.$connect()
    console.log('✅ Connected to database')
  } catch (err) {
    console.error('❌ Failed to connect to database:', err)
    throw err
  }

  fastify.decorate('prisma', prisma)

  fastify.addHook('onClose', async (fastify) => {
    await fastify.prisma.$disconnect()
    console.log('✅ Disconnected from database')
  })
})

export default PrismaPlugin