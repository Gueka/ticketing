import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

// stan == client
const stan = nats.connect('ticketing', 'publisher' + randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'
});

stan.on('connect', async () => {
    console.log('Publisher connected to NATS');

    const data = {
        id: '233',
        title: 'concert',
        price: 20
    };

    const publisher = new TicketCreatedPublisher(stan);
    try {
        await publisher.publish(data);
    }catch (err){
        console.error(err);
    }
});