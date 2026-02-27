import React from 'react'
import Image from 'next/image'
import { LayoutGrid, PiggyBank, ReceiptText } from "lucide-react"
function SideNav() {
  const menuList = [
    {
      id: 1,
      name: "Dahboard",
      icon: LayoutGrid,
    }, {
      id: 2,
      name: "Budget",
      icon: PiggyBank
    },
    {
      id: 3,
      name: "Expense",
      icon: ReceiptText
    },
    {
      id: 4,
      name: "debt to receive",
      icon: ReceiptText
    },
    {
      id: 5,
      name: "debt to pay",
      icon: ReceiptText
    }
  ]
  return (
    <div className="h-screen p-5 bg-color-blue border shadow-sm">
      <Image src="/logo.svg" alt="logo" width={40} height={20} />
      <div>
        {menuList.map((menu, index) => (
          <h2 className="flex gap-2 items-center text-gray-600 font-medium p-5 cursor-pointer rounded-lg
          hover: text-primary hover:bg-blue-100">
            <menu.icon />
            {menu.name}
          </h2>
        ))
        }
      </div>
      <div className="fixed bottom-10 p-5 flex items-center">
        <p>create your own profile</p>
      </div>
    </div>
  )
}

export default SideNav