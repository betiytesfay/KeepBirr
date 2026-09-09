import React, { children } from "react"
function Expense({ children }) {
  return (
    <div>
      {children}
    </div>
  )
}
export default Expense;