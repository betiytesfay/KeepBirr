"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Phone,
  Sparkles,
  User,
} from "lucide-react";
import api from "../../lib/api.js";
import useStore from "../../store/useStore.js";
import { useQueryClient } from "@tanstack/react-query";

export default function LoginPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setUser = useStore((state) => state.setUser);
  const showToast = useStore((state) => state.showToast);

  const [mode, setMode] = useState("login"); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMessage("");
  };

  const handleAuthSuccess = (userData, token) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("keepbirr_token", token);
      localStorage.setItem("keepbirr_user", JSON.stringify(userData));
    }
    setUser(userData);
    showToast(`Welcome back, ${userData.name}!`, "success");
    queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    queryClient.invalidateQueries({ queryKey: ["expenses"] });
    router.push("/dashboard");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      if (mode === "login") {
        if (!formData.phoneNumber || !formData.password) {
          setErrorMessage("Please enter both phone number and password");
          setIsLoading(false);
          return;
        }

        const res = await api.post("/auth/login", {
          phoneNumber: formData.phoneNumber.trim(),
          password: formData.password,
        });

        if (res.data?.token) {
          setSuccessMessage("Signed in successfully! Loading dashboard...");
          handleAuthSuccess(res.data.user, res.data.token);
        }
      } else {
        if (!formData.name || !formData.phoneNumber || !formData.password) {
          setErrorMessage("Please provide your name, phone number, and password");
          setIsLoading(false);
          return;
        }

        const res = await api.post("/auth/register", {
          name: formData.name.trim(),
          phoneNumber: formData.phoneNumber.trim(),
          email: formData.email.trim() || undefined,
          password: formData.password,
        });

        if (res.data?.token) {
          setSuccessMessage("Account created successfully! Loading dashboard...");
          handleAuthSuccess(res.data.user, res.data.token);
        }
      }
    } catch (err) {
      console.error("Auth error:", err);
      setErrorMessage(err.message || "Failed to authenticate. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  // One-click demo login for fast testing
  const handleDemoLogin = async () => {
    setErrorMessage("");
    setIsLoading(true);

    const demoCredentials = {
      phoneNumber: "0911223344",
      password: "password123",
    };

    try {
      // Try login first
      const res = await api.post("/auth/login", demoCredentials);
      if (res.data?.token) {
        handleAuthSuccess(res.data.user, res.data.token);
        return;
      }
    } catch (loginErr) {
      // If user doesn't exist yet, auto-register the demo user
      try {
        const regRes = await api.post("/auth/register", {
          name: "Beti Haile",
          phoneNumber: demoCredentials.phoneNumber,
          email: "beti@keepbirr.com",
          password: demoCredentials.password,
        });
        if (regRes.data?.token) {
          handleAuthSuccess(regRes.data.user, regRes.data.token);
          return;
        }
      } catch (regErr) {
        setErrorMessage(regErr.message || "Demo login failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
        {/* Brand Header */}
        <div className="p-8 pb-6 text-center border-b border-gray-100 bg-linear-to-b from-gray-50/70 to-white">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Image src="/logo.svg" alt="KeepBirr Logo" width={38} height={38} priority />
            <div className="flex items-baseline">
              <span className="font-extrabold text-2xl text-onyx tracking-tight">Keep</span>
              <span className="font-extrabold text-2xl text-gray-900 tracking-tight">Birr</span>
              <span className="w-2.5 h-2.5 rounded-full bg-spring ml-1" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-900 font-serif">
            {mode === "login" ? "Sign In to KeepBirr" : "Create Your Account"}
          </h2>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-gray-100 bg-gray-50/50 p-1.5 mx-6 mt-4 rounded-xl">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setErrorMessage("");
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === "login"
                ? "bg-white text-onyx shadow-xs font-extrabold"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setErrorMessage("");
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === "register"
                ? "bg-white text-onyx shadow-xs font-extrabold"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 pt-6 space-y-4">
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <div className="p-3.5 rounded-xl bg-spring/20 border border-spring text-onyx text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Field: Name (Only in Register mode) */}
          {mode === "register" && (
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Beti Haile"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-onyx text-sm focus:outline-hidden bg-white"
                  required={mode === "register"}
                />
              </div>
            </div>
          )}

          {/* Field: Phone Number */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Phone Number <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                name="phoneNumber"
                placeholder="e.g. 0911223344"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-onyx text-sm focus:outline-hidden bg-white"
                required
              />
            </div>
          </div>

          {/* Field: Email (Optional, in Register mode) */}
          {mode === "register" && (
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Email Address (Optional)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  placeholder="e.g. beti@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-onyx text-sm focus:outline-hidden bg-white"
                />
              </div>
            </div>
          )}

          {/* Field: Password */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 focus:border-onyx text-sm focus:outline-hidden bg-white"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-onyx text-white hover:bg-gray-800 text-sm font-bold shadow-xs transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-spring" />
                <span>Processing...</span>
              </>
            ) : (
              <span>{mode === "login" ? "Sign In" : "Create Account"}</span>
            )}
          </button>

          {/* One-click Demo Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-spring/25 hover:bg-spring/40 text-onyx border border-spring text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>One-Click Demo Login (Beti)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
