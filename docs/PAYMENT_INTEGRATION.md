# Payment Integration

This document describes the payment integration system and how to use Polar as the payment provider.

## Polar Integration

The system now uses Polar as the only payment provider. The integration includes:
- **Checkout Sessions**: Redirect-based checkout using Polar's hosted checkout page
- **Webhooks**: Handle Polar webhook events for payment and subscription updates

### Polar Configuration

Add the following environment variable to your `.env` file:

```
POLAR_ACCESS_TOKEN=your_polar_access_token
```

### Creating a Checkout Session

To create a checkout session, use the `/api/user/subscription` or `/api/organizations/[orgId]/subscription` endpoint. The backend will create a Polar checkout session and return a URL to redirect the user.

### Webhook Handling

Polar webhooks are handled at `/api/webhooks/polar`. The backend will update subscription status and plan based on webhook events from Polar.

---

All previous references to Flutterwave and Paystack have been removed. This system is now Polar-only. 