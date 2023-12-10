import React, { useState, useEffect } from "react";
import { pb, authService } from "../services/pocketbase";
import {
  Tabs,
  Tab,
  Input,
  Link,
  Button,
  Card,
  CardBody,
} from "@nextui-org/react";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function AccessPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("login");
  const [email, setEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [checkPasswordMessage, setCheckPasswordMessage] = useState("");
  const [password, setPassword] = useState("");

  const validatePassword = (value) => value.length < 8 && value.length > 0;

  const isInvalidPassword = (val) => {
    return validatePassword(val);
  };

  const isInvalidConfirmPassword = (val) => {
    if (
      val !== registerPassword &&
      val.length > 0 &&
      registerPassword.length >= 8
    ) {
      return true;
    }
  };

  function validateEmail(value) {
    var re = /\S+@\S+\.\S+/;
    return re.test(value) || value.length === 0;
  }

  const isInvalidEmail = (val) => {
    return !validateEmail(val);
  };

  const isButtonDisabled = () => {
    if (selected === "login") {
      return (
        email.length === 0 ||
        password.length === 0 ||
        isInvalidEmail(email) ||
        isInvalidPassword(password)
      );
    } else {
      return (
        registerEmail.length === 0 ||
        registerPassword.length === 0 ||
        registerConfirmPassword.length === 0 ||
        isInvalidEmail(registerEmail) ||
        isInvalidConfirmPassword(registerConfirmPassword) ||
        isInvalidPassword(registerPassword)
      );
    }
  };

  async function access() {
    if (selected === "login") {
      console.log("Try login");
      setIsLoading(true);
      authService
        .login(email, password)
        .then((res) => {
          setIsLoading(false);
          if (res) {
            navigate("/access");
          }
        })
        .catch((err) => {
          setIsLoading(false);
          toast.error("Email o password errate", {
            style: { marginBottom: "12vh" },
          });
        });
    } else {
      console.log("Try sign-up");
      const data = {
        email: registerEmail,
        password: registerPassword,
        passwordConfirm: registerConfirmPassword,
      };

      setIsLoading(true);
      try {
        console.log(data);
        //
        await pb.collection("users").create(data);

        try {
          await pb
            .collection("users")
            .requestVerification("mnlpaglia@gmail.com");
          toast.success("Check your email for the login link", {
            style: { marginBottom: "10vh" },
          });
        } catch (error) {
          toast.error("Qualcosa e andato storto", {
            style: { marginBottom: "10vh" },
          });
        }

        setIsLoading(false);
        setSelected("login");
      } catch (error) {
        console.log(error);
        setIsLoading(false);
        toast.error("Qualcosa e andato storto", {
          style: { marginBottom: "10vh" },
        });
      }
    }
  }

  useEffect(() => {
    if (pb.authStore.isValid) {
      navigate("/table");
    }
  });

  return (
    <div className="flex justify-center items-center h-screen">
      <Toaster position="top-center" reverseOrder={false} />
      <Card className="max-w-full w-[340px] h-[400px]">
        <CardBody className="overflow-hidden">
          <Tabs
            fullWidth
            size="md"
            aria-label="Tabs form"
            selectedKey={selected}
            onSelectionChange={setSelected}
          >
            <Tab key="login" title="Login" className="flex-grow">
              <form className="flex flex-col h-full justify-between">
                <div className="flex flex-col gap-4">
                  <Input
                    isRequired
                    label="Email"
                    isInvalid={isInvalidEmail(email)}
                    placeholder="Enter your email"
                    errorMessage={
                      isInvalidEmail(email)
                        ? "Please enter a valid email"
                        : null
                    }
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Input
                    isRequired
                    label="Password"
                    placeholder="Enter your password"
                    type="password"
                    errorMessage={
                      isInvalidPassword(password)
                        ? "Please enter a valid password"
                        : null
                    }
                    isInvalid={isInvalidPassword(password)}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <p className="text-center text-small">
                    Need to create an account?{" "}
                    <Link size="sm" onPress={() => setSelected("sign-up")}>
                      Sign up
                    </Link>
                  </p>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    fullWidth
                    color="primary"
                    onPress={access}
                    isDisabled={isButtonDisabled()}
                  >
                    Login
                  </Button>
                </div>
              </form>
            </Tab>
            <Tab key="sign-up" title="Sign up" className="flex-grow">
              <form className="flex flex-col h-full justify-between">
                <div className="flex flex-col gap-4">
                  <Input
                    isRequired
                    label="Email"
                    placeholder="Enter your email"
                    isInvalid={isInvalidEmail(registerEmail)}
                    errorMessage={
                      isInvalidEmail(registerEmail)
                        ? "Please enter a valid email"
                        : null
                    }
                    type="email"
                    onChange={(e) => setRegisterEmail(e.target.value)}
                  />
                  <Input
                    isRequired
                    label="Password"
                    placeholder="Enter your password"
                    type="password"
                    errorMessage={
                      isInvalidPassword(registerPassword)
                        ? "Please enter a valid password"
                        : null
                    }
                    isInvalid={isInvalidPassword(registerPassword)}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                  />
                  <Input
                    isDisabled={registerPassword.length < 8}
                    isRequired
                    label="Conferma password"
                    placeholder="Enter your password"
                    errorMessage={
                      isInvalidConfirmPassword(registerConfirmPassword)
                        ? "Le due password non corrispondono"
                        : null
                    }
                    type="password"
                    isInvalid={isInvalidConfirmPassword(
                      registerConfirmPassword
                    )}
                    onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                  />
                  <p className="text-center text-small">
                    Already have an account?{" "}
                    <Link size="sm" onPress={() => setSelected("login")}>
                      Login
                    </Link>
                  </p>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button
                    fullWidth
                    color="primary"
                    onPress={access}
                    isDisabled={isButtonDisabled()}
                  >
                    Sign up
                  </Button>
                </div>
              </form>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
}
