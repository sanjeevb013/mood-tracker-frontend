"use client";
import { useRouter } from "next/navigation";
import { useState, ChangeEvent, FormEvent } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import { loginApi } from "@/services/api/authServices";
import { LoginData } from "@/types/authTypes";
import { useAuth } from "@/providers/AuthProvider";



interface FormErrors {
  [key: string]: string;
}

const initialState: LoginData = {
  email: "",
  password: "",
};

export default function LoginForm() {
  const router = useRouter();
  const {login} = useAuth()
  const [formData, setFormData] = useState<LoginData>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ validate email & password
  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ handle input change
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ✅ handle form submit with API call
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      try {
        setLoading(true);

        const data = await loginApi(formData);
        if(data){
               login(data.accessToken, data.refreshToken, data.userId);
                  router.push("/dashboard");
          toast.success(data.message);
 
        }
      
      } catch (error: any) {
        console.error("Login error:", error);
        toast.error(error.message || "Login failed");
      } finally {
        setLoading(false);
      }
    }
  };

  // ✅ reusable input field
  const renderInput = (
    field: keyof LoginData,
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
          {show ? <FaEye /> : <FaEyeSlash />}
        </button>
      )}
      {errors[field] && (
        <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
      )}
    </div>
  );

  return (
    <>
      <form onSubmit={handleSubmit} className="p-8 md:p-10">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {renderInput("email", "Email", "email")}
        {renderInput(
          "password",
          "Password",
          "password",
          true,
          () => setShowPassword((prev) => !prev),
          showPassword
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-md transition-colors disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="flex gap-2 mt-2 items-center justify-center">
          <span>Don't have an account?</span>
          <span
            onClick={() => router.push("/auth/signup")}
            className="text-indigo-600 hover:underline cursor-pointer"
          >
            Sign up
          </span>
        </div>
      </form>
    </>
  );
}
