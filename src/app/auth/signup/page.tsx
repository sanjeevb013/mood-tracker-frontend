"use client";
import { useRouter } from "next/navigation";
import { useState, ChangeEvent, FormEvent } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface FormData {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  country: string;
  password: string;
  confirmPassword: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}

interface FormErrors {
  [key: string]: string;
}

const initialState: FormData = {
  email: "",
  firstName: "",
  lastName: "",
  phoneNumber: "",
  country: "",
  password: "",
  confirmPassword: "",
  street: "",
  city: "",
  state: "",
  zip: "",
};

export default function SignUpForm() {
  const router = useRouter();
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

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\+?\d{10,15}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Invalid phone number";
    }

    if (!formData.country.trim()) newErrors.country = "Country is required";

    if (!formData.street.trim()) newErrors.street = "Street is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.zip.trim()) newErrors.zip = "Zip is required";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";

    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Input change handler
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Submit handler
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return; // ❌ stop if errors

    try {
      const { confirmPassword, city, state, street, zip, ...rest } = formData;

      const apiData = {
        ...rest,
        address: {
          street,
          city,
          state,
          zip,
          country: formData.country,
        },
      };

      console.log("✅ Valid Data Submitted:", apiData);

      // API call here...
      // await fetch("/api/signup", { method: "POST", body: JSON.stringify(apiData) });

      // Reset form
      // setFormData(initialState);
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      // setIsSubmitting(false);
    }
  };

  // Input Renderer
  const renderInput = (
    field: keyof FormData,
    label: string,
    type: string,
    showToggle?: boolean,
    toggleFn?: () => void,
    show?: boolean
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
      className="max-w-md mx-auto h-[80vh] overflow-y-auto px-4 py-6 rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

      {renderInput("firstName", "First Name", "text")}
      {renderInput("lastName", "Last Name", "text")}
      {renderInput("email", "Email", "email")}
      {renderInput("phoneNumber", "Phone Number", "tel")}
      {renderInput("country", "Country", "text")}

      {/* Address */}
      {renderInput("street", "Street", "text")}
      {renderInput("city", "City", "text")}
      {renderInput("state", "State", "text")}
      {renderInput("zip", "Zip Code", "text")}

      {/* Passwords */}
      {renderInput(
        "password",
        "Password",
        "password",
        true,
        () => setShowPassword((prev) => !prev),
        showPassword
      )}
      {renderInput(
        "confirmPassword",
        "Confirm Password",
        "password",
        true,
        () => setShowConfirmPassword((prev) => !prev),
        showConfirmPassword
      )}

      <button
        type="submit"
        className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-md transition-colors disabled:cursor-not-allowed"
      >
        Create
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
