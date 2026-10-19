import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { verifyAccount } from "../Api/authApi";
import toast from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";

export default function Verify() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState<string>("");
  const [loading,isLoading] = useState<boolean>(false)


  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    isLoading(true)
    
    verifyAccount({otp}).then((res) => {
      if(res.status === 201){
        navigate("/signin")
      }else{
        toast("invalid otp")
      }
    }).finally(() =>{
      isLoading(false)
    })
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 rounded-2xl bg-white p-8 shadow-lg"
      >
        <h1 className="text-center text-2xl font-bold text-gray-800">Verify Your Account</h1>
        <p className="text-center text-sm text-gray-500">Enter the code we sent to you.</p>

        <input
          placeholder="Enter OTP code"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
          inputMode="numeric"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-center text-xl tracking-widest text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          required
        />

      {loading ?(
          <button
          type="submit"
          className="w-full rounded-lg bg-indigo-600 py-2.5 font-semibold text-white transition hover:bg-indigo-700"
        >
          <div className="flex justify-center items-center gap-2">
            <FaSpinner className = "animate-spin"/>
            <p>loading...</p>
          </div>
        </button>
      ):  <button
          type="submit"
          className="w-full rounded-lg bg-indigo-600 py-2.5 font-semibold text-white transition hover:bg-indigo-700"
        >
          Verify
        </button>}
      </form>
    </div>
  );
}