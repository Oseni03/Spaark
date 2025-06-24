# Payment Integration Guide

This document describes the payment integration system and how to migrate between payment providers (Flutterwave and Paystack).

## Overview

The payment system has been redesigned to use a custom checkout page that accepts card details directly, making it easier to switch between payment providers. The system uses an abstraction layer that supports both Flutterwave and Paystack.

## Architecture

### Components

1. **Custom Checkout Page** (`/checkout`) - Accepts card details and processes payments
2. **Payment Service** (`services/payment.js`) - Abstraction layer for payment providers
3. **API Endpoints** - Handle payment processing and verification
4. **Migration Utilities** (`utils/payment-migration.js`) - Help with provider switching

### Flow

1. User selects a plan on the pricing page
2. User is redirected to `/checkout?type=individual&frequency=monthly`
3. User enters card details on the custom checkout page
4. Payment is processed directly with the payment provider API
5. User is redirected to success/failure page based on payment status

## Current Implementation

### Flutterwave Integration

The system currently uses Flutterwave as the primary payment provider. The integration includes:

- **Card Payments**: Direct card processing via Flutterwave API
- **Payment Links**: For redirect-based payments (fallback)
- **Webhooks**: For payment status updates
- **Verification**: Payment verification after completion

### Environment Variables

```env
# Flutterwave Configuration
FLW_SECRET_KEY=your_flutterwave_secret_key
FLW_PUBLIC_KEY=your_flutterwave_public_key
FLW_SECRET_HASH=your_flutterwave_webhook_secret

# Paystack Configuration (for future use)
PAYSTACK_SECRET_KEY=your_paystack_secret_key
PAYSTACK_PUBLIC_KEY=your_paystack_public_key
PAYSTACK_WEBHOOK_SECRET=your_paystack_webhook_secret
```

## Migration to Paystack

### Step 1: Update Environment Variables

Add Paystack credentials to your environment variables:

```env
PAYSTACK_SECRET_KEY=sk_test_...
PAYSTACK_PUBLIC_KEY=pk_test_...
PAYSTACK_WEBHOOK_SECRET=your_webhook_secret
```

### Step 2: Switch Payment Provider

Update the payment service configuration in `services/payment.js`:

```javascript
// Change this line
const CURRENT_PROVIDER = PAYMENT_PROVIDERS.PAYSTACK;
```

Or use the migration utility:

```javascript
import { switchPaymentProvider } from '@/utils/payment-migration';

// Switch to Paystack
const result = switchPaymentProvider('paystack');
if (result.success) {
  console.log('Successfully switched to Paystack');
}
```

### Step 3: Update Webhook Endpoints

Create a new webhook endpoint for Paystack in `app/api/webhooks/paystack/route.js`:

```javascript
import { NextResponse } from "next/server";
import { handleChargeWebhook } from "@/services/webhooks";
import { logger } from "@/lib/utils";

export async function POST(req) {
  const signature = req.headers.get("x-paystack-signature");
  const secret = process.env.PAYSTACK_WEBHOOK_SECRET;

  // Verify webhook signature
  if (!verifyPaystackSignature(req.body, signature, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  try {
    const payload = await req.json();
    logger.info(`Received Paystack webhook: ${payload.event}`);

    switch (payload.event) {
      case "charge.success":
        await handleChargeWebhook(payload.data);
        break;
      case "subscription.disable":
        await handleSubscriptionCancelled(payload.data);
        break;
      default:
        logger.info(`Unhandled webhook event: ${payload.event}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    logger.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
```

### Step 4: Test the Integration

1. Use Paystack test cards for testing
2. Verify payment processing works correctly
3. Test webhook handling
4. Verify subscription management

### Step 5: Update Documentation

Update user-facing documentation to reflect the new payment provider.

## API Endpoints

### Payment Processing

- `POST /checkout` - Initialize payment and create transaction
- `POST /api/payment/process-card` - Process card payment directly
- `POST /api/payment/verify` - Verify payment status

### Webhooks

- `POST /api/webhooks/flutterwave` - Flutterwave webhooks
- `POST /api/webhooks/paystack` - Paystack webhooks (to be created)

## Testing

### Test Cards

#### Flutterwave Test Cards
- **Visa**: 4556052704172643
- **Mastercard**: 5438898014560229
- **CVV**: Any 3 digits
- **Expiry**: Any future date
- **PIN**: 3310

#### Paystack Test Cards
- **Visa**: 4084084084084081
- **Mastercard**: 5060666666666666666
- **CVV**: Any 3 digits
- **Expiry**: Any future date

### Test Scenarios

1. **Successful Payment**: Use valid test card details
2. **Failed Payment**: Use invalid card details
3. **Insufficient Funds**: Use specific test cards that simulate insufficient funds
4. **Network Error**: Test with network interruptions
5. **Webhook Processing**: Verify webhook handling for payment status updates

## Security Considerations

1. **PCI Compliance**: Card details are not stored on your servers
2. **Webhook Verification**: Always verify webhook signatures
3. **HTTPS**: Ensure all payment endpoints use HTTPS
4. **Input Validation**: Validate all payment data before processing
5. **Error Handling**: Don't expose sensitive information in error messages

## Error Handling

The system includes comprehensive error handling for:

- Invalid card details
- Network errors
- Payment provider errors
- Webhook verification failures
- Transaction processing failures

## Monitoring

Monitor the following for payment issues:

1. **Payment Success Rate**: Track successful vs failed payments
2. **Error Logs**: Monitor payment processing errors
3. **Webhook Delivery**: Ensure webhooks are being received
4. **Transaction Status**: Verify transaction status updates

## Troubleshooting

### Common Issues

1. **Payment Fails**: Check payment provider credentials and test card details
2. **Webhooks Not Received**: Verify webhook URL and signature validation
3. **Transaction Not Updated**: Check webhook processing and database updates
4. **Provider Switch Issues**: Verify environment variables and provider configuration

### Debug Mode

Enable debug logging by setting the log level in your environment:

```env
LOG_LEVEL=debug
```

## Future Enhancements

1. **Multiple Payment Methods**: Support for bank transfers, mobile money
2. **Subscription Management**: Enhanced subscription lifecycle management
3. **Refund Processing**: Automated refund handling
4. **Analytics**: Payment analytics and reporting
5. **Multi-Currency**: Support for multiple currencies

## Support

For payment-related issues:

1. Check the payment provider's documentation
2. Review error logs for specific error messages
3. Test with provided test cards
4. Verify environment variable configuration
5. Check webhook endpoint accessibility 