'use client'
import react from "react";
import { useState } from "react";
function FetchDebt() {
  const [data, setData] = useState([
    { id: 1, name: "food", amount: 200, userId: 2, type: "expense" },
    { id: 2, name: "transport", amount: 100, userId: 2, type: "expense" }
  ]);


  return (
    <div>
      {
        data.map((item) => (
          <div key={item.id}>
            <p>{item.name}</p>
            <p>${item.amount}</p>
          </div>
        ))
      }
    </div>
  )
}
export default FetchDebt;