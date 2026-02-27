import React from 'react'
import SideNav from "./_component/SideNav.jsx"
function layout({ children }) {
  return (
    <div>
      <div className=" fixed md:w-64 hidden md:block bg-color-blue">
        <SideNav />
      </div>
      <div className="bg-color-blue md:ml-64">
        {children}
      </div>
    </div>
  )
}

export default layout