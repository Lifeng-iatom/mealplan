"use client";


import { SignedIn, SignedOut, useUser, SignOutButton, SignUp } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';


export default function Navbar(){
  const {isLoaded, isSignedIn, user } = useUser();
  const [open, setOpen] = useState(false);
  if (!isLoaded) <p>Loading ...... </p>;

  useEffect(() => {
    if (isSignedIn) setOpen(false);
  }, [isSignedIn]);



  return(
    <>
      <nav className='navbar-global'>
      
        <div className='navbar-items'>
          <Link href="/">
            <Image src="/logo.png" width={60}  height={60} alt="logo" className='navbar-logo' />
          </Link>     
        
          <div className='space-x-6 flex items-center'>
            <SignedIn >
             
              {user?.imageUrl ? (<Link href="/profile"> 
              <Image src={user.imageUrl} alt="profile picture" width={40} height={40} className='rounded-full'/>
              </Link>)
              : (<div className='w-10 h-10 bg-gray-300 rounded-full'></div>)}

              <Link
                  href="/mealplan" className='navbar-link'
                >
                Mealplan
              </Link>
              <Link href="/subscribe" className='navbar-link'>Subscribe</Link>

              <SignOutButton redirectUrl={typeof window !== "undefined" ? window.location.href : "/"}>
                <button className='navbar-signoutbutton  bg-emerald-500 hover:bg-emerald-600 transition'>Sign out</button>
              </SignOutButton>
            </SignedIn>

            <SignedOut>
              <Link href="/" className='avbar-link'>Home</Link>
              <Link href={isSignedIn ? "/subscribe" : "/sign-up"} className='avbar-link'>Subscribe</Link>
              <button
                onClick={() => setOpen(true)}
                className="navbar-signoutbutton bg-emerald-500 hover:bg-emerald-600 transition"
              >
                Sign up
              </button>
              
            </SignedOut>
          </div>
        </div>

      </nav>
      
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md w-full relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-2 right-2 text-gray-500"
            >
              ✕
            </button>

            <SignUp routing="virtual" signInUrl="#" redirectUrl={typeof window !== "undefined" ? window.location.href : "/"} />
          </div>
        </div>
      )}

    </>
  );
}
