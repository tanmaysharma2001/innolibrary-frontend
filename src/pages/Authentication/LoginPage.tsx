import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { BookOpen } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";

// const formSchema = z
//   .object({
//     username: z.string().min(2, {
//       message: "Username must be at least 2 characters.",
//     }),
//     password: z
//       .string()
//       .min(8, {
//         message: "Password must be at least 8 characters.",
//       })
//       .max(50, {
//         message: "Password cannot be longer than 50 characters.",
//       }),
//     confirmPassword: z
//       .string()
//       .min(8, {
//         message: "Confirm Password must be at least 8 characters.",
//       })
//       .max(50, {
//         message: "Confirm Password cannot be longer than 50 characters.",
//       }),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: "Passwords do not match.",
//     path: ["confirmPassword"],
//   });

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters.",
    })
    .max(50, {
      message: "Password cannot be longer than 50 characters.",
    }),
});

export const LoginPage = () => {
  const { toast } = useToast();

  const { login } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    try {
      await login(values);
    } catch (error) {
      toast({
        title: `Login Error:`,
        variant: "destructive",
        description: `${(error as Error).message}`,
      });
    }
  }

  //   const handleLogin = async (e) => {
  //     e.preventDefault();
  //     // Here you would usually send a request to your backend to authenticate the user
  //     // For the sake of this example, we're using a mock authentication
  //     if (username === "user" && password === "password") {
  //       // Replace with actual authentication logic
  //       await login({ username });
  //     } else {
  //       alert("Invalid username or password");
  //     }
  //   };

  return (
    <div>
      <section className="bg-white">
        <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
          <aside className="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6">
            <img
              alt=""
              src="https://images.unsplash.com/photo-1568667256549-094345857637?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGlicmFyaWVzfGVufDB8fDB8fHww"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </aside>

          <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
            <div className="max-w-xl lg:max-w-3xl">
              <a className="block text-blue-600" href="#">
                <span className="sr-only">Home</span>
                <BookOpen className="h-10 w-10" />
              </a>

              <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
                Welcome to InnoLibrary
              </h1>

              <p className="mt-4 leading-relaxed text-gray-500">
                Login to view your personalised library with your favorite
                collection.
              </p>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="mt-8 grid grid-cols-6 gap-6"
                >
                  <div className="col-span-6">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="block text-start text-lg m-2 font-medium text-gray-700">
                            Username
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="johndoe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-6">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="block text-start text-lg m-2 font-medium text-gray-700">
                            Password
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="doe1234" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                    <button className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500">
                      Login
                    </button>

                    <p className="mt-4 text-sm text-gray-500 sm:mt-0">
                      Don't have an account?
                      <a href="/register" className="text-gray-700 underline">
                        {" "}
                        Sign Up
                      </a>
                      .
                    </p>
                  </div>
                </form>
              </Form>
            </div>
          </main>
        </div>
      </section>
    </div>
  );
};
