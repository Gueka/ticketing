import express, {Request, Response} from 'express';
import {body} from 'express-validator';
import { requireAuth, validateRequest }  from '@groundzero/common';
import { Ticket } from '../models/ticket';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post('/api/tickets', requireAuth, [ 
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),

], validateRequest, async (req: Request, res: Response) => {
    console.log('Creating ticket')
    const {title, price} = req.body;

    const ticket = Ticket.build({
        title,
        price,
        userId: req.currentUser!.id,
    });

    const saved = await ticket.save();

    
    new TicketCreatedPublisher(natsWrapper.client).publish({
        id: saved.id,
        version: saved.version,
        title: saved.title,
        price: saved.price,
        userId: saved.userId,
    });
    

    res.status(201).send(ticket);
});

export {router as createTicketRouter};