import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { randomBytes } from 'crypto';
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener';

const start = async () => {
    console.log('Starting app.');
    // Check mandatory environment variables
    if(!process.env.JWT_KEY){
        throw new Error('JWT_KEY must be defined');
    }
    if(!process.env.MONGO_URI){
        throw new Error('MONGO_URI must be defined');
    }
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
        new OrderCancelledListener(natsWrapper.client).listen();

        await mongoose.connect(process.env.MONGO_URI, {});
        console.log('Connected to MongoDb');
    } catch (err) {
        console.error(err);
    }

    app.listen(3000, () => {
        console.log('Listening to port 3000!');
    });
};

start();