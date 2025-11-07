import { Hono } from "hono";
import { email, success, z } from "zod";
import { db } from "@notpadd/db";
import { waitlist, rateLimitAttempts } from "@notpadd/db/schema";
import { count, sql, eq } from "drizzle-orm";

const ALLOWED_DOMAINS = ["gmail.com", "outlook.com", "yahoo.com", "proton.me"];

async function checkRateLimitDB(ip: string, limit = 3, windowMs = 120000) {
  const now = new Date();

  const attempts = await db
    .select()
    .from(rateLimitAttempts)
    .where(eq(rateLimitAttempts.identifier, ip))
    .limit(1);

  const currentAttempt = attempts[0];

  if (!currentAttempt || currentAttempt.expiresAt < now) {
    const newExpiry = new Date(now.getTime() + windowMs);
    await db
      .insert(rateLimitAttempts)
      .values({ identifier: ip, count: 1, expiresAt: newExpiry })
      .onConflictDoUpdate({
        target: rateLimitAttempts.identifier,
        set: { count: 1, expiresAt: newExpiry },
      });
    return { allowed: true, remaining: limit - 1, resetTime: newExpiry };
  }

  if (currentAttempt.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: currentAttempt.expiresAt,
    };
  }

  await db
    .update(rateLimitAttempts)
    .set({ count: sql`${rateLimitAttempts.count} + 1` })
    .where(eq(rateLimitAttempts.identifier, ip));

  return {
    allowed: true,
    remaining: limit - (currentAttempt.count + 1),
    resetTime: currentAttempt.expiresAt,
  };
}

const emailSchema = z.object({
  email: z.email("Please enter a valid email address").refine((email) => {
    const [, domain] = email.split("@");
    if (!domain) return false;

    const allowed = ALLOWED_DOMAINS.some(
      (allowed) => domain === allowed || domain.endsWith(`.${allowed}`)
    );
    if (!allowed) return false;

    const labels = domain.split(".");
    if (labels.length < 2 || labels.length > 3) return false;
    const tld = labels.at(-1);
    if (!tld) return false;

    return /^[a-z]{2,63}$/i.test(tld);
  }, "Invalid email, please try again"),
});

const waitlistRoutes = new Hono();

waitlistRoutes.post("/join", async (c) => {
  const ip =
    c.req.header("x-forwarded-for") || c.req.header("x-real-ip") || "anonymous";

  const rateLimitResult = await checkRateLimitDB(ip, 3, 120000);

  if (!rateLimitResult.allowed) {
    return c.json({
      success: false,
      error: "Too many requests. Please wait before trying again.",
      retryAfter: Math.ceil(
        (rateLimitResult.resetTime.getTime() - Date.now()) / 1000
      ),
    });
  }

  const emailParse = emailSchema.safeParse(await c.req.json());
  if (!emailParse.success) {
    return c.json({ error: emailParse.error.message }, 400);
  }

  const { email } = emailParse.data;
  const existingEmail = await db
    .select()
    .from(waitlist)
    .where(eq(waitlist.email, email.toLowerCase().trim()))
    .limit(1)
    .then((rows) => rows[0]);

  if (existingEmail) {
    return c.json(
      {
        success: false,
        error: "This email is already on the waitlist",
      },
      400
    );
  }

  await db
    .insert(waitlist)
    .values({ email: email.toLowerCase().trim(), id: crypto.randomUUID() });

  return c.json({
    success: true,
    message: "You have been added to the waitlist",
  });
});

waitlistRoutes.get("/count", async (c) => {
  const result = await db.select({ count: count() }).from(waitlist);
  const resultCount = result[0]!.count || 0;
  return c.json({ count: resultCount });
});

export { waitlistRoutes };
