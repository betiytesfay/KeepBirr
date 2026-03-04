import React from 'react'
import Image from 'next/image'

import { Button } from "../../components/ui/button"
import "./Header.css"
function Header() {
  return (
    <div className="m-1 p-5 flex flex-row justify-between items-center border shadow-sm">
      <div className="flex">
        <Image src="./logo.svg" alt="logo" width={40} height={20} />
        <p className="font-bold ml-2 mt-3 ">KeepBirr</p>
      </div>
      <Button className="headerButton " >Login</Button>
    </div>
  )
}

export default Header