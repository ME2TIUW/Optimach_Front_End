import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  Button,
  DatePicker,
  Form,
  InputGroup,
  Panel,
  Radio,
  RadioGroup,
  useToaster,
} from "rsuite";

import { ScriptWithCleanup } from "@/public/hooks/useScript";
import ApiUser from "../api/api_user";
import updateNestedObjectProperty from "@/utils/localStorageUtils";
import Messages from "@/components/Messages";
import { calculateAge } from "@/utils/calculateAge";
import { calculateBMI } from "@/utils/calculateBMI";

export default function CredentialForm() {
  const router = useRouter();
  const toaster = useToaster();
  const [userData, setUserData] = useState({});
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [finisherHeaderLoaded, setFinisherHeaderLoaded] = useState(false);
  const emptyCredentialForm = {
    height_cm: "",
    weight_kg: "",
    bmi: "",
    gender: "",
    dob: "",
    age: "",
    updated_By: "",
  };
  const [credential, setCredential] = useState(emptyCredentialForm);

  const [errorCredential, setErrorCredential] = useState(emptyCredentialForm);

  const handleFinisherHeaderLoad = () => {
    console.log("Finisher Header script loaded (callback)");
    setFinisherHeaderLoaded(true);
  };

  const formatDateISO = (date) => {
    if (!date) return null;

    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const handleInsertForm = async () => {
    const requiredFields = [
      "password",
      "height_cm",
      "weight_kg",
      "gender",
      "dob",
    ];

    const errors = {};
    for (const field of requiredFields) {
      if (credential[field] === "" || credential[field] === null) {
        errors[field] = `${field} must be filled!`;
      }
    }

    if (Object.keys(errors).length > 0) {
      setErrorCredential(errors);
      toaster.push(Messages("error", "Please fill all the required fields"), {
        placement: "topCenter",
        duration: 3000,
      });
      return;
    }

    const dobString = formatDateISO(credential.dob);
    const payload = {
      height_cm: parseFloat(credential.height_cm),
      weight_kg: parseFloat(credential.weight_kg),
      have_filled_form: 1,
      bmi: parseFloat(
        calculateBMI(
          parseInt(credential.height_cm),
          parseInt(credential.weight_kg),
          credential.gender,
        ),
      ),
      gender: credential.gender,
      dob: dobString,
      age: parseInt(credential.age),
      updated_By: `${userData.id_user} - ${userData.username}`,
      id_user: userData.id_user,
    };

    try {
      const response = await ApiUser().putUpdateUser(payload);

      if (response?.status === 200) {
        console.log("response = ", response.status);
        toaster.push(Messages("success", "succesfully update form data!"), {
          placement: "topCenter",
          duration: 3000,
        });
        updateNestedObjectProperty("userData", "have_filled_form", 1);
        setCredential(emptyCredentialForm);
        setErrorCredential(emptyCredentialForm);
        setIsSuccessful(true);
        setTimeout(() => {
          router.push("/home");
        }, 3000);
      } else {
        toaster.push(
          Messages(
            "error",
            `Failed to update form : (${response.status}) - ${response.message} `,
          ),
          { placement: "topCenter", duration: 3000 },
        );
      }
    } catch (error) {
      console.error("Error updating form data (API call) ", error);
      toaster.push(Messages("error", `Failed to update form : ${error}`), {
        placement: "topCenter",
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    const calculatedAge = calculateAge(credential.dob);

    if (calculatedAge !== credential.age) {
      setCredential((prevCredential) => ({
        ...prevCredential,
        age: calculatedAge,
      }));
    }
  }, [credential.dob]);

  useEffect(() => {
    if (typeof FinisherHeader !== "undefined") {
      new FinisherHeader({
        count: 20,
        size: {
          min: 10,
          max: 15,
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

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    try {
      if (userData) {
        const parsedUserData = JSON.parse(userData);
        console.log("userData = ", parsedUserData);
        setUserData(parsedUserData);
      } else {
        console.error("user data is not in localStorage");
      }
    } catch (error) {
      console.error("Error fetching user data from localStorage: ", error);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Optimach - Credential Form Page</title>
      </Head>
      <div className="relative w-screen h-screen overflow-hidden">
        <ScriptWithCleanup
          src="/script/finisher-header.es5.min.js"
          onLoad={handleFinisherHeaderLoad}
        />
        {!isSuccessful && (
          <div className="w-full h-full bg-white backdrop-blur-3xl mb-10 header finisher-header items-center justify-center flex flex-col">
            {/* header  */}
            <div className="mb-8">
              <p
                className="text-center text-3xl font-semibold md:text-[3rem]"
                style={{ color: "#229100" }}>
                Let's Get To Know You Better
              </p>
              <p
                className="text-center text-wrap text-sm md:text-[1.2rem]"
                style={{ fontWeight: "500" }}>
                Help Us Suit Your Goal By Filling This Form out!
              </p>
            </div>
            <div className="w-full flex justify-center items-center">
              <Panel
                bordered
                className=" w-[75%] md:w-[45%] p-2 md:p-4 mb-4!  shadow-lg rounded-xl bg-white backdrop-blur-3xl z-10"
                style={{
                  borderRadius: "1.1rem",
                  background: "#ffffff",
                  minHeight: "300px",
                  maxWidth: "500px",
                  minWidth: "300px",
                }}>
                <Form fluid>
                  <Form.Group className="mb-7 relative">
                    {" "}
                    <Form.ControlLabel className="block text-gray-700 text-sm font-bold mb-2">
                      Height (cm)
                    </Form.ControlLabel>
                    <Form.Control
                      name="height_cm"
                      type="number"
                      value={credential.height_cm}
                      onChange={(value) => {
                        setCredential((prevState) => ({
                          ...prevState,
                          height_cm: value,
                        }));
                        setErrorCredential((prevErrors) => ({
                          ...prevErrors,
                          height_cm: undefined,
                        }));
                      }}
                      className="shadow appearance-none border rounded w-full px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    {errorCredential.height_cm && (
                      <div
                        className=" text-xs italic absolute bottom-[-1.3rem] left-0 w-full z-10"
                        style={{ color: "red" }}>
                        {errorCredential.height_cm}
                      </div>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-7 relative">
                    {" "}
                    <Form.ControlLabel className="block text-gray-700 text-sm font-bold mb-2">
                      Weight (kg)
                    </Form.ControlLabel>
                    <InputGroup
                      inside
                      className="shadow appearance-none border rounded w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                      <Form.Control
                        name="weight_kg"
                        type="number"
                        value={credential.weight_kg}
                        onChange={(value) => {
                          setCredential((prevState) => ({
                            ...prevState,
                            weight_kg: value,
                          }));
                          setErrorCredential((prevErrors) => ({
                            ...prevErrors,
                            weight_kg: undefined,
                          }));
                        }}
                        className="py-2 px-3 pr-10"
                      />
                    </InputGroup>
                    {errorCredential.weight_kg && (
                      <div
                        className=" text-xs italic absolute bottom-[-1.3rem] left-0 w-full z-10"
                        style={{ color: "red" }}>
                        {errorCredential.weight_kg}
                      </div>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-7 relative">
                    {" "}
                    <span className="block text-gray-700 text-sm font-bold">
                      Gender
                    </span>
                    <RadioGroup
                      name="gender"
                      inline
                      value={credential.gender}
                      onChange={(value) => {
                        console.log("value = ", value);
                        setCredential((prevState) => ({
                          ...prevState,
                          gender: value,
                        }));
                        setErrorCredential((prevErrors) => ({
                          ...prevErrors,
                          gender: undefined,
                        }));
                      }}>
                      <Radio value="M" color="green">
                        Male
                      </Radio>
                      <Radio value="F" color="green">
                        Female
                      </Radio>
                    </RadioGroup>
                    {errorCredential.gender && (
                      <div
                        className=" text-md absolute bottom-[-1.3rem] left-0 w-full z-10"
                        style={{ color: "red" }}>
                        {errorCredential.gender}
                      </div>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-7 relative">
                    {" "}
                    <span className="block text-gray-700 text-sm font-bold mb-2">
                      Date Of Birth
                    </span>
                    <DatePicker
                      block
                      oneTap
                      value={credential.dob}
                      format="dd-MM-yyyy"
                      shouldDisableDate={(date) => {
                        const today = new Date();
                        return date > today;
                      }}
                      onChange={(value) => {
                        setCredential((prevFormValue) => ({
                          ...prevFormValue,
                          dob: value,
                        }));
                        setErrorCredential((prevErrors) => ({
                          ...prevErrors,
                          dob: undefined,
                        }));
                      }}
                      name="dob"
                    />
                    {errorCredential.dob && (
                      <div
                        className=" text-xs italic absolute bottom-[-1.3rem] left-0 w-full z-10"
                        style={{ color: "red" }}>
                        {errorCredential.dob}
                      </div>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-8 relative">
                    {" "}
                    <Form.ControlLabel className="block text-gray-700 text-sm font-bold mb-2">
                      Age
                    </Form.ControlLabel>
                    <InputGroup
                      disabled
                      inside
                      className="shadow appearance-none border rounded w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                      <Form.Control
                        name="age"
                        value={credential.age}
                        className="py-2 px-3 pr-10"
                      />
                    </InputGroup>
                  </Form.Group>
                  <Button
                    block
                    appearance="primary"
                    color="green"
                    onClick={handleInsertForm}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 my-4 rounded focus:outline-none focus:shadow-outline">
                    <strong>Submit Form</strong>
                  </Button>
                </Form>
              </Panel>
            </div>
          </div>
        )}
      </div>
      {isSuccessful && (
        <div className="relative w-screen h-screen overflow-hidden bg-white blur-xl header finisher-header items-center justify-center flex flex-col">
          <h1 className="text-center" style={{ color: "#229100" }}>
            Login Succesful! Redirecting To Home Page...
          </h1>
        </div>
      )}
    </>
  );
}
