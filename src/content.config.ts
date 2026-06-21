import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const products = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "src/content/products" }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    description: z.string(),
    price: z.number(),
    category: z.string(),
    image: z.string().optional(),
    visible: z.boolean().default(true),
  }),
})

const recipes = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "src/content/recipes" }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    summary: z.string(),
    difficulty: z.string(),
    prep_time: z.string(),
    image: z.string().optional(),
    content: z.string().optional(),
    published: z.boolean().default(true),
  }),
})

export const collections = { products, recipes }
