import { PaymentCreatedEvent, Publisher, Subjects } from "@groundzero/common";


export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;

}