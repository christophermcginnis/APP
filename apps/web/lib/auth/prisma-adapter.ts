import type { Adapter, AdapterAccount } from "next-auth/adapters";
import { prisma } from "@/lib/prisma";

export function prismaAdapter(): Adapter {
  return {
    createUser: async (data) => {
      const user = await prisma.user.create({
        data: {
          email: data.email,
          emailVerified: data.emailVerified,
          name: data.name,
          image: data.image,
          handle: data.handle ?? undefined,
          bio: null
        }
      });
      return user;
    },
    getUser: (id) =>
      prisma.user.findUnique({
        where: { id }
      }),
    getUserByEmail: (email) =>
      prisma.user.findUnique({
        where: { email }
      }),
    getUserByAccount: async ({ provider, providerAccountId }) => {
      const account = await prisma.account.findFirst({
        where: { provider, providerAccountId },
        include: { user: true }
      });
      return account?.user ?? null;
    },
    updateUser: ({ id, ...data }) =>
      prisma.user.update({
        where: { id },
        data
      }),
    deleteUser: (id) =>
      prisma.user.delete({
        where: { id }
      }),
    linkAccount: (data) =>
      prisma.account.create({
        data: data as AdapterAccount
      }),
    unlinkAccount: ({ provider, providerAccountId }) =>
      prisma.account.delete({
        where: {
          provider_providerAccountId: {
            provider,
            providerAccountId
          }
        }
      }).catch(() => undefined),
    createSession: (data) => prisma.session.create({ data }),
    getSessionAndUser: async (sessionToken) => {
      const session = await prisma.session.findUnique({
        where: { sessionToken },
        include: { user: true }
      });
      if (!session) return null;
      const { user, ...sessionData } = session;
      return { session: sessionData, user };
    },
    updateSession: ({ sessionToken, ...data }) =>
      prisma.session
        .update({
          where: { sessionToken },
          data
        })
        .catch(() => null),
    deleteSession: (sessionToken) =>
      prisma.session
        .delete({
          where: { sessionToken }
        })
        .catch(() => null),
    createVerificationToken: (data) =>
      prisma.verificationToken.create({
        data
      }),
    useVerificationToken: async ({ identifier, token }) => {
      try {
        const verificationToken = await prisma.verificationToken.findUnique({
          where: {
            identifier_token: {
              identifier,
              token
            }
          }
        });

        if (!verificationToken) {
          return null;
        }

        await prisma.verificationToken.delete({
          where: {
            identifier_token: {
              identifier,
              token
            }
          }
        });

        return verificationToken;
      } catch {
        return null;
      }
    }
  };
}
