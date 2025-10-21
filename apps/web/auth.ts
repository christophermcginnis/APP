import { Resend } from "resend";
import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";

import { prismaAdapter } from "@/lib/auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import type { User as NextAuthUser } from "next-auth";

const resendApiKey = process.env.RESEND_API_KEY;
const emailFrom = process.env.EMAIL_FROM;

if (!resendApiKey) {
  console.warn(
    "[auth] RESEND_API_KEY is not set. Email magic links will fail until it is configured."
  );
}

if (!emailFrom) {
  console.warn(
    "[auth] EMAIL_FROM is not set. Falling back to a generic sender; configure a verified sender for delivery."
  );
}

const resend = resendApiKey ? new Resend(resendApiKey) : null;

export const authOptions = {
  adapter: prismaAdapter(),
  session: {
    strategy: "jwt"
  } as const,
  trustHost: true,
  providers: [
    EmailProvider({
      server: {
        host: process.env.SMTP_HOST ?? "",
        port: Number(process.env.SMTP_PORT ?? 587),
        auth: {
          user: process.env.SMTP_USER ?? "",
          pass: process.env.SMTP_PASS ?? ""
        }
      },
      from: emailFrom ?? "CircleCast <auth@circlecast.local>",
      async sendVerificationRequest({ identifier, url, provider }) {
        if (!resend) {
          throw new Error("Resend client is not configured. Cannot send verification email.");
        }

        const result = await resend.emails.send({
          from: provider.from ?? emailFrom ?? "CircleCast <auth@circlecast.local>",
          to: identifier,
          subject: "Sign in to CircleCast",
          html: `
            <div style="font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
              <h1 style="font-size: 20px; margin-bottom: 12px;">Finish signing in</h1>
              <p style="margin-bottom: 16px;">Click the button below to access your CircleCast account.</p>
              <a href="${url}" style="display: inline-block; padding: 12px 18px; background: linear-gradient(135deg, #818cf8, #22d3ee, #34d399); color: #0f172a; font-weight: 600; border-radius: 999px; text-decoration: none;">Sign in</a>
              <p style="margin-top: 24px; font-size: 12px; color: #64748b;">If you did not request this email you can safely ignore it.</p>
            </div>
          `,
          text: `Sign in to CircleCast:\n${url}`
        });

        if (result.error) {
          throw new Error(`Failed to send verification email: ${result.error.message}`);
        }
      }
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const emailInput = credentials?.email;
        const passwordInput = credentials?.password;

        const email = typeof emailInput === "string" ? emailInput.trim() : undefined;
        const password = typeof passwordInput === "string" ? passwordInput : undefined;

        if (!email || !password) {
          return null;
        }

        const devEmail = process.env.DEV_LOGIN_EMAIL?.trim().toLowerCase();
        const devPassword = process.env.DEV_LOGIN_PASSWORD;

        const normalizedInputEmail = email.toLowerCase();

        if (
          devEmail &&
          devPassword &&
          normalizedInputEmail === devEmail &&
          password === devPassword
        ) {
          const userRecord = await prisma.user.upsert({
            where: { email: devEmail },
            update: {},
            create: {
              email: devEmail,
              name: "Developer Access",
              handle: "dev-access"
            }
          });

          const user: NextAuthUser & { handle?: string | null } = {
            id: userRecord.id,
            email: userRecord.email ?? undefined,
            name: userRecord.name ?? undefined,
            handle: userRecord.handle ?? undefined
          };

          const existingCircleCount = await prisma.circle.count({
            where: { ownerId: userRecord.id }
          });

          if (existingCircleCount === 0) {
            const circle = await prisma.circle.create({
              data: {
                name: "Dev Circle",
                focusArea: "Testing flows",
                cadence: "Weekly",
                access: "OPEN",
                members: 12,
                companionTone: "Supportive, fast iterations",
                ownerId: userRecord.id
              }
            });

            await prisma.circleSession.create({
              data: {
                circleId: circle.id,
                scheduledFor: new Date(Date.now() + 1000 * 60 * 60 * 24),
                topic: "Roadmap sync",
                hostId: userRecord.id
              }
            });

            await prisma.companionTask.create({
              data: {
                circleId: circle.id,
                title: "Draft weekly summary",
                kind: "SUMMARY",
                status: "IN_PROGRESS",
                etaMinutes: 10,
                payload: {
                  insight: "Summarise testing activity and next steps."
                }
              }
            });
          }

          return user;
        }

        const userRecord = await prisma.user.findFirst({
          where: {
            email: {
              equals: email,
              mode: "insensitive"
            }
          }
        });

        if (!userRecord?.passwordHash) {
          return null;
        }

        const passwordMatches = await bcrypt.compare(password, userRecord.passwordHash);

        if (!passwordMatches) {
          return null;
        }

        const user: NextAuthUser & { handle?: string | null } = {
          id: userRecord.id,
          email: userRecord.email ?? undefined,
          name: userRecord.name ?? undefined,
          handle: userRecord.handle ?? undefined
        };

        return user;
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const enhancedUser = user as NextAuthUser & { handle?: string | null };
        token.sub = enhancedUser.id;
        token.handle = enhancedUser.handle ?? null;
      } else if (!("handle" in token) || token.handle === undefined) {
        if (token.sub) {
          const dbUser = await prisma.user.findUnique({ where: { id: token.sub } });
          token.handle = dbUser?.handle ?? null;
        } else {
          token.handle = null;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.sub === "string" ? token.sub : "";
        const handle = typeof token.handle === "string" ? token.handle : null;
        session.user.handle = handle;
      }
      return session;
    }
  }
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
