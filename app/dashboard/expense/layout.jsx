'use client'
import React from 'react'
import { Coffee, Utensils, Car } from 'lucide-react'
const amount = 2000;

const expenses = [
  {
    name: "Coffee",
    icon: Coffee
  },
  {
    name: "Food",
    icon: Utensils
  },
  {
    name: "Transport",
    icon: Car
  }
];
const items = ["All ", "food", "Travel", "Cloth", "Subscription", "Daily Expenses"]
function layout() {
  return (
    <div className="bg-gray-100 ">
      <div className="flex flex-col ml-2">

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
        <div className="bg-white p-3 ">
          {expenses.map((item) => {
            const Icon = item.icon;

            <div key={item.name}>

              <Icon className="w-6 h-6 text-blue-900" />
              <span>{item.name}</span>
            </div>
          })}
        </div>

      </div>
    </div>
  )
}
export default layout;