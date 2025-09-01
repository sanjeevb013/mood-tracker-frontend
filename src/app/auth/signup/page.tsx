"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, ChangeEvent, FormEvent } from "react";
import { FaUserPlus, FaEye, FaEyeSlash } from "react-icons/fa";

interface FormData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  [key: string]: string;
}

const initialState: FormData = {
  email: "",
  firstName: "",
  lastName: "",
  password: "",
  confirmPassword: "",
};

export default function SignUpForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (/^\s/.test(formData.firstName)) {
      newErrors.firstName = "First name cannot start with a space";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (/^\s/.test(formData.lastName)) {
      newErrors.lastName = "Last name cannot start with a space";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      console.log("Form submitted:", formData);
    }
  };

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
        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
          errors[field] ? "border-red-500" : "border-gray-300"
        }`}
      />
      {showToggle && toggleFn && (
        <button
          type="button"
          onClick={toggleFn}
          aria-label={`Toggle ${field} visibility`}
          className="absolute right-3 top-11 text-gray-600 hover:text-gray-800"
        >
          {show ? <FaEye />: <FaEyeSlash />}
        </button>
      )}
      {errors[field] && (
        <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
      )}
    </div>
  );

  return (
    <>
     <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
      {renderInput("email", "Email", "email")}
      {renderInput("firstName", "First Name", "text")}
      {renderInput("lastName", "Last Name", "text")}
      {renderInput("password", "Password", "password", true, () => setShowPassword((prev) => !prev), showPassword)}
      {renderInput("confirmPassword", "Confirm Password", "password", true, () => setShowConfirmPassword((prev) => !prev), showConfirmPassword)}

      <button type="submit" className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-md transition-colors">
        Create Account
      </button>
      <div className="flex gap-2 mt-2 items-center justify-center">
        <span>Already have an account?</span>
        <span onClick={()=>router.push('/auth/login')} className="text-indigo-600 hover:underline cursor-pointer">Login</span>
      </div>
      </>
  );
}