import { NextResponse } from "next/server";
import { logger } from "@/lib/utils";
import { handlePaymentFailure } from "@/services/subscription";
import { paymentService } from "@/services/payment";
import { getUserIdFromSession } from "@/lib/auth-utils";

export async function POST(request) {
	try {
		// Verify authentication
		const userId = await getUserIdFromSession();

		if (!userId) {
			return NextResponse.json(
				{ success: false, error: "Unauthorized" },
				{ status: 401 }
			);
		}

		const { transactionId, priceId, cardData } = await request.json();

		if (!transactionId || !cardData) {
			return NextResponse.json(
				{ success: false, error: "Missing required fields" },
				{ status: 400 }
			);
		}

		// Validate card data
		const {
			card_number,
			cvv,
			expiry_month,
			expiry_year,
			currency,
			amount,
			email,
			tx_ref,
			cardholder_name,
		} = cardData;

		if (
			!card_number ||
			!cvv ||
			!expiry_month ||
			!expiry_year ||
			!currency ||
			!amount ||
			!email ||
			!tx_ref ||
			!cardholder_name
		) {
			return NextResponse.json(
				{ success: false, error: "Missing card information" },
				{ status: 400 }
			);
		}

		logger.info("Processing card payment", {
			transactionId,
			amount,
			currency,
			email,
			provider: paymentService.getCurrentProvider(),
		});

		try {
			// Process payment using the payment service
			const paymentResult = await paymentService.processCardPayment({
				card_number,
				cvv,
				expiry_month,
				expiry_year,
				currency,
				amount,
				email,
				tx_ref,
				cardholder_name,
				meta: {
					transactionId,
					userId,
				},
				priceId,
			});

			if (paymentResult.success) {
				// Payment successful
				logger.info("Card payment successful", {
					transactionId: paymentResult.transaction_id,
					reference: paymentResult.reference,
				});

				return NextResponse.json({
					success: true,
					status: "success",
					transaction_id: paymentResult.transaction_id,
					reference: paymentResult.reference,
					message: paymentResult.message,
				});
			} else if (paymentResult.requires_verification) {
				// Payment requires additional verification (like OTP)
				logger.info("Card payment requires verification", {
					transactionId: paymentResult.transaction_id,
					reference: paymentResult.reference,
				});

				return NextResponse.json({
					success: true,
					status: "pending",
					transaction_id: paymentResult.transaction_id,
					reference: paymentResult.reference,
					message: paymentResult.message,
					requires_verification: true,
				});
			} else {
				// Payment failed
				logger.error("Card payment failed", {
					status: paymentResult.status,
					message: paymentResult.message,
				});

				// Handle failed payment
				await handlePaymentFailure({ transactionId });

				return NextResponse.json({
					success: false,
					status: "failed",
					message: paymentResult.message || "Payment failed",
				});
			}
		} catch (paymentError) {
			logger.error("Payment processing error:", {
				error: paymentError.message,
				response: paymentError.response?.data,
				status: paymentError.response?.status,
			});

			// Handle the failed transaction
			await handlePaymentFailure({ transactionId });

			return NextResponse.json(
				{
					success: false,
					error: "Payment processing failed",
					details:
						paymentError.response?.data?.message ||
						paymentError.message,
				},
				{ status: paymentError.response?.status || 500 }
			);
		}
	} catch (error) {
		logger.error("Card payment processing error:", {
			error: error.message,
			stack: error.stack,
		});

		return NextResponse.json(
			{
				success: false,
				error: "Payment processing failed",
				details: error.message,
			},
			{ status: 500 }
		);
	}
}
