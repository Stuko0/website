#!/usr/bin/env node

/**
 * Script de inicialización de PocketBase
 * Crea las colecciones necesarias para DelCarpio
 * 
 * Uso: node scripts/init-pocketbase.js
 */

import PocketBase from 'pocketbase'

const pb = new PocketBase('http://localhost:8090')

async function login() {
  try {
    await pb.admins.authWithPassword('admin@delcarpio.com', 'admin123')
    console.log('✓ Autenticado como admin')
    return true
  } catch (error) {
    console.error('✗ Error de autenticación:', error.message)
    console.log('\nPrimero necesitas crear un admin:')
    console.log('1. Ve a http://localhost:8090/_/')
    console.log('2. Crea una cuenta de administrador')
    console.log('3. Actualiza las credenciales en este script')
    return false
  }
}

async function createProductsCollection() {
  console.log('\n→ Creando colección "products"...')
  
  try {
    await pb.collections.create({
      name: 'products',
      type: 'base',
      schema: [
        {
          name: 'name',
          type: 'text',
          required: true
        },
        {
          name: 'slug',
          type: 'text',
          required: true,
          unique: true
        },
        {
          name: 'description',
          type: 'text'
        },
        {
          name: 'price',
          type: 'number',
          required: true,
          min: 0
        },
        {
          name: 'category',
          type: 'text',
          required: true
        },
        {
          name: 'image',
          type: 'text'
        },
        {
          name: 'imageHover',
          type: 'text'
        },
        {
          name: 'unit',
          type: 'text',
          required: true
        },
        {
          name: 'visible',
          type: 'bool',
          required: true
        }
      ],
      listRule: '',
      viewRule: '',
      createRule: '@request.auth.role = "admin"',
      updateRule: '@request.auth.role = "admin"',
      deleteRule: '@request.auth.role = "admin"'
    })
    console.log('✓ Colección "products" creada')
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('✓ Colección "products" ya existe')
    } else {
      console.error('✗ Error:', error.message)
    }
  }
}

async function createRecipesCollection() {
  console.log('\n→ Creando colección "recipes"...')
  
  try {
    await pb.collections.create({
      name: 'recipes',
      type: 'base',
      schema: [
        {
          name: 'title',
          type: 'text',
          required: true
        },
        {
          name: 'slug',
          type: 'text',
          required: true,
          unique: true
        },
        {
          name: 'summary',
          type: 'text'
        },
        {
          name: 'difficulty',
          type: 'text',
          required: true
        },
        {
          name: 'prep_time',
          type: 'text',
          required: true
        },
        {
          name: 'image',
          type: 'text'
        },
        {
          name: 'content',
          type: 'editor'
        },
        {
          name: 'published',
          type: 'bool',
          required: true
        }
      ],
      listRule: '',
      viewRule: '',
      createRule: '@request.auth.role = "admin"',
      updateRule: '@request.auth.role = "admin"',
      deleteRule: '@request.auth.role = "admin"'
    })
    console.log('✓ Colección "recipes" creada')
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('✓ Colección "recipes" ya existe')
    } else {
      console.error('✗ Error:', error.message)
    }
  }
}

async function updateUsersCollection() {
  console.log('\n→ Actualizando colección "users"...')
  
  try {
    const users = await pb.collections.getOne('users')
    
    const hasRole = users.schema.some(field => field.name === 'role')
    if (!hasRole) {
      users.schema.push({
        name: 'role',
        type: 'select',
        required: true,
        maxSelect: 1,
        values: ['customer', 'admin']
      })
      
      await pb.collections.update('users', users)
      console.log('✓ Campo "role" agregado a usuarios')
    } else {
      console.log('✓ Campo "role" ya existe en usuarios')
    }
  } catch (error) {
    console.error('✗ Error:', error.message)
  }
}

async function seedProducts() {
  console.log('\n→ Insertando productos de ejemplo...')
  
  const products = [
    {
      name: 'Chocolate Amargo 70%',
      slug: 'chocolate-amargo-70',
      description: 'Chocolate negro con 70% de cacao puro',
      price: 35,
      category: 'chocolates',
      image: 'https://images.pexels.com/photos/6261615/pexels-photo-6261615.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      imageHover: 'https://images.pexels.com/photos/6261692/pexels-photo-6261692.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      unit: 'unidad',
      visible: true
    },
    {
      name: 'Chocolate con Leche',
      slug: 'chocolate-con-leche',
      description: 'Chocolate suave con leche y cacao',
      price: 30,
      category: 'chocolates',
      image: 'https://images.pexels.com/photos/6261691/pexels-photo-6261691.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      imageHover: 'https://images.pexels.com/photos/8900912/pexels-photo-8900912.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      unit: 'unidad',
      visible: true
    },
    {
      name: 'Bombones Rellenos',
      slug: 'bombones-rellenos',
      description: 'Bombones artesanales con rellenos variados',
      price: 45,
      category: 'bombones',
      image: 'https://images.pexels.com/photos/7538069/pexels-photo-7538069.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      imageHover: 'https://images.pexels.com/photos/10303625/pexels-photo-10303625.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      unit: 'unidad',
      visible: true
    }
  ]
  
  for (const product of products) {
    try {
      await pb.collection('products').create(product)
      console.log(`✓ Producto "${product.name}" creado`)
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log(`✓ Producto "${product.name}" ya existe`)
      } else {
        console.error(`✗ Error creando "${product.name}":`, error.message)
      }
    }
  }
}

async function seedRecipes() {
  console.log('\n→ Insertando recetas de ejemplo...')
  
  const recipes = [
    {
      title: 'Brownies de Chocolate',
      slug: 'brownies-chocolate',
      summary: 'Deliciosos brownies húmedos con nueces',
      difficulty: 'Fácil',
      prep_time: '45 min',
      image: 'https://images.pexels.com/photos/3026804/pexels-photo-3026804.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      content: '<h2>Ingredientes</h2><ul><li>200g chocolate negro</li><li>150g mantequilla</li><li>3 huevos</li><li>200g azúcar</li><li>100g harina</li><li>100g nueces</li></ul><h2>Preparación</h2><ol><li>Derretir chocolate con mantequilla</li><li>Batir huevos con azúcar</li><li>Mezclar todo y agregar harina</li><li>Hornear 25 minutos a 180°C</li></ol>',
      published: true
    },
    {
      title: 'Galletas de Avena y Chocolate',
      slug: 'galletas-avena-chocolate',
      summary: 'Galletas saludables con avena y chips de chocolate',
      difficulty: 'Fácil',
      prep_time: '30 min',
      image: 'https://images.pexels.com/photos/3185489/pexels-photo-3185489.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      content: '<h2>Ingredientes</h2><ul><li>2 tazas avena</li><li>1 taza harina</li><li>1 taza chips chocolate</li><li>1 taza mantequilla</li><li>1 taza azúcar</li><li>2 huevos</li></ul><h2>Preparación</h2><ol><li>Mezclar ingredientes secos</li><li>Agregar mantequilla derretida y huevos</li><li>Formar galletas</li><li>Hornear 12 minutos a 175°C</li></ol>',
      published: true
    }
  ]
  
  for (const recipe of recipes) {
    try {
      await pb.collection('recipes').create(recipe)
      console.log(`✓ Receta "${recipe.title}" creada`)
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log(`✓ Receta "${recipe.title}" ya existe`)
      } else {
        console.error(`✗ Error creando "${recipe.title}":`, error.message)
      }
    }
  }
}

async function main() {
  console.log('=== Inicialización de PocketBase ===\n')
  
  const authenticated = await login()
  if (!authenticated) {
    process.exit(1)
  }
  
  await createProductsCollection()
  await createRecipesCollection()
  await updateUsersCollection()
  await seedProducts()
  await seedRecipes()
  
  console.log('\n=== Inicialización completada ===')
  console.log('\nPróximos pasos:')
  console.log('1. Crea un usuario de prueba en http://localhost:8090/_/')
  console.log('2. Asigna el rol "admin" al usuario')
  console.log('3. Inicia el servidor de desarrollo: npm run dev')
  console.log('4. Prueba el login en http://localhost:4321/login')
}

main().catch(console.error)
