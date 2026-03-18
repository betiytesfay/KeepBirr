'use client'
import React from 'react'
import SideNav from "../_component/SideNav.jsx";
import { useEffect, useState } from 'react';
function fetchExpense() {
  const [data, setData] = useState([]);
}

import axios from 'axios';
const debtMoney = 2000;
const name = "Beti";
function layout({ layout }) {
  return (
    <div>
      <div className="fixed md:w-64 hidden md:block bg-color-blue">
        <div className="border shadow-sm p-5 mx-5 flex rounded-lg mt-20">
          {name} you have a Total of ${debtMoney} money to pay
        </div>
        <div className="flex flex-col gap-5 ">
          <div className="flex flex-row justify-between mt-5 mx-5 shadow-sm">
            <p>
              name
            </p>
            <p>
              amount
            </p>
            <p>
              phone number
            </p>

          </div>

        </div>
      </div>
    </div>
  )
}
export default layout;