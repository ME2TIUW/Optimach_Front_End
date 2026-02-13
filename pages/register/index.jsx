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

export default function RegisterPage() {
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

  const handleRegister = async () => {
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
    } else if (credential.username.length < 3) {
      toaster.push(
        Messages("error", "Usename must be minimum of 3 characters long"),
        {
          placement: "topCenter",
          duration: 2000,
        }
      );
      return;
    } else if (credential.password.length < 5) {
      toaster.push(
        Messages("error", "Password must be minimum of 5 characters long"),
        {
          placement: "topCenter",
          duration: 2000,
        }
      );
      return;
    }

    const requestPayload = {
      username: credential.username,
      password: credential.password,
    };

    try {
      const response = await apiAuth().postCreateUser(requestPayload);

      if (response.status === 200) {
        if (response.data.status === 200) {
          toaster.push(
            Messages(
              "success",
              "register success! Redirecting you to login page"
            ),
            {
              placement: "topCenter",
              duration: 2000,
            }
          );
          router.push("/login");
        } else {
          console.error("API Error Response:", error.response.data);
          toaster.push(
            Messages("error", `register failed: ${error.response.message}`),
            {
              placement: "topCenter",
              duration: 2000,
            }
          );
          setErrorCredential({ username: "", password: "" });
        }
      } else {
        console.error(
          "Login API returned non-200 HTTP status:",
          response.data.status
        );
        toaster.push(
          Messages("error", `Login failed : ${error.response?.message}`),
          {
            placement: "topCenter",
            duration: 2000,
          }
        );
        setErrorCredential({ username: "", password: "" });
      }
    } catch (error) {
      toaster.push(Messages("error", `${error.response?.data?.message}`), {
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
        "FinisherHeader library not found. Make sure the script is loaded."
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
              Register
            </p>
            <Form fluid style={{ marginTop: "0.8rem" }}>
              <Form.Group className="mb-4 relative">
                <Form.ControlLabel className="block text-gray-700 text-sm font-bold mb-2">
                  Username <strong>(min. 3 characters)</strong>
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
                  <div
                    className=" text-xs italic absolute bottom-[-1.3rem] left-0 w-full z-10"
                    style={{ color: "red" }}>
                    {errorCredential.username}
                  </div>
                )}
              </Form.Group>
              <Form.Group className="mb-2 relative">
                <Form.ControlLabel className="block text-gray-700 text-sm font-bold items-center">
                  Password <strong>(min. 5 characters)</strong>
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
                  <div
                    className=" text-xs italic absolute bottom-[-1.3rem] left-0 w-full z-10"
                    style={{ color: "red" }}>
                    {errorCredential.password}
                  </div>
                )}
              </Form.Group>

              <Button
                block
                appearance="primary"
                color="green"
                onClick={handleRegister}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                style={{ marginBottom: "20px" }}>
                <strong>Register</strong>
              </Button>
              <div
                className=" flex gap-0.5 items-center text-[0.8rem]"
                style={{ top: errorCredential.password ? "5rem" : "4rem" }}>
                <p>Already Have an Account?</p>
                <Link href="/login">Login Here</Link>
              </div>
            </Form>
          </Panel>
        </div>
      </div>
    </>
  );
}
