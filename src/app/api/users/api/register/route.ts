import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export const POST = async (req: NextRequest) => {
  const { username, email, password } = await req.json();

  try {
    const usernameExists = await prisma.user.findUnique({
      where: { username },
    });
    const emailExists = await prisma.user.findUnique({ where: { email } });

    if (usernameExists) {
      return NextResponse.json({ error: "El usuario ya existe" });
    } else if (emailExists) {
      return NextResponse.json({ error: "El correo ya existe" });
    }

    const passwordHashed = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: passwordHashed,
      },
    });
    return NextResponse.json(
      { ok: true, message: "Usuario registrado exitosamente" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
