import { TicketUpdatedEvent } from "@groundzero/common";
import { natsWrapper } from "../../../nats-wrapper";
import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
import { TicketUpdatedListener } from "../ticket-updated-listener";

const setup = async () => {
    // create an instance of the listener. 
    const listener = new TicketUpdatedListener(natsWrapper.client);

    // create and save a ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 10,

    });
    await ticket.save();

    // create a fake data event.
    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        title: 'new concert',
        price: 120,
        version: ticket.version + 1,
        userId: new mongoose.Types.ObjectId().toHexString(),
    };
    // create a fake message object.
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };
    return { listener, data, msg, ticket };
};

it('it finds, update and saves a ticket', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    const updatedTicket = await Ticket.findById(data.id);
    
    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version);
});

it('acks the message', async () => {
    const { listener, data, msg } = await setup();
    //call the onmessage function with the data object + message object
    await listener.onMessage(data, msg);
    
    expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has a skipped version number', async () => {
    const { listener, data, msg, ticket } = await setup();

    data.version = 10;

    try {
        await listener.onMessage(data, msg);
    }catch (err){}
    
    expect(msg.ack).not.toHaveBeenCalled();
});