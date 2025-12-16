import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

console.log('Starting seed...')
console.log('DATABASE_URL:', process.env.DATABASE_URL?.replace(/:[^:@]*@/, ':****@'))

async function main() {
  // Create PostgreSQL connection pool
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  })

  // Create the adapter
  const adapter = new PrismaPg(pool)

  // Initialize Prisma Client with the adapter
  const prisma = new PrismaClient({ adapter })

  try {
    console.log('🌱 Seeding database...')

    // Clear existing data (optional)
    // await prisma.user.deleteMany()

//   const user = await prisma.user.create({
//     data: {
//       name: "Admin",
//       email: "admin@example.com",
//       password: "$2b$10$hashAquiExemplo123", // coloque um hash real!
//     },
//   });

  //
//   -----------------------------------
//   2) Create a store
//   -----------------------------------
  

  const store = await prisma.store.create({
    data: {
      name: "Lanchonete Central",
      slug: "lanchonete-central",
      phoneNumber: "55999999999",
      settings: {
        create: {
          isOpen: true,
          minOrderValue: 0,
          deliveryFee: 5,
          pickupEnabled: true,
          deliveryEnabled: true,
          openHours: "08:00-23:00",
        },
      },
    },
  });

//   //
//   // -----------------------------------
//   // 3) Associa o usuário como OWNER
//   // -----------------------------------
//   //

  await prisma.storeUser.create({
    data: {
      userId: 'cmj64l4840000lx6oyaex03rr',
        storeId: store.id,
      role: 'ADMIN',
    },
  });

//   //
//   // -----------------------------------
//   // 4) Criar categorias
//   // -----------------------------------
//   //

//   const categories = await prisma.category.createMany({
//     data: [
//       { name: "Burgers", storeId: store.id, order: 1 },
//       { name: "Bebidas", storeId: store.id, order: 2 },
//     ],
//   });

//   //
//   // -----------------------------------
//   // 5) Criar produtos
//   // -----------------------------------
//   //

  // const burgerCategory = await prisma.category.findFirst({
  //   where: { name: "Burgers", storeId: 'cmir07opv0000vdbcgyq81u0q' },
  // });

  // const drinksCategory = await prisma.category.findFirst({
  //   where: { name: "Bebidas", storeId: 'cmir07opv0000vdbcgyq81u0q' },
  // });

  // const xsalada = await prisma.product.create({
  //   data: {
  //     storeId: 'cmir07opv0000vdbcgyq81u0q',
  //     categoryId: burgerCategory!.id,
  //     name: "X-Salada",
  //     description: "Hambúrguer artesanal com salada",
  //     price: 20,
  //     image: null,
  //   },
  // });

  // const coca = await prisma.product.create({
  //   data: {
  //     storeId: 'cmir07opv0000vdbcgyq81u0q',
  //     categoryId: drinksCategory!.id,
  //     name: "Coca-Cola Lata",
  //     description: "350ml",
  //     price: 6,
  //   },
  // });

//   //
//   // -----------------------------------
//   // 6) Criar grupos de complementos
//   // -----------------------------------
//   //

  // const groupProteinas = await prisma.complementGroup.create({
  //   data: {
  //     storeId: 'cmir07opv0000vdbcgyq81u0q',
  //     name: "Escolha a proteína",
  //     description: "Escolha 1 opção",

  //     minSelected: 1,
  //     maxSelected: 1,
  //   },
  // });

  // const groupAdicionais = await prisma.complementGroup.create({
  //   data: {
  //       storeId: 'cmir07opv0000vdbcgyq81u0q',
  //     name: "Adicionais",
  //     description: "Aumente seu lanche",
 
  //     minSelected: 0,
  //     maxSelected: 5,
  //   },
  // });

  //
  // -----------------------------------
  // 7) Criar complementos
  // -----------------------------------
  //

  // const complementosProtein = await prisma.complement.createMany({
  //   data: [
  //     { name: "Carne bovina", price: 0, groupId: groupProteinas.id, },
  //     { name: "Frango grelhado", price: 0, groupId: groupProteinas.id },
  //     { name: "Carne dupla", price: 5, groupId: groupProteinas.id },
  //   ],
  // });

  // const complementosAdicionais = await prisma.complement.createMany({
  //   data: [
  //     { name: "Bacon", price: 4, groupId: groupAdicionais.id },
  //     { name: "Cheddar", price: 3, groupId: groupAdicionais.id },
  //     { name: "Ovo", price: 2, groupId: groupAdicionais.id },
  //   ],
  // });

  //
  // -----------------------------------
  // 8) Associar os grupos ao produto X-Salada
  // -----------------------------------
  //

  // await prisma.productComplementGroup.createMany({
  //   data: [
  //     { productId: xsalada.id, groupId: groupProteinas.id },
  //     { productId: xsalada.id, groupId: groupAdicionais.id },
  //   ],
  // });

  //
  // -----------------------------------
  // (Opcional) 9) Criar 1 pedido para testes
  // -----------------------------------
  //
  /*
  const order = await prisma.order.create({
    data: {
      storeId: store.id,
      customerName: "João",
      customerPhone: "55988887777",
      status: "PENDING",
      total: 26,
      items: {
        create: [
          {
            productId: xsalada.id,
            name: "X-Salada",
            quantity: 1,
            price: 20,
            orderItemComplements: {
              create: [
                {
                  complementId: ???, // ex: bacon
                  price: 4
                }
              ]
            }
          }
        ]
      }
    }
  });
  */

  console.log("🌱 Seed finalizado com sucesso!");
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main().then(() => {
    console.log('Seed script finished.')
})
  .catch((e) => {
    console.error('Seed script error:', e)
    process.exit(1)
  })