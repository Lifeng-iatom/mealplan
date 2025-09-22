"use client";


import { SignedIn, SignedOut, useUser, SignOutButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';


export default function Navbar(){
  const {isLoaded, isSignedIn, user } = useUser();
  if (!isLoaded) <p>Loading ...... </p>;

  return(
    <>
      <nav className='navbar-global'>
      
        <div className='navbar-items'>
          <Link href="/">
            <Image src="/logo.png" width={60}  height={60} alt="logo" className='navbar-logo' />
          </Link>     
        
          <div className='space-x-6 flex items-center'>
            <SignedIn>
             
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

              <SignOutButton>
                <button className='navbar-signoutbutton  bg-emerald-500 hover:bg-emerald-600 transition'>Sign out</button>
              </SignOutButton>
            </SignedIn>

            <SignedOut>
              <Link href="/" className='avbar-link'>Home</Link>
              <Link href={isSignedIn ? "/subscribe" : "/sign-up"} className='avbar-link'>Subscribe</Link>
              <Link href="/sign-up" className='navbar-signoutbutton  bg-emerald-500 hover:bg-emerald-600 transition'>Sign up</Link>
              
            </SignedOut>
          </div>
        </div>

      </nav>
    </>
  );
}
