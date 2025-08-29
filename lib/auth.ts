import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import prisma from "./prisma";
import type { NextAuthOptions } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account", 
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false;

      // Vérifier si l'utilisateur existe déjà
      let existing = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (!existing) {
        // Créer un nouvel utilisateur USER pour OAuth
        existing = await prisma.user.create({
          data: {
            email: user.email,
            name: user.name,
            image: user.image,
            role: "USER",
          },
        });
      }

      // Si login OAuth (Google), créer l'Account si inexistant
      if (account?.provider && account.provider !== "credentials") {
        const accountExists = await prisma.account.findUnique({
          where: {
            provider_providerAccountId: {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            },
          },
        });

        if (!accountExists) {
          await prisma.account.create({
            data: {
              userId: existing.id,
              provider: account.provider,
              type: account.type,
              providerAccountId: account.providerAccountId,
              access_token: account.access_token,
              refresh_token: account.refresh_token,
              expires_at: account.expires_at,
              token_type: account.token_type,
              scope: account.scope,
              id_token: account.id_token,
              session_state: account.session_state,
            },
          });
        }
      }

      return true;
    },

    async session({ session, token }) {
      if (session?.user && token?.sub) {
        session.user.id = token.sub;
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { role: true },
        });
        session.user.role = dbUser?.role || "USER";
      }
      return session;
    },

    async jwt({ user, token }) {
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
};
