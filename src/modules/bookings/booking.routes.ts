// booking.routes.ts
import { Router } from 'express';
import { bookingControllers } from './booking.controllers';
import auth from '../../middlewares/auth/auth';

const router = Router();

router.post('/', auth("admin", "customer"), bookingControllers.createBooking);
router.get('/', auth("admin", "customer"), bookingControllers.getAllBookings);
router.put('/:id', auth("admin", "customer"), bookingControllers.updateBooking)


export const bookingsRouter = router;