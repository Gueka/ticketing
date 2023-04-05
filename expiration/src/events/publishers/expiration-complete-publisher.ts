import { ExpirationCompleteEvent, Publisher, Subjects } from "@groundzero/common";


export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;

}