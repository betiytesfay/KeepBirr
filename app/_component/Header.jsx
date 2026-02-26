import React from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import "./Header.css"
function Header() {
  return (
    <div className="m-1 p-5 flex flex-row justify-between items-center border shadow-sm">
      <Image src="./logo.svg" alt="logo" width={40} height={20} />
      <Button className="headerButton " >Get Started</Button>
    </div>
  )
}

export default Header