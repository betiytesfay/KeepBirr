'use client'
import React, { useState } from 'react';
const moneyOwed = 1000;


function Layout({ layout }) {
  const [showAddPopup, setShowAddPopup] = useState(false);
  const HandleAddPopup = () => {
    setShowAddPopup(true);

  }
  const HandleCloseModal = () => {
    setShowAddPopup(false);
  }
  return (
    <div className="p-4 ml-5">
      <div className=" border shadow-lg p-5 rounded-lg mt-20">
        <p>
          Total money owed {moneyOwed}
        </p>
      </div>
      <div classNme="flex flex-row ">
        <h2 className="text-xl font-bold mb-4">DEBT OVERVIEW</h2>
        <div className="justify-end m-1">
          <button className="bg-blue-400 text-white px-2 py-1 rounded-xl hover:bg-blue-500 font-semibold" onClick={HandleAddPopup}>
            +ADD
          </button>
          <button className="bg-blue-400 text-white px-2 py-1 rounded-xl hover:bg-blue-500 font-semibold">
            filter
          </button>
        </div>
      </div>
      <div className="grid grid-cols-5 mt-5 gap-4 p-4 shadow-sm rounded">
        <p className="font-semibold">
          Name
        </p>
        <p className="font-semibold">
          Amount
        </p>
        <p className="font-semibold">
          Phone number
        </p>
        <p className="font-semibold">
          telegram
        </p>
        <p className="font-semibold">
          reason
        </p>

      </div>

      {showAddPopup && (
        <div>
          <p>
            Add Debt
          </p>
          <CloseButton></CloseButton>
          <div className="flex flex-col">
            <p>Pick icon</p>// i dont know how to add emojis so the user can pick like in tlegram
            <label>Lender</label>
            <input type="text" placeholder="Name" className="rounded-sm  " />
            <input type="decimal" placeholder="Name" />
            <input type="tel" placeholder="+251987654321" />
            <input type="text" placeholder="@username" />
            <input type="text" placeholder="reason" />
          </div>
        </div>
      )
      }

    </div>
  )
}
export default Layout;