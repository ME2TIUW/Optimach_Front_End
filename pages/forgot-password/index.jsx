import Image from "next/image";
import { Button, Form, InputGroup, Panel, useToaster } from "rsuite";

import EyeCloseIcon from "@rsuite/icons/EyeClose";
import { useEffect, useState, useMemo } from "react";
import { ScriptWithCleanup } from "@/public/hooks/useScript";
import VisibleIcon from "@rsuite/icons/Visible";
import apiAuth from "../api/api_auth";
import { useRouter } from "next/router";
import Messages from "@/components/Messages";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const toaster = useToaster();
  const [visible, setVisible] = useState(false);
  const [finisherHeaderLoaded, setFinisherHeaderLoaded] = useState(false);

  const [credential, setCredential] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [touched, setTouched] = useState({
    username: false,
    password: false,
    confirmPassword: false,
  });

  const handleFinisherHeaderLoad = () => {
    setFinisherHeaderLoaded(true);
  };

  const errorCredential = useMemo(() => {
    let errs = {};
    if (credential.username.length > 0 && credential.username.length < 3) {
      errs.username = "Username must be minimum of 3 characters long";
    }
    if (
      credential.password.length > 0 &&
      (credential.password.length < 5 || credential.password.length > 10)
    ) {
      errs.password = "Invalid password length (5 - 10 characters long)";
    }
    if (
      credential.confirmPassword.length > 0 &&
      credential.password !== credential.confirmPassword
    ) {
      errs.confirmPassword = "Passwords do not match";
    }
    return errs;
  }, [credential]);

  // const handleChangePassword = async () => {
  //   setTouched({ username: true, password: true, confirmPassword: true });

  //   if (
  //     !credential.username ||
  //     !credential.password ||
  //     !credential.confirmPassword
  //   ) {
  //     toaster.push(Messages("error", "Please fill all the required fields"), {
  //       placement: "topCenter",
  //       duration: 2000,
  //     });
  //     return;
  //   }

  //   // Check for validation errors
  //   if (Object.keys(errorCredential).length > 0) {
  //     return;
  //   }

  //   try {
  //     const response = await apiAuth().postCreateUser({
  //       username: credential.username,
  //       password: credential.password,
  //     });

  //     if (response.status === 200) {
  //       toaster.push(
  //         Messages("success", "Change password success! Redirecting..."),
  //         {
  //           placement: "topCenter",
  //           duration: 2000,
  //         }
  //       );
  //       router.push("/login");
  //     }
  //   } catch (error) {
  //     toaster.push(
  //       Messages(
  //         "error",
  //         error.response?.data?.message || "Failed to change password"
  //       ),
  //       {
  //         placement: "topCenter",
  //       }
  //     );
  //   }
  // };

  const handleChangePassword = async () => {
    setTouched({ username: true, password: true, confirmPassword: true });

    if (
      !credential.username ||
      !credential.password ||
      !credential.confirmPassword
    ) {
      toaster.push(Messages("error", "Please fill all the required fields"), {
        placement: "topCenter",
        duration: 2000,
      });
      return;
    }

    if (Object.keys(errorCredential).length > 0) {
      return;
    }

    try {
      const requestPayload = {
        username: credential.username,
        password: credential.password,
      };

      const response = await apiAuth().putUpdatePassword(requestPayload);

      if (response.status === 200) {
        toaster.push(
          Messages("success", "Password updated successfully! Redirecting..."),
          {
            placement: "topCenter",
            duration: 2000,
          }
        );
        router.push("/login");
      } else {
        toaster.push(
          Messages(
            "error",
            response.data?.message || "Something went wrong. Please try again."
          ),
          {
            placement: "topCenter",
            duration: 3000,
          }
        );
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        "Failed to reach the server. Please check your connection.";

      toaster.push(Messages("error", `Update failed: ${errorMsg}`), {
        placement: "topCenter",
        duration: 4000,
      });
    }
  };

  useEffect(() => {
    if (typeof FinisherHeader !== "undefined" && finisherHeaderLoaded) {
      new FinisherHeader({
        count: 30,
        size: { min: 10, max: 20, pulse: 0.15 },
        speed: { x: { min: 0, max: 0.5 }, y: { min: 0, max: 0.2 } },
        colors: {
          background: "#ffffff",
          particles: ["#8ACD1C", "#134B00", "#229100"],
        },
        blending: "lighten",
        opacity: { center: 0.8, edge: 0.2 },
        shapes: ["c"],
      });
    }
  }, [finisherHeaderLoaded]);

  return (
    <>
      <div className="relative w-screen h-screen overflow-hidden bg-white header finisher-header flex items-center justify-center z-0">
        <ScriptWithCleanup
          src="/script/finisher-header.es5.min.js"
          onLoad={handleFinisherHeaderLoad}
        />
        <div className="w-full flex justify-center items-center h-full px-4">
          <Panel
            bordered
            className="p-3 backdrop-blur-3xl shadow-lg rounded-xl bg-white z-10"
            style={{
              borderRadius: "1.1rem",
              background: "#ffffff",
              width: "100%",
              maxWidth: "500px",
              minWidth: "300px",
              boxShadow:
                "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
            }}>
            <div
              className="relative mx-auto aspect-4/1 mb-4"
              style={{ height: "60px" }}>
              <Image
                src="/Optimach_Logo_Long_.png"
                alt="Optimach Logo"
                fill
                priority
                style={{ objectFit: "contain" }}
              />
            </div>
            <p className="mb-4 text-xl md:text-3xl font-bold text-gray-800">
              Forgot Password
            </p>

            <Form fluid style={{ marginTop: "0.8rem" }}>
              {/* Username Field */}
              <Form.Group
                className="mb-4 relative"
                style={{ marginBottom: "25px" }}>
                <Form.ControlLabel className="block text-gray-700 text-sm font-bold mb-2">
                  Username
                </Form.ControlLabel>
                <Form.Control
                  name="name"
                  value={credential.username}
                  onBlur={() => setTouched((p) => ({ ...p, username: true }))}
                  onChange={(value) =>
                    setCredential((p) => ({ ...p, username: value }))
                  }
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                />
                {touched.username &&
                  (errorCredential.username || !credential.username) && (
                    <div
                      className="text-xs italic absolute bottom-[-1.2rem] left-0"
                      style={{ color: "red" }}>
                      {errorCredential.username || "Username cannot be empty"}
                    </div>
                  )}
              </Form.Group>

              {/* Password Field */}
              <Form.Group
                className="mb-2 relative"
                style={{ marginBottom: "25px" }}>
                <Form.ControlLabel className="block text-gray-700 text-sm font-bold items-center">
                  Password
                </Form.ControlLabel>
                <InputGroup inside className="shadow border rounded w-full">
                  <Form.Control
                    name="password"
                    type={visible ? "text" : "password"}
                    value={credential.password}
                    onBlur={() => setTouched((p) => ({ ...p, password: true }))}
                    onChange={(value) =>
                      setCredential((p) => ({ ...p, password: value }))
                    }
                    className="py-2 px-3"
                  />
                  <InputGroup.Button onClick={() => setVisible(!visible)}>
                    {visible ? <VisibleIcon /> : <EyeCloseIcon />}
                  </InputGroup.Button>
                </InputGroup>
                {touched.password &&
                  (errorCredential.password || !credential.password) && (
                    <div
                      className="text-xs italic absolute bottom-[-1.2rem] left-0"
                      style={{ color: "red" }}>
                      {errorCredential.password || "Password cannot be empty"}
                    </div>
                  )}
              </Form.Group>

              {/* Confirm Password Field */}
              <Form.Group
                className="mb-2 relative"
                style={{ marginBottom: "30px" }}>
                <Form.ControlLabel className="block text-gray-700 text-sm font-bold items-center">
                  Confirm Password
                </Form.ControlLabel>
                <InputGroup inside className="shadow border rounded w-full">
                  <Form.Control
                    name="confirmPassword"
                    type={visible ? "text" : "password"}
                    value={credential.confirmPassword}
                    onBlur={() =>
                      setTouched((p) => ({ ...p, confirmPassword: true }))
                    }
                    onChange={(value) =>
                      setCredential((p) => ({ ...p, confirmPassword: value }))
                    }
                    className="py-2 px-3"
                  />
                  <InputGroup.Button onClick={() => setVisible(!visible)}>
                    {visible ? <VisibleIcon /> : <EyeCloseIcon />}
                  </InputGroup.Button>
                </InputGroup>
                {touched.confirmPassword &&
                  (errorCredential.confirmPassword ||
                    !credential.confirmPassword) && (
                    <div
                      className="text-xs italic absolute bottom-[-1.2rem] left-0"
                      style={{ color: "red" }}>
                      {errorCredential.confirmPassword ||
                        "Please confirm your password"}
                    </div>
                  )}
              </Form.Group>

              <Button
                block
                appearance="primary"
                color="green"
                onClick={handleChangePassword}
                className="font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                style={{ marginBottom: "15px", fontWeight: 700 }}>
                Change Password
              </Button>

              <div className="text-center">
                <Link
                  href="/login"
                  style={{
                    fontSize: "0.85rem",
                    color: "#229100",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}>
                  ← Back to Login
                </Link>
              </div>
            </Form>
          </Panel>
        </div>
      </div>
    </>
  );
}
