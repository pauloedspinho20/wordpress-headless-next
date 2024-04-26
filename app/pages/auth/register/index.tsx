import { ChangeEvent, useState } from "react";
import { GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import cn from "classnames";
import { passwordStrength } from "check-password-strength";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import AsideMenu from "@/components/layout/aside-munu";
import Layout from "@/components/layout";

import background from "./assets/background.jpg";
import { testAPI } from "@/wp-api/api";
import { RegisterUser } from "@/wp-api/mutations/user";

interface Props {
  testApi: boolean;
}

export default function Signup({ testApi }: Props) {
  const [username, setUsername] = useState<string>("");
  const [isUsernameValid, setIsUsernameValid] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [isEmailValid, setIsEmailValid] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false);
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [isPasswordConfirmValid, setIsPasswordConfirmValid] =
    useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [sent, setSent] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>("");

  /* FORM VALIDATION */
  const validateUsername = (usernameToValidate: string) => {
    setIsUsernameValid(usernameToValidate.length > 0);
  };
  const validateEmail = (emailToValidate: string) => {
    setIsEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailToValidate));
  };
  const validatePassword = (passwordToValidate: string) => {
    setIsPasswordValid(passwordToValidate.length >= 8);
  };
  const validatePasswordConfirm = (passwordConfirmToValidate: string) => {
    setIsPasswordValid(passwordConfirmToValidate === password);
  };

  /* REGISTER NEW USER */
  const handleRegister = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");
    try {
      const data = await RegisterUser({
        username: username,
        email: email,
        password: password,
      });

      if (data) {
        console.log("dataaaa", data);
        setUsername("");
        setEmail("");
        setPassword("");
        setSent(true);
      } else {
        setFormError("Please try again");
      }
      setSubmitting(false);
    } catch (error: any) {
      setFormError(error);
      setSubmitting(false);
    }
  };

  return (
    <Layout preview={false}>
      <div className="position-absolute">
        <Image
          src={background.src}
          alt="Login"
          width={background.width}
          height={background.height}
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="position-absolute z-index bg-blend-darken backdrop-blur"></div>
      <form method="post" action="/api/auth/callback/credentials">
        <AsideMenu />
        <div className="relative w-full sm:h-screen sm:py-4 sm:pl-14">
          <div className="container flex h-full items-center justify-center py-12">
            {/* New user */}
            {sent ? (
              <Card>
                <CardHeader>
                  <CardTitle>Successfully registred!</CardTitle>
                </CardHeader>
                <CardContent>You can now use the platform</CardContent>
                <CardFooter>
                  <Link
                    className={cn("w-full", buttonVariants())}
                    href="/auth/login"
                  >
                    Login
                  </Link>
                </CardFooter>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Register</CardTitle>
                  <CardDescription>
                    Enter your information to create an account
                  </CardDescription>
                  {!testApi && (
                    <p className="text-primary">
                      Wordpress is not connected. This form will not work.
                    </p>
                  )}
                </CardHeader>

                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-2">
                      {/* Username */}
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        type="text"
                        name="username"
                        value={username}
                        placeholder="e.g. paulopinho"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          setUsername(e.target.value);
                          validateUsername(e.target.value);
                        }}
                        required
                      />
                    </div>

                    {/* Email */}
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        placeholder="e.g. paulo.pinho@hireme.now"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          setEmail(e.target.value);
                          validateEmail(e.target.value);
                        }}
                        required
                      />
                    </div>

                    {/* Password */}
                    <div className="grid gap-2">
                      <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                      </div>
                      <div className="relative flex">
                        {password.length > 0 && (
                          <div
                            className={cn(
                              "leading-0 absolute bottom-0 right-3 top-1/2 -translate-y-1/2 text-sm",
                              {
                                "text-red-500":
                                  passwordStrength(password).id === 0,
                                "text-red-300":
                                  passwordStrength(password).id === 1,
                                "text-green-300":
                                  passwordStrength(password).id === 2,
                                "text-green-600":
                                  passwordStrength(password).id === 3,
                              },
                            )}
                          >
                            {passwordStrength(password).value}
                          </div>
                        )}

                        <Input
                          className="w-full pr-20"
                          id="password"
                          type="password"
                          name="password"
                          value={password}
                          placeholder="Type a strong password"
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            setPassword(e.target.value);
                            validatePassword(e.target.value);
                          }}
                          required
                        />
                      </div>
                    </div>

                    {/* Confirm password */}
                    <div className="grid gap-2">
                      <div className="flex items-center">
                        <Label htmlFor="password">Confirm password</Label>
                      </div>

                      <div className="relative flex">
                        {password !== passwordConfirm && (
                          <div
                            className={cn(
                              "leading-0 absolute bottom-0 right-3 top-1/2 -translate-y-1/2 text-sm text-red-500",
                            )}
                          >
                            Not match
                          </div>
                        )}
                        <Input
                          className="w-full pr-20"
                          type="password"
                          id="password-confirm"
                          name="password-confirm"
                          value={passwordConfirm}
                          placeholder="Confirm your password"
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            setPasswordConfirm(e.target.value);
                            validatePasswordConfirm(e.target.value);
                          }}
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      variant="default"
                      className="w-full"
                      onClick={handleRegister}
                      disabled={
                        !testApi ||
                        !isUsernameValid ||
                        !isEmailValid ||
                        !isPasswordValid ||
                        isPasswordConfirmValid ||
                        submitting
                      }
                    >
                      Register
                    </Button>
                  </div>
                </CardContent>

                <CardFooter className="flex-col gap-4">
                  <div className="mt-4 text-center text-sm">
                    Already have an account?{" "}
                    <Link href="/auth/login" className="underline">
                      Login
                    </Link>
                  </div>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      </form>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const testApi = await testAPI();

  return {
    props: {
      testApi,
    },
    revalidate: 10,
  };
};
