'use client'
import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
export default function Login() {
  const router = useRouter();
  return (

    <div className="flex h-screen border rounded-2xl border-black shadow-lg">
      <div className=" flex flex-col justify-center items-start left-0 w-1/2  bg-white/40">
        <h1 className="loginheader">Welcome to keepBirr </h1>

        <Image src="/login.svg" alt="logo" width={100} height={70} />
        <div className="bg-color-white shadow-xl mx-4">
          <p className="items-center font-bold text-2xl">Create Your Account</p>
          <label htmlFor="PhoneNumber">Phone Number:</label>
          <input type="text" id="PhoneNumber" name="PhoneNumber" placeholder="+251 9********" className="border border-gray-300 rounded-md p-2 w-full mb-4" />
          <label htmlFor="Password">Password:</label>
          <input type="password" id="Password" name="Password" placeholder="********" className="border border-gray-300 rounded-md p-2 w-full mb-4" />
          <div className="flex justify-around items-center gap-2">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors" onClick={() => router.push(`/dashboard`)}>Sign in </button >
            <button className="bg-white text-gray-500 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-600 hover:text-white transition-colors ">Sign Up</button>
          </div>
        </div>


      </div>
      <div className="w-1/2 justify-end items-end  mt-2">
        <Image src="/savemoney.png" alt="how to use clerk with nextjs" width={1000} height={700} />
      </div>
    </div>
  )
}

