import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "./lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email as string },
        });

        if (user) {
          const correctPassword = await bcrypt.compare(
            credentials?.password as string,
            user.password
          );

          if (correctPassword) {
            return { id: user.id, email: user.email, name: user.username };
          } else {
            throw new Error("La contraseña no es correcta");
          }
        }

        throw new Error("El usuario no existe");
      },
    }),
  ],
});
