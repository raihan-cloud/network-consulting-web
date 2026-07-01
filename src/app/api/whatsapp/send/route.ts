import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function normalizePhone(phone: string) {
  const cleaned = phone.replace(/[^\d]/g, "");

  if (cleaned.startsWith("0")) return `62${cleaned.slice(1)}`;
  if (cleaned.startsWith("62")) return cleaned;

  return cleaned;
}

async function sendToFonnte(phone: string, message: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);

  try {
    const response = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: {
        Authorization: process.env.FONNTE_TOKEN || "",
      },
      body: new URLSearchParams({
        target: phone,
        message,
        countryCode: "62",
      }),
      signal: controller.signal,
    });

    const data = await response.json();

    return {
      ok: response.ok,
      data,
    };
  } finally {
    clearTimeout(timeout);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const phone = normalizePhone(body.phone || "");
    const message = body.message || "";

    if (!phone || !message) {
      return NextResponse.json({
        success: false,
        error: "Nomor WhatsApp dan pesan wajib diisi.",
      });
    }

    if (!process.env.FONNTE_TOKEN) {
      return NextResponse.json({
        success: false,
        error: "FONNTE_TOKEN belum diatur.",
      });
    }

    let lastError = "";

    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const result = await sendToFonnte(phone, message);

        if (result.ok && result.data?.status !== false) {
          return NextResponse.json({
            success: true,
            data: result.data,
          });
        }

        lastError =
          result.data?.reason ||
          result.data?.message ||
          "Fonnte menolak request.";
      } catch (error: any) {
        lastError =
          error?.name === "AbortError"
            ? "Fonnte timeout."
            : error?.message || "Gagal menghubungi Fonnte.";
      }

      await new Promise((resolve) => setTimeout(resolve, 1500));
    }

    return NextResponse.json({
      success: false,
      error: lastError,
    });
  } catch (error: any) {
    console.error("WHATSAPP SEND ERROR:", error);

    return NextResponse.json({
      success: false,
      error: error?.message || "Gagal mengirim WhatsApp.",
    });
  }
}