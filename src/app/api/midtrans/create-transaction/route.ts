import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const amount = Number(body.amount);
    const invoiceId = body.invoiceId || Date.now();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Amount tidak valid" },
        { status: 400 }
      );
    }

    if (!process.env.MIDTRANS_SERVER_KEY) {
      return NextResponse.json(
        { error: "MIDTRANS_SERVER_KEY belum diatur" },
        { status: 500 }
      );
    }

    if (!process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY) {
      return NextResponse.json(
        { error: "NEXT_PUBLIC_MIDTRANS_CLIENT_KEY belum diatur" },
        { status: 500 }
      );
    }

    const midtransClient = require("midtrans-client");

    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY.trim(),
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY.trim(),
    });

    const transaction = await snap.createTransaction({
      transaction_details: {
        order_id: `INV-${invoiceId}-${Date.now()}`,
        gross_amount: amount,
      },
      customer_details: {
        first_name: body.name || "Customer",
        email: body.email || "customer@example.com",
        phone: body.phone || "",
      },
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/invoices`,
      },
    });

    return NextResponse.json({
      success: true,
      token: transaction.token,
      redirect_url: transaction.redirect_url,
    });
  } catch (error: any) {
    console.error("Create transaction error:", error);

    return NextResponse.json(
      {
        error:
          error?.ApiResponse?.error_messages?.[0] ||
          error?.message ||
          "Terjadi kesalahan saat membuat transaksi",
      },
      { status: 500 }
    );
  }
}