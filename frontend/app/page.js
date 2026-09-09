import Image from "next/image";
import { SignedOut, SignedIn } from '@clerk/nextjs'
import Link from 'next/link'
import Header from "./_component/Header";
import Hero from "./_component/Hero";
export default function Home() {
  return (
    <div>

      <Header />
      <Hero />
    </div>

  );
}
