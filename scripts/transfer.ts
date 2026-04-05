import { PrismaClient } from "@prisma/client";

// 1. Define your connection strings explicitly
// REPLACE these with your actual connection strings
const LOCAL_URL =
  "postgresql://postgres:admin@localhost:5432/hashpicedit?schema=public";
const NEON_URL =
  "postgresql://neondb_owner:npg_MFYbWB59GPzx@ep-spring-flower-aew37nbv-pooler.c-2.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require";

async function main() {
  console.log("🔌 Connecting to databases...");

  // 2. Initialize two separate clients
  // We override the datasource URL manually
  const localDb = new PrismaClient({
    datasources: { db: { url: LOCAL_URL } },
  } as any);

  const neonDb = new PrismaClient({
    datasources: { db: { url: NEON_URL } },
  } as any);

  try {
    // 3. Fetch data from Local
    console.log("📥 Fetching templates from Local...");
    const templates = await localDb.template.findMany();
    console.log(`   Found ${templates.length} templates.`);

    if (templates.length === 0) {
      console.log("⚠️ No data to transfer.");
      return;
    }

    // 4. Push data to Neon
    console.log("📤 Uploading to Neon...");

    // clear existing data if needed (Optional)
    // await neonDb.template.deleteMany();

    const result = await neonDb.template.createMany({
      data: templates as any,
      skipDuplicates: true, // Vital: Skips records that already exist
    });

    console.log(`✅ Success! Transferred ${result.count} templates.`);
  } catch (error) {
    console.error("❌ Transfer failed:", error);
  } finally {
    await localDb.$disconnect();
    await neonDb.$disconnect();
  }
}

main();
