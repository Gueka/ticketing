import { requireAuth, validateRequest } from '@groundzero/common';
import express, {Request, Response} from 'express';
import { body } from 'express-validator';
import { Order } from '../models/order';
//import { Order } from '../models/order';

const router = express.Router();

router.get('/api/orders', requireAuth,
    async (req: Request, res: Response) => {
        console.log('Get orders own by currentUser');
        const orders = await Order.find({
            userId: req.currentUser!.id
        }).populate('ticket');

        res.send(orders);
});

export {router as indexOrderRouter};