import Image from "next/image";
import { Button, Form, InputGroup, Panel, useToaster } from "rsuite";

import EyeCloseIcon from "@rsuite/icons/EyeClose";
import { useEffect, useState } from "react";
import { ScriptWithCleanup } from "@/public/hooks/useScript";
import VisibleIcon from "@rsuite/icons/Visible";
import apiAuth from "../api/api_auth";
import { useRouter } from "next/router";
import Messages from "@/components/Messages";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const toaster = useToaster();
  const [visible, setVisible] = useState(false);
  const [finisherHeaderLoaded, setFinisherHeaderLoaded] = useState(false);
  const [credential, setCredential] = useState({
    username: "",
    password: "",
  });

  const [errorCredential, setErrorCredential] = useState({
    username: "",
    password: "",
  });

  const handleFinisherHeaderLoad = () => {
    console.log("Finisher Header script loaded (callback)");
    setFinisherHeaderLoaded(true);
  };

  const handleLogin = async () => {
    const requiredFields = ["username", "password"];
    let formErrors = {};

    for (const field of requiredFields) {
      if (credential[field] === "" || typeof credential[field] !== "string") {
        formErrors[field] = `${field} cannot be empty`;
        console.log("empty field", field);
      }
    }

    if (Object.keys(formErrors).length > 0) {
      setErrorCredential(formErrors);

      toaster.push(Messages("error", "Please fill all the required fields"), {
        placement: "topCenter",
        duration: 2000,
      });
      formErrors = {};
      return;
    }

    const requestPayload = {
      username: credential.username,
      password: credential.password,
    };

    try {
      const response = await apiAuth().postLoginUser(requestPayload);

      if (response.status === 200) {
        if (response.data.status === 200) {
          toaster.push(Messages("success", "login success!"), {
            placement: "topCenter",
            duration: 2000,
          });
          localStorage.setItem("accessToken", response.data.access_token);
          localStorage.setItem("refreshToken", response.data.refresh_token);
          localStorage.setItem(
            "userData",
            JSON.stringify({
              id_user: response.data.credential.id_user,
              username: response.data.credential.username,
              have_filled_form: response.data.credential.have_filled_form,
              is_admin: response.data.credential.is_admin,
              is_active: response.data.credential.is_active,
            }),
          );

          const data = localStorage.getItem("userData");
          if (data) {
            const parsed = JSON.parse(data);
            if (parsed.have_filled_form === 0) router.push("/form");
            router.push("/home");
          }
        }
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      const statusCode = error.response?.status;

      console.error(`Error ${statusCode}: ${errorMessage}`);

      toaster.push(Messages("error", `Login failed: ${errorMessage}`), {
        placement: "topCenter",
        duration: 2000,
      });
      setCredential({
        username: "",
        password: "",
      });
      setErrorCredential({
        username: "",
        password: "",
      });
    }
  };

  useEffect(() => {
    if (typeof FinisherHeader !== "undefined") {
      new FinisherHeader({
        count: 30,
        size: {
          min: 10,
          max: 20,
          pulse: 0.15,
        },
        speed: {
          x: {
            min: 0,
            max: 0.5,
          },
          y: {
            min: 0,
            max: 0.2,
          },
        },
        colors: {
          background: "#ffffff",
          particles: ["#8ACD1C", "#134B00", "#229100"],
        },
        blending: "lighten",
        opacity: {
          center: 0.8,
          edge: 0.2,
        },
        shapes: ["c"],
      });
    } else {
      console.warn(
        "FinisherHeader library not found. Make sure the script is loaded.",
      );
    }
  }, [finisherHeaderLoaded]);

  return (
    <>
      <div className="relative w-screen h-screen overflow-hidden bg-white header finisher-header flex items-center justify-center z-0">
        <ScriptWithCleanup
          src="/script/finisher-header.es5.min.js"
          onLoad={handleFinisherHeaderLoad}
        />
        <div className="w-full flex justify-center items-center h-full">
          <Panel
            bordered
            className="w-[45%] p-3 backdrop-blur-3xl shadow-lg rounded-xl bg-white z-10"
            style={{
              borderRadius: "1.1rem",
              background: "#ffffff",
              maxHeight: "500px",
              minHeight: "300px",
              maxWidth: "500px",
              minWidth: "300px",
            }}>
            <div className="relative mx-auto aspect-4/1 mb-4">
              <Image
                src="/Optimach_Logo_Long_.png"
                alt="Optimach Logo Short Version"
                fill
                priority
                style={{ objectFit: "contain" }}
              />
            </div>
            <p className="mb-4 text-xl md:text-4xl font-bold text-gray-800">
              Login
            </p>
            <Form fluid style={{ marginTop: "0.8rem", marginBottom: "0.8rem" }}>
              <Form.Group className="mb-4 relative">
                <Form.ControlLabel className="block text-gray-700 text-sm font-bold mb-2">
                  Username
                </Form.ControlLabel>
                <Form.Control
                  name="name"
                  value={credential.username}
                  onChange={(value) => {
                    setCredential((prevState) => ({
                      ...prevState,
                      username: value,
                    }));

                    setErrorCredential((prevErrors) => ({
                      ...prevErrors,
                      username: undefined,
                    }));
                  }}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {errorCredential.username && (
                  <p
                    className="text-xs text-red-600 italic absolute left-0 w-full z-10"
                    style={{ color: "red" }}>
                    {errorCredential.username}
                  </p>
                )}
              </Form.Group>
              <Form.Group className="mb-2 relative">
                <Form.ControlLabel className="block text-gray-700 text-sm font-bold ">
                  Password
                </Form.ControlLabel>
                <InputGroup
                  inside
                  className="shadow appearance-none border rounded w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                  <Form.Control
                    name="password"
                    type={visible ? "text" : "password"}
                    value={credential.password}
                    onChange={(value) => {
                      setCredential((prevState) => ({
                        ...prevState,
                        password: value,
                      }));

                      setErrorCredential((prevErrors) => ({
                        ...prevErrors,
                        password: undefined,
                      }));
                    }}
                    className="py-2 px-3 pr-10"
                  />

                  <InputGroup.Button
                    onClick={() => setVisible(!visible)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-3 rounded-r focus:outline-none focus:shadow-outline cursor-pointer">
                    {visible ? <VisibleIcon /> : <EyeCloseIcon />}
                  </InputGroup.Button>
                </InputGroup>
                {errorCredential.password && (
                  <p className="text-xs text-red-600 italic absolute  left-0 w-full z-10">
                    {errorCredential.password}
                  </p>
                )}
                <div className="flex flex-row justify-end mt-1.5 text-[0.8rem]">
                  <Link href="/forgot-password">Forgot Password?</Link>
                </div>
              </Form.Group>

              <Button
                block
                appearance="primary"
                color="green"
                onClick={handleLogin}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2">
                <strong>Login</strong>
              </Button>
              <div className="flex  gap-0.5 items-center mt-4 text-[0.8rem]">
                <p>Don't Have an Account?</p>
                <Link href="/register">Register Here</Link>
              </div>
            </Form>
          </Panel>
        </div>
      </div>
    </>
  );
}
