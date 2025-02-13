import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useRef, memo } from "react";
import { Button, TextInput, Alert, Spinner } from "flowbite-react";

import { MdModeEditOutline } from "react-icons/md";
import { HiInformationCircle } from "react-icons/hi";
import { IoWarning, IoTrashSharp } from "react-icons/io5";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";

import * as yup from "yup";
import { useFormik } from "formik";

import checkIcon from "../assets/images/check.png";

import MUIbtn from "@mui/material/Button";
import Accordion from "@mui/material/Accordion";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";

import {
  getDownloadURL,
  ref,
  getStorage,
  uploadBytesResumable,
} from "firebase/storage";

import { app } from "../utils/firebase.js";
import { updateUser, deleteUser } from "../store/userSlice.js";

const Profile = () => {
  const dispatch = useDispatch();
  const { currentUser, status } = useSelector((state) => state.user);

  const [showPassword, setShowPassword] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageUploadingProgress, setImageUploadingProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileURL, setImageFileURL] = useState(null);
  const [formSuccessMessage, setFormSuccessMessage] = useState(null);
  const [formErrorMessage, setFormErrorMessage] = useState(null);
  const [deleteAccountEmail, setDeleteAccountEmail] = useState(null);
  const [deleteAccountPopup, setDeleteAccountPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const timerRef = useRef(null);
  const location = useLocation();

  const filePickerRef = useRef();

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const handleDeleteAccountEmail = (e) => setDeleteAccountEmail(e.target.value);

  const handleImageChange = (e) => {
    setImageFileUploadError(null);
    setImageFile(null);
    setImageFileURL(null);
    const file = e.target.files[0];
    try {
      if (file?.type.includes("image/")) {
        if (file.size < 2097152) {
          //  Greater than 2MB
          setImageFile(file);
          setImageFileURL(URL.createObjectURL(file));
          updateUserFormik.setFieldValue(
            "profilePhoto",
            URL.createObjectURL(file)
          );
          updateUserFormik.setFieldTouched("profilePhoto", true, true);
        } else setImageFileUploadError("Failure. Image must be less than 2MB!");
      } else setImageFileUploadError("Failure. File type must be an image!");
    } catch (e) {
      return;
    }
  };

  const uploadImage = async () => {
    if (!navigator.onLine) return;

    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile?.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    const uploadPromise = new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadingProgress(progress.toFixed(0));
        },
        (error) => {
          setImageFileUploadError("Could not upload image. Please try again!");
          reject(error);
        },
        async () => {
          try {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            setImageFileURL(url);
            resolve(url);
          } catch (error) {
            setImageFileUploadError("Could not retrieve download URL.");
            reject(error);
          }
        }
      );
    });

    return await uploadPromise;
  };

  const schema = yup.object().shape({
    username: yup.string().required().trim(),
    profilePhoto: yup.mixed(),
    full_name: yup
      .string()
      .required("Name is required")
      .min(3, "Name must be at least 3 characters!")
      .max(24, "Name is too long!")
      .matches(/^[a-zA-Z\s]+$/, "Invalid name!")
      .trim(),
    password: yup
      .string()
      .trim()
      .min(7, "Password must be at least 7 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{7,}$/,
        "Password must contain at least one uppercase, lowercase, special character and number!"
      ),
    confirmPassword: yup
      .string()
      .test("passwords-match", "Passwords must match", function (value) {
        return value === this.parent.password;
      }),
  });

  const updateUserFormik = useFormik({
    initialValues: {
      username: currentUser?.userData?.username ?? null,
      full_name: currentUser?.userData?.full_name,
      email: currentUser?.userData?.email,
      profilePhoto: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: schema,
    onSubmit: async (values, { resetForm }) => {
      console.log(values);
      try {
        setFormErrorMessage("");
        setFormSuccessMessage("");
        document.querySelectorAll("input").forEach((element) => element.blur());
        let userData = {
          id: currentUser.userData._id,
          ...(username && { username: values.username }),
          ...(values.full_name && { full_name: values.full_name }),
          ...(values.password && { password: values.password }),
        };
        if (imageFile) {
          const firebaseUpload = await uploadImage();
          if (firebaseUpload) {
            userData = {
              ...userData,
              profilePhoto: firebaseUpload,
            };
            setImageFile(null);
          } else {
            throw new Error("Image upload failed!");
          }
        }
        const data = await dispatch(updateUser(userData));
        if (data.error?.message) {
          setFormErrorMessage(data.error.message);
        } else {
          setFormSuccessMessage(data.payload.message);
          resetForm();
        }
      } catch (error) {
        console.error(error);
        setFormErrorMessage(
          "Failed! Internet connection error, please try again."
        );
      }
    },
  });

  const handleDeleteUserAccount = async () => {
    const userId = currentUser.userData._id;
    dispatch(deleteUser(userId));
  };

  const handleUsernameChange = (e) => {
    let value = e.target.value.trim(); // Trim spaces
    let currentError = null; // Track current error locally

    // Reset error and loading states
    setError(null);
    setSuccess(false);
    setLoading(false);

    // Clear previous timeout if it exists
    if (timerRef.current) clearTimeout(timerRef.current);

    // Validate username
    if (!value) {
      currentError = "Username is required!";
    } else if (value.length < 5) {
      currentError = "Username must be at least 5 characters long!";
    } else if (value.length > 24) {
      currentError = "Username must be no longer than 24 characters!";
    } else if (!/^[a-z0-9]+$/.test(value)) {
      currentError = "Username must be in lowercase!";
    } else if (!/^(?=(.*[a-zA-Z]){3,})[a-zA-Z0-9]+$/.test(value)) {
      currentError = "Invalid username!";
    }

    // Set error if any validation fails
    if (currentError) {
      setError(currentError);
      return;
    }

    // If no errors, proceed with the API call (debounced)
    timerRef.current = setTimeout(async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/user/checkUsername/${value}`);
        const data = await res.json();

        if (res.status === 200) {
          setError(null);
          setSuccess(true);
        } else {
          setError(data?.message || "Username is unavailable");
          setSuccess(false);
        }
      } catch (err) {
        setError("An error occurred while checking the username");
        setSuccess(false);
      } finally {
        setLoading(false)
      }
    }, 1000);

    // Update the Formik field value
    updateUserFormik.setFieldValue("username", value);
  };

  useEffect(() => {
    if (location.state?.username === "username") {
      document.getElementById("username").focus();
    }
  }, [location]);

  return (
    <>
      {deleteAccountPopup && (
        <section className="w-screen h-screen max-h-screen bg-black bg-opacity-65 fixed top-0 left-0 z-50 FlexCenter ">
          <article className="w-[90vw] xl:w-[40vw] 2xl:w-[30vw] bg-[#262630] p-10 z-40 flex flex-col gap-3">
            <h3 className="text-base text-[#FF4040] font-medium">
              Are you sure, You want to delete your account?
            </h3>
            <Alert color="warning" icon={HiInformationCircle}>
              <span className="font-medium">Note!</span> This change is
              irreversible.
            </Alert>
            <div className="w-full flex items-center gap-[5%] mt-10">
              <MUIbtn
                variant="contained"
                color="error"
                type="button"
                disabled={deleteAccountEmail !== currentUser.userData.email}
                onClick={handleDeleteUserAccount}
                className="flex items-center justify-center gap-1"
              >
                {status === "loading" ? (
                  <Spinner aria-label="Default status example" />
                ) : (
                  <>
                    {" "}
                    CONFIRM <IoTrashSharp size={15} />{" "}
                  </>
                )}
              </MUIbtn>
              <MUIbtn
                variant="contained"
                type="button"
                color="primary"
                onClick={() => setDeleteAccountPopup(false)}
              >
                Cancel
              </MUIbtn>
            </div>
          </article>
        </section>
      )}
      <div className="min-h-[120vh] w-full xl:p-20 flex flex-col gap-10 items-center justify-start py-10 xl:py-10">
        <h2 className="text-4xl font-semibold md:mb-0"> Profile. </h2>

        <form
          onSubmit={updateUserFormik.handleSubmit}
          className="w-[90vw] md:w-full h-full flex gap-5 flex-col items-center justify-center"
        >
          <input
            name="profilePhoto"
            type="file"
            accept="image/*"
            multiple={false}
            ref={filePickerRef}
            onChange={handleImageChange}
            hidden
          />
          <picture className="w-44 h-44 rounded-full border-4 border-teal-500 relative">
            <img
              src={imageFileURL ?? currentUser.userData.profilePhoto}
              alt="profile_picture"
              className={`w-full h-full object-cover rounded-full transition ease-in-out duration-200 
                ${
                  imageUploadingProgress &&
                  imageUploadingProgress < 100 &&
                  "opacity-40 cursor-not-allowed"
                }
                ${
                  (updateUserFormik.isSubmitting ||
                    status === "loading") &&
                  "opacity-40 cursor-not-allowed"
                }
              `}
              loading="lazy"
            />
            <MdModeEditOutline
              className="absolute -bottom-1 -right-5 hover:bg-[#ececec62] rounded-full w-9 h-9 p-2 transition ease-in-out duration-200 cursor-pointer"
              onClick={() => filePickerRef.current.click()}
            />
          </picture>
          {updateUserFormik.touched.profilePhoto &&
            updateUserFormik.errors.profilePhoto && (
              <p className="mt-1 text-xs text-red-600">
                {updateUserFormik.errors.profilePhoto}
              </p>
            )}

          {imageFileUploadError && (
            <Alert color="red">
              <p className="text-red-600">{imageFileUploadError}</p>
            </Alert>
          )}
          <div className="w-full md:w-fit">
            <label htmlFor="full_name" className="text-sm">
              {" "}
              Full Name{" "}
            </label>
            <TextInput
              id="full_name"
              name="full_name"
              type="text"
              className="w-full md:w-[30rem]"
              defaultValue={currentUser.userData.full_name}
              onBlur={updateUserFormik.handleBlur}
              onChange={updateUserFormik.handleChange}
            />
            {updateUserFormik.touched.full_name &&
              updateUserFormik.errors.full_name && (
                <p className="flex items-center gap-1 mt-1 text-xs text-red-600">
                  <IoWarning size={15} /> {updateUserFormik.errors.full_name}
                </p>
              )}
          </div>
          <div className="w-full md:w-fit">
            <label htmlFor="username" className="text-sm">
              {" "}
              Username{" "}
            </label>
            <div className="relative">
              <TextInput
                id="username"
                name="username"
                type="text"
                className="w-full md:w-[30rem]"
                defaultValue={
                  currentUser.userData.username ||
                  updateUserFormik.values.username
                }
                onBlur={updateUserFormik.handleBlur}
                onChange={handleUsernameChange}
              />
              {loading && (
                <div className="absolute right-5 transform top-1/2 -translate-y-1/2 cursor-pointer">
                  {" "}
                  <Spinner size="sm" />{" "}
                </div>
              )}
              {success && (
                <img
                  src={checkIcon}
                  alt="check"
                  className="absolute right-5 transform top-1/2 -translate-y-1/2 cursor-pointer w-5 h-5 object-cover"
                />
              )}
            </div>
            {updateUserFormik.touched.username && error && (
              <p className="flex items-center gap-1 mt-1 text-xs text-red-600">
                <IoWarning size={15} /> {error}{" "}
              </p>
            )}
          </div>
          <div className="w-full md:w-fit">
            <label htmlFor="email" className="text-sm">
              {" "}
              Email{" "}
            </label>
            <TextInput
              value={currentUser.userData.email}
              id="email"
              type="text"
              className="w-full md:w-[30rem]"
              style={{ fontStyle: "italic", color: "#E3A008" }}
              readOnly
            />
          </div>
          <div className="w-full md:w-fit">
            <label htmlFor="password" className="text-sm">
              {" "}
              New Password{" "}
            </label>
            <div className="relative">
              <TextInput
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                className=" w-full md:w-[30rem]"
                placeholder="Enter New Password"
                value={updateUserFormik.values.password}
                onBlur={updateUserFormik.handleBlur}
                onChange={updateUserFormik.handleChange}
              />
              {showPassword ? (
                <BsEyeFill
                  className="absolute right-5 transform top-1/2 -translate-y-1/2 cursor-pointer"
                  onClick={toggleShowPassword}
                />
              ) : (
                <BsEyeSlashFill
                  className="absolute right-5 transform top-1/2 -translate-y-1/2 cursor-pointer"
                  onClick={toggleShowPassword}
                />
              )}
            </div>
            {updateUserFormik.touched.password &&
              updateUserFormik.errors.password && (
                <div className="w-full md:w-[30rem]">
                  {" "}
                  <p className="mt-1 text-xs text-red-600">
                    {updateUserFormik.errors.password}
                  </p>{" "}
                </div>
              )}
          </div>
          <div className="w-full md:w-fit">
            <label htmlFor="confirmPassword" className="text-sm">
              {" "}
              Confirm New Password{" "}
            </label>
            <TextInput
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className=" w-full md:w-[30rem]"
              placeholder="Enter Confirm Password"
              value={updateUserFormik.values.confirmPassword}
              onBlur={updateUserFormik.handleBlur}
              onChange={updateUserFormik.handleChange}
            />
            {updateUserFormik.touched.confirmPassword &&
              updateUserFormik.errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">
                  {updateUserFormik.errors.confirmPassword}
                </p>
              )}
          </div>
          <Button
            type="submit"
            className="w-full md:w-[30rem] mt-5"
            outline
            gradientDuoTone="pinkToOrange"
            disabled={
              updateUserFormik.isSubmitting ||
              status === "loading" || // Disable when submitting
              !updateUserFormik.isValid || // Disable when form is invalid
              !updateUserFormik.dirty || // Disable when form has no changes
              error ||
              loading
            }
          >
            {status === "loading" || updateUserFormik.isSubmitting ? (
              <Spinner aria-label="Default status example" />
            ) : (
              "Save Changes"
            )}
          </Button>
          {formSuccessMessage && (
            <Alert color="success" icon={IoIosCheckmarkCircleOutline}>
              {" "}
              <p>{formSuccessMessage}</p>{" "}
            </Alert>
          )}
          {formErrorMessage && (
            <Alert color="failure" icon={HiInformationCircle}>
              {" "}
              <p>{formErrorMessage}</p>{" "}
            </Alert>
          )}

          {!currentUser.userData.isAdmin && (
            <Accordion
              className="md:w-[30rem] mt-20"
              style={{
                background: "rgb(252, 151, 151)",
                borderRadius: ".4rem",
                border: "none",
              }}
            >
              <AccordionSummary
                expandIcon={
                  <ExpandMoreIcon style={{ color: "rgb(182, 28, 28)" }} />
                }
                aria-controls="panel2-content"
                id="panel2-header"
                style={{ borderRadius: ".4rem" }}
              >
                <h3 style={{ fontSize: "14px", color: "rgb(182, 28, 28)" }}>
                  {" "}
                  Delete Account?{" "}
                </h3>
              </AccordionSummary>
              <AccordionDetails>
                <h3 style={{ fontSize: "14px" }}>
                  Type your email address below, to delete your account. <br />
                </h3>
                <span className="mt-5 w-full flex justify-between items-center flex-row gap-[5%]">
                  <TextInput
                    type="email"
                    className="w-[70%]"
                    id="deleteAccountEmail"
                    onChange={handleDeleteAccountEmail}
                    placeholder="Your email address"
                  />
                  <MUIbtn
                    variant="contained"
                    color="error"
                    type="button"
                    disabled={deleteAccountEmail !== currentUser.userData.email}
                    className="w-[25%]"
                    onClick={() => setDeleteAccountPopup(true)}
                  >
                    Delete
                  </MUIbtn>
                </span>
              </AccordionDetails>
            </Accordion>
          )}
        </form>
      </div>
    </>
  );
};

const MemoizedProfile = memo(Profile);
export default MemoizedProfile;
