'use client'
import React from 'react'
import { Coffee } from 'lucide-react'
const amount = 2000;
const items = ["All ", "food", "Taxi", "Cloth", "Subscription", "Daily Expenses"]
function layout() {
  return (
    <div className="flex flex-col bg-gray-200">

      <div className="flex justify-between m-2 px-10 py-1 ">
        <h1 className="font-bold text-4xl">Expense log</h1>
        <div className="bg-blue-200">
          <p>{amount}</p>
        </div>
      </div>
      <div>
        <ul className="flex flex-cols p-2 rounded gap-2" >
          {items.map((item) => (
            <li key={item} className="px-3 py-1 bg-gray-300 rounded ">{item}</li>
          ))

          }
        </ul>
      </div>
      <div>
        <Coffee className="bg-blue-200 text-blue-950" />
      </div>
    </div>

  )
}
export default layout;