"use client";

import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ChevronLeft, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  username: z.string().min(1, { message: "Campo Obligatorio" }),
  email: z
    .string()
    .email({ message: "Email Inválido" })
    .min(1, { message: "Campo Obligatorio" }),
  password: z.string().min(1, { message: "Campo Obligatorio" }),
});

interface Props {
  mode: "login" | "register";
}

const AuthForm = ({ mode }: Props) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: mode === "register" ? "" : "a",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (mode === "register") {
        const { data } = await axios.post("/api/users/api/register", values);

        if (data.ok) {
          toast.success(data.message);
        } else if (data.error) {
          toast.error(data.error);
        }
      } else {
        const response = await signIn("credentials", {
          redirect: false,
          email: values.email,
          password: values.password,
        });

        if (response?.error) {
          toast.error("Credenciales no válidas");
        } else if (response?.ok) {
          toast.success("Inicio de sesión exitoso");
          router.push("/");
          router.refresh();
        }
      }
    } catch (error) {
      toast.error("Algo salió mal, vuelve a intentarlo");
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 items-center justify-center">
      <div className="text-sm font-medium">
        <Link
          href={`/`}
          className="flex items-center gap-1.5 py-0.5 border-b border-transparent hover:border-b-zinc-950 transition-all duration-200"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Volver al Home</span>
        </Link>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-[320px] px-6 py-6 border border-zinc-300 rounded-md space-y-3"
        >
          <h2 className="font-medium text-lg">
            {mode === "register" ? "Registrate" : "Inicia Sesión"}
          </h2>

          <div>
            {mode === "register" && (
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usuario</FormLabel>
                    <FormControl>
                      <Input placeholder="ej. johndoe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo Electrónico</FormLabel>
                  <FormControl>
                    <Input placeholder="ej. johndoe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="*********************"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            {form.formState.isSubmitting ? (
              <>
                <Button disabled className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>
                    {mode === "register"
                      ? "Registrando..."
                      : "Iniciando Sesión..."}
                  </span>
                </Button>
              </>
            ) : (
              <>
                <Button type="submit">
                  {mode === "register" ? "Registrar" : "Iniciar Sesión"}
                </Button>
              </>
            )}
          </div>
        </form>
      </Form>
      <div className="text-sm">
        {mode === "register" ? (
          <>
            <p>
              Ya tienes una cuenta?{" "}
              <Link
                className="font-semibold hover:underline transition-all duration-200"
                href={`/login`}
              >
                Inicia Sesión
              </Link>
            </p>
          </>
        ) : (
          <>
            <p>
              Aún no tienes una cuenta?{" "}
              <Link
                className="font-semibold hover:underline transition-all duration-200"
                href={`/register`}
              >
                Registrate
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
