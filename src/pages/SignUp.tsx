import { useState } from "react";

import { useNavigate, Link } from "react-router-dom";
import { createAccount } from "../Api/authApi";
import { FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast";
const inputClass =
  "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200";

  
export default function SignUp() {
  const navigate = useNavigate();
 const [name,setName] = useState<string>("")
 const [email,setEmail] = useState<string>("")
 const [password,setPassword] = useState<string>("")
 const [error,setError] = useState<string>("")
 const[isLoading,setIsLoading] = useState<boolean>(false)
   const handleSubmit = (e:any) => {
   e.preventDefault()
   setIsLoading(true)
   createAccount({name,email,password}).then((res) => {
    if(res.status === 201){
      navigate("/verify")
    } else{
   toast("error creating Account")
    }
   }).finally(() => {
    setIsLoading(false)
   })
  }

 

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 rounded-2xl bg-white p-8 shadow-lg"
      >
        <h1 className="text-center text-2xl font-bold text-gray-800">Create Account</h1>

        <div className="grid grid-cols gap-3">
          <input name="Name" placeholder="Name" value={name} onChange={(e:React.ChangeEvent<HTMLInputElement>) => (
            setName(e.target.value)
          )} className={inputClass} required />
        </div>
        <input name="email" type="email" placeholder="Email" value={email} onChange={(e:React.ChangeEvent<HTMLInputElement>) => (setEmail(e.target.value))} className={inputClass} required />
        <input name="password" type="password" placeholder="Password" value={password} onChange={(e:React.ChangeEvent<HTMLInputElement>) => (setPassword(e.target.value))} className={inputClass} required />
        {/* <input name="confirmPassword" type="password" placeholder="Confirm password" value={form.confirmPassword} onChange={handleChange} className={inputClass} required /> */}

        {error && <p className="text-sm text-red-600">{error}</p>}

      {isLoading ? (
         <button
          type="submit"
          className="w-full rounded-lg bg-indigo-600 py-2.5 font-semibold text-white transition hover:bg-indigo-700"
        >
        
          <div className="flex justify-center items-center gap-2">
            <FaSpinner className="animate-spin"/>
            <p>loading...</p>
          </div>
        </button>
      ):
       <button
          type="submit"
          className="w-full rounded-lg bg-indigo-600 py-2.5 font-semibold text-white transition hover:bg-indigo-700"
        >
          Sign Up
        </button>}

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/signin" className="font-medium text-indigo-600 hover:underline">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}