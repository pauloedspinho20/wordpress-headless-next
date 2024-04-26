import { ChangeEvent, useState } from "react";
import { GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { passwordStrength } from "check-password-strength";
import { useSession, signIn, signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";
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
import { Progress } from "@/components/ui/progress";

import AsideMenu from "@/components/layout/aside-munu";
import Layout from "@/components/layout";

import background from "./assets/background.jpg";
import { testAPI } from "@/wp-api/api";

const passwordStrengthOptions = [
  {
    id: 0,
    value: "Too weak",
    minDiversity: 0,
    minLength: 8,
  },
  {
    id: 1,
    value: "Weak",
    minDiversity: 1,
    minLength: 10,
  },
  {
    id: 2,
    value: "Medium",
    minDiversity: 2,
    minLength: 10,
  },
  {
    id: 3,
    value: "Strong",
    minDiversity: 3,
    minLength: 12,
  },
];
interface Props {
  testApi: boolean;
}

export default function Signup({ testApi }: Props) {
  const [firstName, setFirstName] = useState<string>("");
  const [isFirstNameValid, setIsFirstNameValid] = useState<boolean>(false);
  const [lastName, setLastName] = useState<string>("");
  const [isLastNameValid, setIsLastNameValid] = useState<boolean>(false);
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
  const validateFirstName = (firstNameToValidate: string) => {
    setIsPasswordValid(firstNameToValidate.length > 0);
  };
  const validateLastName = (lastNameToValidate: string) => {
    setIsPasswordValid(lastNameToValidate.length > 0);
  };
  const validateEmail = (emailToValidate: string) => {
    setIsEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailToValidate));
  };
  const validatePassword = (passwordToValidate: string) => {
    setIsPasswordValid(passwordToValidate.length > 8);
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
      const req = await signIn("credentials", {
        /* redirect: false, */
        email: email,
        password: password,
        callbackUrl: "/dashboard",
      });

      if (req?.ok) {
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setSent(true);
      } else {
        setFormError(req?.error || "Please try again");
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
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      {/* First name */}
                      <Label htmlFor="first-name">First name</Label>
                      <Input
                        id="first-name"
                        type="text"
                        name="first-name"
                        value={firstName}
                        placeholder="e.g. Paulo"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          setFirstName(e.target.value);
                          validateFirstName(e.target.value);
                        }}
                        required
                      />
                    </div>
                    {/* Last name */}
                    <div className="grid gap-2">
                      <Label htmlFor="last-name">Last name</Label>
                      <Input
                        id="last-name"
                        type="text"
                        name="last-name"
                        value={lastName}
                        placeholder="e.g. Pinho"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          setLastName(e.target.value);
                          validateLastName(e.target.value);
                        }}
                        required
                      />
                    </div>
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
                    <Input
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

                  {/* Confirm password */}
                  {isPasswordValid && (
                    <div className="grid gap-2">
                      <div className="flex items-center">
                        <Label htmlFor="password">Confirm password</Label>
                      </div>
                      <Input
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
                  )}
                  <Button
                    type="submit"
                    variant="default"
                    className="w-full"
                    onClick={handleRegister}
                    disabled={
                      !testApi ||
                      !isFirstNameValid ||
                      !isLastNameValid ||
                      !isEmailValid ||
                      !isPasswordValid ||
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
                  <Link href="/login" className="underline">
                    Login
                  </Link>
                </div>
              </CardFooter>
            </Card>
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
