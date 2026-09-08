import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadFileToS3(file: File, folder: string = "models"): Promise<string> {
  // 1. FILE TO BUFFER FOR NODE OPERACIONS
  const buffer = Buffer.from(await file.arrayBuffer());
  
  // FILE NAME AND PATH
  const fileExtension = file.name.split('.').pop();
  const uniqueFileName = `${folder}/${crypto.randomUUID()}.${fileExtension}`;

  // PREPARING PACKAGE
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: uniqueFileName,
    Body: buffer,
    ContentType: file.type || "model/gltf-binary",
  });

  // SENDING TO S3
  await s3Client.send(command);

  // RETURNING PUBLIC URL
  return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueFileName}`;
}