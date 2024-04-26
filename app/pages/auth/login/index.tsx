import { ChangeEvent, useState } from "react";
import { GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

import { Alert, AlertDescription } from "@/components/ui/alert";
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

import AsideMenu from "@/components/layout/aside-munu";
import Layout from "@/components/layout";

import background from "./assets/background.jpg";
import { testAPI } from "@/wp-api/api";

interface Props {
  testApi: boolean;
}

export default function Login({ testApi }: Props) {
  const { data: session } = useSession();

  const [username, setUsername] = useState<string>("");
  const [isUsernameValid, setIsUsernameValid] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [sent, setSent] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>("");

  /* FORM VALIDATION */
  const validateUsername = (usernameToValidate: string) => {
    setIsUsernameValid(usernameToValidate.length > 3);
  };
  const validatePassword = (passwordToValidate: string) => {
    setIsPasswordValid(passwordToValidate.length > 8);
  };

  /* LOGIN USER */
  const handleLogin = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");
    try {
      const req = await signIn("credentials", {
        redirect: false,
        username: username,
        password: password,
        callbackUrl: "/dashboard",
      });

      if (req?.ok) {
        setSent(true);
        setUsername("");
        setPassword("");
      } else {
        setFormError(req?.error || "Please try again");
      }
      setSubmitting(false);
    } catch (error: any) {
      setFormError(error);
      setSubmitting(false);
    }
  };

  if (session) {
    return (
      <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
        <div className="flex items-center justify-center py-12">
          <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center">
              <h1 className="text-3xl font-bold">Login</h1>
              <p className="text-balance text-muted-foreground">
                Signed in as {session.user.email}
              </p>
              <button onClick={() => signOut()}>Sign out</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              <div className="text-center">
                <CardHeader>
                  <CardTitle>Login</CardTitle>
                  <CardDescription>
                    {" "}
                    Enter your email below to login to your account.
                  </CardDescription>
                  {testApi ? (
                    <div className="flex">
                      <small>Test user: postlight</small>
                      <small>Test password: postlight</small>
                    </div>
                  ) : (
                    <p className="text-primary">
                      Wordpress is not connected. This form will not work.
                    </p>
                  )}
                </CardHeader>
              </div>

              <CardContent>
                <div className="grid gap-6">
                  {formError && (
                    <Alert variant="destructive">
                      <ExclamationTriangleIcon className="h-4 w-4" />
                      <AlertDescription>{formError}</AlertDescription>
                    </Alert>
                  )}
                  <div className="grid gap-2">
                    <Label htmlFor="email">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      name="username"
                      value={username}
                      placeholder="e.g. postlight"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setUsername(e.target.value);
                        validateUsername(e.target.value);
                      }}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      name="password"
                      value={password}
                      placeholder="e.g. postlight"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setPassword(e.target.value);
                        validatePassword(e.target.value);
                      }}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="default"
                    className="w-full"
                    onClick={handleLogin}
                    disabled={
                      !testApi ||
                      !isUsernameValid ||
                      !isPasswordValid ||
                      submitting
                    }
                  >
                    Login
                  </Button>
                </div>
              </CardContent>

              <CardFooter>
                <div className="mt-4 text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link href="/auth/register" className="underline">
                    Register
                  </Link>
                </div>
              </CardFooter>

              {/*   <div className="text-center text-sm">
                <Link
                  href="/auth/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div> */}
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
