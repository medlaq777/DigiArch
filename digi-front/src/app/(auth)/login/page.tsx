"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});

export default function LoginPage() {
  const router = useRouter();
  const loginStore = useAuthStore((state) => state.login);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/auth/login", {
        email: values.email,
        password: values.password,
      });

      const { access_token } = response.data; 
      
      const userData = {
          userId: "1", // Placeholder
          email: values.email,
          role: "admin" // Placeholder - backend needs to send this or we decode JWT
      };

      loginStore(access_token, userData);
      Cookies.set("token", access_token, { expires: 1 }); // Expires in 1 day
      
      router.push("/dashboard");
    } catch (err: unknown) {
      console.error(err);
      let errorMessage = "Login failed. Please check your credentials.";
      if (typeof err === "object" && err !== null && "response" in err) {
          const response = (err as { response: { data: { message: string } } }).response;
          if (response?.data?.message) {
              errorMessage = response.data.message;
          }
      }
      setError(errorMessage);
    } finally {
        setLoading(false);
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-muted/50">
        <Card className="w-[350px]">
        <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Enter your email below to login.</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                        <Input placeholder="admin@digiarch.com" {...field} />
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                        <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 {error && (
                    <div className="flex items-center gap-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                         <AlertCircle className="h-4 w-4" />
                        <p>{error}</p>
                    </div>
                )}
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Login
                </Button>
            </form>
            </Form>
        </CardContent>
        </Card>
    </div>
  );
}
