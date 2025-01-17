import axios from 'axios';
import { showAlert, hideAlert } from './alert'
const stripe = Stripe('pk_test_51QhMEIB263MtG6VqnNsvU8VuIp4ifooYwnSDFvUXbUfxcp8gVyfGDSrwCpZV6ovsE53eXiAXJXiBTtxuGjpP8OpF00XSF5sx9z')

export const bookTour = async tourId => {
    try {
        //get the session from the server
        const session = await axios(`http://127.0.0.1:3000/api/v1/booking/checkout-session/${tourId}`);
        //create check out form and process
        console.log(session.data.session.id);
        await stripe.redirectToCheckout({ sessionId: session.data.session.id })
    } catch (err) {
        showAlert('error', err)
    }
}