import { OrderCancelledEvent, OrderCreatedEvent, OrderStatus } from "@groundzero/common";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/order";
import { OrderCancelledListener } from "../order-cancelled-listener";


const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        price: 10,
        userId: 'asdasd',
        version: 0
    });
    await order.save();

    const data: OrderCancelledEvent['data'] = {
        id: order.id,
        version: order.version + 1,
        ticket: {
            id: 'asdasd',
        }
    }
    // @ts-ignore
    const msg: Message = { 
        ack: jest.fn()
    };
    return { listener, data, order, msg };
};

it('update the status of the order', async ()=> {
    const { listener, data, order, msg} = await setup();
    await listener.onMessage(data, msg);

    const orderUpdated = await Order.findById(order.id);
    expect(orderUpdated!.status).toEqual(OrderStatus.Cancelled);
});
it('ack the message', async ()=> {
    const { listener,data,msg} = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
});