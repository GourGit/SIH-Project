import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './views/Home';
import MapViewer from './views/MapViewer';
import LiveWeather from './views/LiveWeather';
import Forecast from './views/Forecast';
import Analytics from './views/Analytics';
import CitizenPortal from './views/CitizenPortal';

function App() {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <Header />
      <Navigation />
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/live" element={<LiveWeather />} />
          <Route path="/map" element={<MapViewer />} />
          <Route path="/forecast" element={<Forecast />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/citizen" element={<CitizenPortal />} />
          {/* Fallback route for all other tabs pointing to Home for now */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
