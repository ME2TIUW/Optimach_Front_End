import SideBar from "@/components/SideBar";
import { useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  InputGroup,
  Modal,
  Panel,
  Radio,
  RadioGroup,
  Stack,
  useToaster,
} from "rsuite";
import ApiUser from "../api/api_user";
import Messages from "@/components/Messages";
import Heading from "@/components/Heading";
import { calculateBMI } from "@/utils/calculateBMI";
import { calculateAge } from "@/utils/calculateAge";
import EditIcon from "@rsuite/icons/Edit";
import HamburgerButton from "@/components/HamburgerButton";

export default function ProfilePage() {
  const toaster = useToaster();
  const [userData, setUserData] = useState({});
  const [userDataForm, setUserDataForm] = useState({});
  const [errorUserDataForm, setErrorUserDataForm] = useState({});
  const [expanded, setExpanded] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const formatDateISO = (date) => {
    if (!date) return null;

    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const handleEditUserProfile = async () => {
    const requiredFields = [
      "username",
      "height_cm",
      "weight_kg",
      "gender",
      "dob",
      "age",
    ];

    const errors = {};
    for (const field of requiredFields) {
      if (userDataForm[field] === "" || userDataForm[field] === null) {
        errors[field] = `${field} must be filled!`;
      }
    }

    if (Object.keys(errors).length > 0) {
      setErrorUserDataForm(errors);
      toaster.push(Messages("error", "Please Fill the required fields!"), {
        placement: "topCenter",
        duration: 3000,
      });
      return;
    }
    const dobString = formatDateISO(userDataForm.dob);
    try {
      const payload = {
        username: userDataForm.username,
        height_cm: parseFloat(userDataForm.height_cm),
        weight_kg: parseFloat(userDataForm.weight_kg),
        have_filled_form: 1,
        bmi: parseFloat(
          calculateBMI(
            parseInt(userDataForm.height_cm),
            parseInt(userDataForm.weight_kg),
            userDataForm.gender
          )
        ),
        gender: userDataForm.gender,
        dob: dobString,
        age: parseInt(userDataForm.age),
        updated_By: `${userDataForm.id_user} - ${userDataForm.username}`,
        id_user: userDataForm.id_user,
      };
      const res = await ApiUser().putUpdateUser(payload);
      if (res.status === 200) {
        toaster.push(
          Messages("success", "User profile updated successfully!"),
          {
            placement: "topCenter",
            duration: 3000,
          }
        );
        setEditModalOpen(false);
        handleGetUserDetailData(userData.id_user);
      } else {
        toaster.push(Messages("error", "Failed to update user profile."), {
          placement: "topCenter",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
      toaster.push(Messages("error", "An error occurred while updating."), {
        placement: "topCenter",
        duration: 3000,
      });
    }
  };

  const BMI_classification = (bmi) => {
    const bmiValue = parseFloat(bmi);

    if (isNaN(bmiValue) || bmiValue <= 0) {
      return "N/A";
    }

    if (bmiValue < 18.5) {
      return "Underweight";
    } else if (bmiValue >= 18.5 && bmiValue <= 24.9) {
      return "Normal / Healthy Weight";
    } else if (bmiValue >= 25 && bmiValue <= 29.9) {
      return "Overweight";
    } else if (bmiValue >= 30 && bmiValue <= 34.9) {
      return "Obese (Class 1)";
    } else if (bmiValue >= 35 && bmiValue <= 39.9) {
      return "Obese (Class 2)";
    } else {
      return "Obese (Class 3)";
    }
  };

  const handleGetUserDetailData = async (id_user) => {
    const payload = { id_user: parseInt(id_user) };

    console.log("payload = ", payload);
    try {
      const res = await ApiUser().postGetDetailUser(payload);

      if (res?.status === 200) {
        console.log("User detail data fetched successfully:", res.data);
        setUserData((data) => {
          return { ...data, ...res.data };
        });
      }
    } catch (error) {
      console.error("Error fetching user detail data:", error);
    }
  };

  useEffect(() => {
    const calculatedAge = calculateAge(userDataForm.dob);

    if (calculatedAge !== userDataForm.age) {
      setUserDataForm((prevUserDataForm) => ({
        ...prevUserDataForm,
        age: calculatedAge,
      }));
    }
  }, [userDataForm.dob]);

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    try {
      if (userData) {
        const parsedUserData = JSON.parse(userData);
        console.log("userData = ", parsedUserData);
        setUserData(parsedUserData);
        handleGetUserDetailData(parsedUserData?.id_user);
      } else {
        console.error("user data is not in localStorage");
      }
    } catch (error) {
      console.error("Error fetching user data from localStorage : ", error);
    }
  }, []);

  return (
    <div className="h-screen w-screen flex  gap-[0.8rem]">
      {!expanded && <HamburgerButton setSidebarExpanded={setExpanded} />}
      <SideBar expanded={expanded} setExpanded={setExpanded} />
      <div
        className="flex-1 overflow-y-scroll"
        style={{
          margin: "20px",
        }}>
        <div className="sticky top-0 z-30 bg-white pt-2 pb-2 md:static md:bg-transparent">
          <Heading Header={"Profile"} />
        </div>
        <Panel
          bordered
          shaded
          className="w-full min-h-[40%] p-4 mt-4 flex flex-col justify-center">
          <div className="w-full flex flex-col md:flex-row gap-4 items-stretch flex-1 ">
            <Panel
              bordered
              className="flex-3  p-4"
              header={
                <Stack
                  spacing={10}
                  justifyContent="space-between"
                  style={{ flexWrap: "wrap" }}>
                  <p className="text-lg md:text-xl">User Info</p>
                  <Button
                    appearance="primary"
                    color="green"
                    onClick={() => {
                      const isoDateString = userData?.dob;
                      const dateObject1 = new Date(isoDateString);
                      setUserDataForm(userData);
                      setEditModalOpen(true);
                    }}>
                    <EditIcon />
                  </Button>
                </Stack>
              }>
              <Form fluid>
                <Form.Group controlId="name">
                  <Form.ControlLabel>Username</Form.ControlLabel>
                  <Form.Control
                    name="name"
                    value={userData?.username}
                    readOnly
                  />
                </Form.Group>
                <Form.Group controlId="gender">
                  <Form.ControlLabel>Gender</Form.ControlLabel>
                  <Form.Control
                    name="gender"
                    readOnly
                    value={userData?.gender === "M" ? "Male" : "Female"}
                  />
                </Form.Group>
                <Form.Group controlId="dob">
                  <Form.ControlLabel>DOB</Form.ControlLabel>
                  <Form.Control
                    name="dob"
                    value={userData?.dob?.split("T")[0]}
                    readOnly
                  />
                </Form.Group>
                <Form.Group controlId="age">
                  <Form.ControlLabel>Age</Form.ControlLabel>
                  <Form.Control name="age" value={userData?.age} readOnly />
                </Form.Group>
                <Form.Group controlId="weight_kg">
                  <Form.ControlLabel>Weight (kg)</Form.ControlLabel>
                  <Form.Control
                    name="weight_kg"
                    value={userData?.weight_kg}
                    readOnly
                  />
                </Form.Group>
                <Form.Group controlId="height_cm">
                  <Form.ControlLabel>Weight (kg)</Form.ControlLabel>
                  <Form.Control
                    name="height_cm"
                    value={userData?.height_cm}
                    readOnly
                  />
                </Form.Group>
              </Form>
            </Panel>
            <Panel bordered className="flex-4">
              <Panel bordered>
                <p className="text-xl font-semibold mb-2">
                  Based on Your Height of{" "}
                </p>
                <p className="text-[2rem] text-[#1F8300] font-semibold">
                  {userData?.height_cm} cm
                </p>{" "}
                <p className="text-xl font-semibold mb-2">and BMI of </p>
                <p className="text-[2rem] text-[#1F8300] font-semibold">
                  {userData?.bmi}
                </p>
                <p className="text-xl mt-4 font-semibold">
                  You Are Classified As
                </p>
                <p className="text-[2rem] text-[#1F8300] font-semibold underline">
                  {BMI_classification(userData?.bmi)}
                </p>
              </Panel>
            </Panel>
          </div>
        </Panel>
      </div>

      <Modal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setErrorUserDataForm({});
        }}>
        <Modal.Header>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid>
            <Form.Group controlId="name">
              <Form.ControlLabel>Username</Form.ControlLabel>
              <Form.Control
                name="name"
                type="text"
                value={userDataForm?.username}
                onChange={(value) => {
                  setUserDataForm((prevState) => ({
                    ...prevState,
                    username: value,
                  }));
                  setErrorUserDataForm((prevErrors) => ({
                    ...prevErrors,
                    username: undefined,
                  }));
                }}
              />
              {errorUserDataForm?.username && (
                <div
                  className=" text-xs italic absolute bottom-[-1.3rem] left-0 w-full z-10"
                  style={{ color: "red" }}>
                  {errorUserDataForm.username}
                </div>
              )}
            </Form.Group>
            <Form.Group className="mb-7 relative">
              {" "}
              <span className="block text-gray-700 text-sm font-bold mb-2">
                Gender
              </span>
              <RadioGroup
                name="gender"
                inline
                value={userDataForm?.gender}
                onChange={(value) => {
                  setUserDataForm((prevState) => ({
                    ...prevState,
                    gender: value,
                  }));
                  setErrorUserDataForm((prevErrors) => ({
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
              {errorUserDataForm.gender && (
                <div
                  className=" text-xs italic absolute bottom-[-1.3rem] left-0 w-full z-10"
                  style={{ color: "red" }}>
                  {errorUserDataForm.gender}
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
                value={new Date(userDataForm?.dob)}
                format="dd-MM-yyyy"
                shouldDisableDate={(date) => {
                  const today = new Date();
                  return date > today;
                }}
                onChange={(value) => {
                  setUserDataForm((prevFormValue) => ({
                    ...prevFormValue,
                    dob: value,
                  }));
                  setErrorUserDataForm((prevErrors) => ({
                    ...prevErrors,
                    dob: undefined,
                  }));
                }}
                name="dob"
              />
              {errorUserDataForm.dob && (
                <div
                  className=" text-xs italic absolute bottom-[-1.3rem] left-0 w-full z-10"
                  style={{ color: "red" }}>
                  {errorUserDataForm.dob}
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
                  value={userDataForm?.age}
                  className="py-2 px-3 pr-10"
                />
              </InputGroup>
              {errorUserDataForm.age && (
                <div
                  className=" text-xs italic absolute bottom-[-1.3rem] left-0 w-full z-10"
                  style={{ color: "red" }}>
                  {errorUserDataForm.age}
                </div>
              )}
            </Form.Group>
            <Form.Group controlId="weight_kg">
              <Form.ControlLabel>Weight (kg)</Form.ControlLabel>
              <Form.Control
                name="weight_kg"
                type="number"
                value={userDataForm?.weight_kg}
                onChange={(value) => {
                  setUserDataForm((prevState) => ({
                    ...prevState,
                    weight_kg: value,
                  }));
                  setErrorUserDataForm((prevErrors) => ({
                    ...prevErrors,
                    weight_kg: undefined,
                  }));
                }}
              />
              {errorUserDataForm?.weight_kg && (
                <div
                  className=" text-xs italic absolute bottom-[-1.3rem] left-0 w-full z-10"
                  style={{ color: "red" }}>
                  {errorUserDataForm.weight_kg}
                </div>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              handleEditUserProfile();
            }}
            appearance="primary"
            color="green">
            Save
          </Button>
          <Button
            onClick={() => {
              setEditModalOpen(false);
              setErrorUserDataForm({});
            }}
            appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
