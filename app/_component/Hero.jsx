import React from 'react'
import Image from 'next/image';
function Hero() {
  return (
    <section className="bg-white items-center flex flex-col">
      <div className="mx-auto w-screen max-w-7xl my-20 px-4 py-8 sm:px-6 sm:py-24 lg:px-8 lg:py-7">
        <div className="mx-auto max-w-prose text-center mb-5 ">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Manage Your
            <strong className="text-indigo-600"> Expenses </strong>

          </h1>

          <p className="mt-4 text-base text-pretty text-gray-700 sm:text-lg/relaxed">
            start tracking your budget and save your money from you
          </p>

          <div className="mt-4 flex justify-center gap-4 sm:mt-6">
            <a className="inline-block rounded border border-indigo-600 bg-indigo-600 px-5 py-3 font-medium text-white shadow-sm transition-colors hover:bg-white hover:text-indigo-600" href="#">
              Get Started
            </a>

          </div>

        </div>

      </div>

      <Image src="/dashboard.png" alt="dashboard" width={1000} height={700} className="mt-9 m-5 flex items-center rounded-xl border-2" />

    </section>
  )
}

export default Hero;