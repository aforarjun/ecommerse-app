import React from 'react'
import Header from '../../components/header/Header'
import Hero from './Hero'
import Categories from './Categories'
import BestDeals from './BestDeals'
import Events from './Events'
import Footer from '../../components/footer/Footer'

const HomePage = () => {
    return (
        <>
            <Header activeHeading={1} />
            <Hero />
            <Categories />
            <BestDeals />
            <Events />


            <Footer />
        </>
    )
}

export default HomePage