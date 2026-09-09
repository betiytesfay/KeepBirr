'use client'
import React from 'react'
import { Utensils } from 'lucide-react';
const amount = 1222;
const percentage = "60 %";
const listOfThings = "food"
const maxAmount = 2000;
function layout({ layout }) {
  return (
    <div className="bg-gray-100 w-full h-full max-w-screen-xl">
      <div className="ml-2">
        <h1 className="text-blue-900 font-bold text-4xl p-3 ">Budget Planner</h1>
        <p >Assign your money on each categories</p>
      </div>
      <div className="grid grid-cols-2">

        <div className="grid-cols-2 container bg-white shadow-sm p-3 h-40 w-80 m-2 rounded-sm mb-3" >
          <div className="flex justify-between">
            <Utensils className=" bg-blue-400 text-blue-950 p-2 w-10 h-10" />

            <p>{amount}</p>
          </div>
          <div className="flex flex-row justify-between mt-2">

            <p>Food & Dining</p>
            <p className="text-blue-950">{percentage}</p>

          </div>
          <progress value={50} max={100} className="bg-blue-950 h-2" />

          <div className="flex justify-between">
            <p>max:{maxAmount}{listOfThings}</p>
            <button className="text-blue-900">Adjust Limits</button>
          </div>
        </div>
      </div>
      <div>

      </div>
    </div>

  )
}
export default layout;