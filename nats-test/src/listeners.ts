import { randomBytes } from 'crypto';
import nats from 'node-nats-streaming';
import { TicketCreatedListener } from './events/ticket-created-listener';

console.clear();

// stan == client
const stan = nats.connect('ticketing', 'listener' + randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'
});

stan.on('connect', () => {
    console.log('Listener connected to NATS');
    
    stan.on('close', () => {
        console.log('Closing connection to NATS');
        process.exit();
    })

    const listener = new TicketCreatedListener(stan);
    listener.listen();
});

// Grateful shutdown
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());



