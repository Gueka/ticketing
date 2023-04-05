
import mongoose from "mongoose";

interface PaymentAttrs {
    stripeId: string,
    orderId: string,
}

interface PaymentDoc extends mongoose.Document {
    stripeId: string,
    orderId: string,
}

interface PaymentModel extends mongoose.Model<PaymentDoc> {
    build(attrs: PaymentAttrs):PaymentDoc;
}

const orderSchema = new mongoose.Schema({
    stripeId: {
        type: String,
        required: true
    },
    orderId: {
        type: String,
        required: true
    },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

orderSchema.statics.build = (attrs: PaymentAttrs) => {
    return new Payment(attrs);
};

const Payment = mongoose.model<PaymentDoc, PaymentModel>('Payment', orderSchema);

export { Payment };