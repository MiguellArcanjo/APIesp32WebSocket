import { PrismaClient } from "@prisma/client";
import fastify from "fastify";
import { z } from 'zod'

const app = fastify();

const prisma = new PrismaClient()

app.get('/values', async () => {
    const values = await prisma.values.findMany();

    return { values }
})

app.post('/values', async (request, reply) => {
    const createValuesSchema = z.object({
        comunicationValue: z.boolean(),
    })

    const { comunicationValue } = createValuesSchema.parse(request.body)

    await prisma.values.create({
        data: {
            comunicationValue
        }
    })

    return reply.status(201).send();
})

app.listen({
    host: '0.0.0.0',
    port: process.env.PORT ? Number(process.env.PORT) : 3333,
}).then(() => {
    console.log('HTTP Server Running')
})