import { OrderCancelledEvent } from "@groundzero/common";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async () => {
    // create an instance of the listener
    const listener = new OrderCancelledListener(natsWrapper.client);

    // create and save a ticket
    const orderId = new mongoose.Types.ObjectId().toHexString()
    const ticket = Ticket.build({
        title: 'concert',
        price: 99,
        userId: 'test001'
    });
    ticket.set({ orderId });
    await ticket.save();
    const data: OrderCancelledEvent['data'] = {
        id: orderId,
        version: 0,
        ticket: {
            id: ticket.id
        }
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, ticket, data, orderId, msg };
};
it('udpate the ticket, publishes an event', async () => {
    const { listener, ticket, data, orderId, msg } = await setup();
    await listener.onMessage(data, msg);
    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).not.toBeDefined();

});

it('ack the message', async () => {
    const { listener, ticket, data, msg } = await setup();
    await listener.onMessage(data, msg);
    
    expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket cancelled event', async () => {
    const { listener, ticket, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
})