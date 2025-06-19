import Home from "./home/Home";
import About from "./about/About";
import Portfolio from "./portfolio/Portfolio";
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Contact from './Contact'; // updated import path for Contact component
import CTF from './CTF'; // <-- make sure this matches the component name

export default function MultiPageRoutes() {
    return (
        <Routes>
            <Route exact path={'/'} element={<Home />} />
            <Route exact path={'/about'} element={<About />} />
            <Route exact path={'/portfolio'} element={<Portfolio />} />
            <Route exact path={'/contact'} element={<Contact />} /> {/* new route */}
            <Route exact path={'/CTF'} element={<CTF />} /> {/* use CTF here */}
            
        </Routes>
    )
}