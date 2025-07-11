# Payment Integration

This document describes the payment integration system and how to use Polar as the payment provider.

## Polar Integration

The system now uses Polar as the primary payment provider. The integration includes:
- **Checkout Sessions**: Redirect-based checkout using Polar's hosted checkout page
- **Webhooks**: Handle Polar webhook events for payment and subscription updates

### Polar Configuration

Add the following environment variable to your `.env` file:

```
POLAR_ACCESS_TOKEN=your_polar_access_token
```

### Creating a Checkout Session

To create a checkout session, use the `createPaymentLink` method in the payment service. This will return a URL to redirect the user to the Polar checkout page.

### Webhooks

Set up a webhook endpoint to receive events from Polar. Refer to the Polar documentation for supported event types and payloads.

---

All previous references to Flutterwave and Paystack have been removed. For legacy migration, see the migration script in `utils/payment-migration.js`. 