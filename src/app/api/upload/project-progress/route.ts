import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    if (
      !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return NextResponse.json(
        {
          error:
            "Cloudinary ENV belum lengkap. Cek NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.",
        },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const projectId = formData.get("projectId") as string | null;

    if (!file) {
      return NextResponse.json({ error: "File foto wajib diupload." }, { status: 400 });
    }

    if (!projectId) {
      return NextResponse.json({ error: "Project ID wajib dikirim." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
            {
                folder: `netpro/project-progress/${projectId}`,
                resource_type: "image",
                timeout: 120000,
                transformation: [
                { width: 1200, crop: "limit" },
                { quality: "auto:low" },
                { fetch_format: "auto" },
                ],
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
            );
      stream.end(buffer);
    });

    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    });
  } catch (error: any) {
    console.error("CLOUDINARY UPLOAD ERROR:", error);

    return NextResponse.json(
      {
        error:
          error?.message ||
          error?.error?.message ||
          "Gagal upload foto progress.",
      },
      { status: 500 }
    );
  }
}