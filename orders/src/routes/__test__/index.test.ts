import request from 'supertest';
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import mongoose from 'mongoose';

const buildTicket = async () => {
    const ticket = Ticket.build({
      title: 'concert',
      price: 20,
      id: new mongoose.Types.ObjectId().toHexString(),
    });
    await ticket.save();
  
    return ticket;
};

it('fetches orders for an particular user', async () => {
     // Create three tickets
    const ticketOne = await buildTicket();
    const ticketTwo = await buildTicket();
    const ticketThree = await buildTicket();

    const userOne = global.signin();
    const userTwo = global.signin();
    // Create one order as User #1
    await request(app)
        .post('/api/orders')
        .set('Cookie', userOne)
        .send({ ticketId: ticketOne.id })
        .expect(201);
        
    // create two order as User #2
    await request(app)
        .post('/api/orders')
        .set('Cookie', userTwo)
        .send({ ticketId: ticketTwo.id })
        .expect(201);
    await request(app)
        .post('/api/orders')
        .set('Cookie', userTwo)
        .send({ ticketId: ticketThree.id })
        .expect(201);
    
    // Make request to get orders from User #2
    const response = await request(app)
        .get('/api/orders')
        .set('Cookie', userTwo)
        .expect(200);

    expect(response.body.length).toEqual(2);
});

it.todo('emits an order created event');