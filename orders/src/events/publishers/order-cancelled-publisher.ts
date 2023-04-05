import { Publisher, Subjects, OrderCancelledEvent } from "@groundzero/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}