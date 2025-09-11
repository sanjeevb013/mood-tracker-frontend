"use client";
import { useAuth } from "@/providers/AuthProvider";
import { signup } from "@/services/api/authServices";
import { FormData, SignupPayload } from "@/types/authTypes";
import { useRouter } from "next/navigation";
import { useState, ChangeEvent, FormEvent } from "react";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";


interface FormErrors {
  [key: string]: string;
}

const initialState: FormData = {
  email: "",
  firstName: "",
  lastName: "",
  phoneNumber: "",
  country: "",
  countryCode: "",
  password: "",
  confirmPassword: "",
  street: "",
  city: "",
  state: "",
  zip: "",
};

export default function SignUpForm() {
  const router = useRouter();
  const {login} = useAuth()
  const [formData, setFormData] = useState<FormData>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Validation function
  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (!/^[A-Za-z]+$/.test(formData.firstName)) {
      newErrors.firstName = "First name must contain only letters";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (!/^[A-Za-z]+$/.test(formData.lastName)) {
      newErrors.lastName = "Last name must contain only letters";
    }

    // ✅ Phone number (already includes country code)
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\+?[1-9]\d{5,15}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber =
        "Phone number must include country code and be 6–15 digits long";
    }

    if (!formData.country.trim()) newErrors.country = "Country is required";
    if (!formData.street.trim()) newErrors.street = "Street is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";

    if (!formData.zip.trim()) {
      newErrors.zip = "Zip is required";
    } else if (!/^\d{6}$|^\d{8}$/.test(formData.zip)) {
      newErrors.zip = "Zip code must be exactly 6 or 8 digits";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(
        formData.password
      )
    ) {
      newErrors.password =
        "Password must include uppercase, lowercase, number & special character";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Input change handler
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let { name, value } = e.target;

    if (value.startsWith(" ")) return;

    if (name === "firstName" || name === "lastName") {
      value = value.replace(/[^A-Za-z]/g, "");
    }

    if (name === "zip") {
      value = value.replace(/[^0-9]/g, "").slice(0, 8);
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // ✅ Submit handler
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);

      const { confirmPassword, city, state, street, zip,countryCode, ...rest } = formData;

      const apiData = {
        ...rest,
        phoneNumber: `+${formData.phoneNumber}`, // already includes country code
        address: {
          street,
          city,
          state,
          zip,
          country: formData.country,
        },
      };
      const result = await signup(apiData);
      if (result.accessToken && result.refreshToken) {
       localStorage.setItem("accessToken", result.accessToken);
      localStorage.setItem("refreshToken", result.refreshToken);
        login(result.accessToken, result.refreshToken);
        router.push("/dashboard")
    }
      toast.success(result.message)
      setIsSubmitting(false);
    } catch (error) {
      console.error("Submission error:", error);
      setIsSubmitting(false);
    }
  };

  // ✅ Input Renderer with placeholder
  const renderInput = (
    field: keyof FormData,
    label: string,
    type: string,
    showToggle?: boolean,
    toggleFn?: () => void,
    show?: boolean,
    placeholder?: string
  ) => (
    <div className="mb-5 relative">
      <label htmlFor={field} className="block mb-2 font-semibold capitalize">
        {label}
      </label>
      <input
        type={showToggle ? (show ? "text" : "password") : type}
        name={field}
        id={field}
        value={formData[field]}
        onChange={handleChange}
        disabled={isSubmitting}
        placeholder={placeholder}
        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed ${
          errors[field] ? "border-red-500" : "border-gray-300"
        }`}
      />
      {showToggle && toggleFn && (
        <button
          type="button"
          onClick={toggleFn}
          disabled={isSubmitting}
          aria-label={`Toggle ${field} visibility`}
          className="absolute right-3 top-11 text-gray-600 hover:text-gray-800 disabled:opacity-50"
        >
          {show ? <FaEye /> : <FaEyeSlash />}
        </button>
      )}
      {errors[field] && (
        <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
      )}
    </div>
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md h-[80vh] overflow-y-auto px-4 py-6 rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

      {renderInput("firstName", "First Name", "text", false, undefined, false, "Enter your first name")}
      {renderInput("lastName", "Last Name", "text", false, undefined, false, "Enter your last name")}
      {renderInput("email", "Email", "email", false, undefined, false, "Enter your email")}

      {/* ✅ Phone input with country code selector */}
      <div className="mb-5">
        <label htmlFor="phoneNumber" className="block mb-2 font-semibold">
          Phone Number
        </label>
        <PhoneInput
          country={"in"} // default country
          value={formData.phoneNumber}
          onChange={(phone, country: any) => {
            setFormData((prev) => ({
              ...prev,
              phoneNumber: `${phone}`, // ensures + included
              country: country?.name || "",
              countryCode: `+${country?.dialCode || ""}`,
            }));
            if (errors.phoneNumber) {
              setErrors((prev) => ({ ...prev, phoneNumber: "" }));
            }
          }}
          inputProps={{
            name: "phoneNumber",
            required: true,
            disabled: isSubmitting,
          }}
          inputStyle={{
            width: "100%",
            height: "42px",
            fontSize: "16px",
          }}
          containerStyle={{
            width: "100%",
          }}
          placeholder="Enter phone number"
        />
        {errors.phoneNumber && (
          <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
        )}
      </div>

      {renderInput("street", "Street", "text", false, undefined, false, "Enter your street")}
      {renderInput("city", "City", "text", false, undefined, false, "Enter your city")}
      {renderInput("state", "State", "text", false, undefined, false, "Enter your state")}
      {renderInput("zip", "Zip Code", "text", false, undefined, false, "Enter zip code")}

      {renderInput(
        "password",
        "Password",
        "password",
        true,
        () => setShowPassword((prev) => !prev),
        showPassword,
        "Enter your password"
      )}
      {renderInput(
        "confirmPassword",
        "Confirm Password",
        "password",
        true,
        () => setShowConfirmPassword((prev) => !prev),
        showConfirmPassword,
        "Re-enter your password"
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-md transition-colors disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Creating..." : "Create"}
      </button>

      <div className="flex gap-2 mt-4 items-center justify-center">
        <span>Already have an account?</span>
        <button
          type="button"
          onClick={() => router.push("/auth/login")}
          className="text-indigo-600 hover:underline cursor-pointer"
        >
          Login
        </button>
      </div>
    </form>
  );
}
