
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { natsWrapper } from './nats-wrapper';
const start = async () => {
    console.log('Starting app!');
    // Check mandatory environment variables
    if(!process.env.NATS_CLUSTER_ID || !process.env.NATS_CLIENT_ID || !process.env.NATS_URL){
        throw new Error('NATS env variables must be defined');
    }
    
    try { 
        await natsWrapper.connect(
            process.env.NATS_CLUSTER_ID, 
            process.env.NATS_CLIENT_ID, 
            process.env.NATS_URL
        );
        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed!');
            process.exit();
        });
        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());

        new OrderCreatedListener(natsWrapper.client).listen();
    } catch (err) {
        console.error(err);
    }

};

start();