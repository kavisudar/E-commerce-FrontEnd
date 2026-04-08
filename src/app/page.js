"use client";
import React from 'react'
import Navbar from './Navbar/page';
import HeroSlider from './Hero/page';
import PopularBuying from './Popular/page';
import Footer from './Footer/page';
export default function page() {
  return (
    <>
    <Navbar />
    <HeroSlider />
    <PopularBuying/> 
    <Footer/>
    </>
    
  )
}
