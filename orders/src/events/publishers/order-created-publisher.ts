import { Publisher, OrderCreatedEvent, Subjects } from "@groundzero/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}