"use client";


import { SignedIn, SignedOut, useUser } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

export default function Navbar(){
  const {isLoaded, isSignedIn, user } = useUser();
  if (!isLoaded) <p>Loading ...... </p>;

  return(
    <>
      <nav>
        {""}
        <div>
          <Link href="/">
            <Image src="/logo.png" width={60}  height={60} alt="logo" />
          </Link>     
        </div>

        <div>
          <SignedIn>
            <Link
                href="/mealplan"
              >
              Mealplan
            </Link>
            {user?.imageUrl ? (<Link href="/profile"> 
            <Image src={user.imageUrl} alt="profile picture" width={40} height={40}/>
            </Link>)
             : (<div></div>)}
          </SignedIn>
          <SignedOut>

          </SignedOut>
        </div>
      </nav>
    </>
  );
}
