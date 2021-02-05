/* eslint-disable no-undef */
export const bookingTour = async (tourId) => {
  var stripe = Stripe(
    'pk_test_51H6nh5FLvYAKFg2hViObnph7EfcmdW8pDZ9nxiqnBaPROmURSjBQKb806bCC5wDvNO5NVNwlZDIIk25lkoAFrjaH00ZUKAErVg'
  )
  try {
    const res = await axios({
      method: 'GET',
      url: `/api/v1/bookings/checkout-session/${tourId}`,
    })
    const { session } = res.data
    return stripe.redirectToCheckout({ sessionId: session.id })
  } catch (error) {
    console.error('Error:', error)
  }
}
