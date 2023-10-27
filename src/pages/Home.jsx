import React from 'react';
import hero_illustration from "../assets/img/hero_illustration.png"
import { Link } from 'react-router-dom';
import { Button } from '@nextui-org/react';

export default function Home() {
    return (
        <>
            <img src={hero_illustration} className='z-10 w-screen h-screen object-cover bg-top absolute top-0 left-0' />

            <div className='z-20 pt-[7%] flex flex-col justify-center items-center'>
                <div className='flex flex-col gap-3'>
                    <h2 className='font-lato text-6xl font-extrabold text-[#333]'>Simplifying Rail Travel for You</h2>
                    <p className='max-w-[800px] font-lato text-lg font-semibold text-[#333] mb-4'>Experience Effortless Rail Travel: We're Dedicated to Simplifying Your Journey, Making Every Trip Convenient, Safe, and Truly Enjoyable.</p>
                    <Link to="/login">
                        <Button color="danger" variant="shadow" size="lg" radius="sm" className="font-bold">
                            Book Tickets Now →
                        </Button>
                    </Link>
                </div >
            </div >
        </>
    )
}