import { createNotpaddConfig } from "notpadd";

export const notpadd = async () =>
  await createNotpaddConfig({
    publicKey: process.env.NOTPADD_PUBLIC_KEY as string,
    secretKey: process.env.NOTPADD_SECRET_KEY as string,
    outputDir: "content",
    type: "mdx",
    all: true,
    organizationId: process.env.NOTPADD_ORGANIZATION_ID as string,
  });
