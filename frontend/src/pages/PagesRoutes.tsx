import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './homepage/HomePage'
import ErrorPage from './ErrorPage';
import ProductsPage from './ProductsPage';
import EventsPage from './eventspage/EventsPage';
import BestSellingPage from './bestSellingPage/BestSellingPage';
import FaqsPage from './FaqsPage';

const Homepage = () => {
    return (
        <div>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/best-selling" element={<BestSellingPage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/faq" element={<FaqsPage />} />

                <Route path="/*" element={<ErrorPage />} />
            </Routes>
        </div>
    )
}

export default Homepage