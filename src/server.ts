import express, { Request, Response } from 'express';
import cors from 'cors';
import { Server, WebSocket } from 'ws'; 
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const app = express();
const prisma = new PrismaClient();
app.use(cors());
app.use(express.json());

interface CreateValuesBody {
  comunicationValue: boolean;
}

app.get('/values', async (req: Request, res: Response) => {
  try {
    const values = await prisma.values.findMany();
    res.json({ values });
  } catch (error) {
    res.status(500).send('Error retrieving values');
  }
});

app.post('/values', async (req: Request, res: Response) => {
  try {
    const createValuesSchema = z.object({
      comunicationValue: z.boolean(),
    });

    const { comunicationValue } = createValuesSchema.parse(req.body as CreateValuesBody);

    const createdValue = await prisma.values.create({
      data: {
        comunicationValue,
      },
    });

    broadcast(createdValue);

    res.sendStatus(201);
  } catch (error) {
    res.status(400).send('Invalid data');
  }
});

const server = app.listen(process.env.PORT || 3333, () => {
  console.log('HTTP Server Running');
});

const wss = new Server({ server });

wss.on('connection', (ws: WebSocket) => {
  console.log('New WebSocket connection');
  
  ws.on('message', (message) => {
    const parsedMessage = message.toString();
    console.log(`Received message => ${parsedMessage}`);
  });
  
  ws.send(JSON.stringify({ message: 'Hello! Message from the server...' }));
});

function broadcast(value: any) {
  const message = JSON.stringify({
    values: [value], 
  });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}
