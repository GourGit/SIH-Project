import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './views/Home';
import MapViewer from './views/MapViewer';
import LiveWeather from './views/LiveWeather';
import Forecast from './views/Forecast';
import Analytics from './views/Analytics';
import CitizenPortal from './views/CitizenPortal';
import NotFound from './views/NotFound';

function App() {
  const location = useLocation();

  useEffect(() => {
    const titles = {
      '/': 'Home - National Weather Platform',
      '/live': 'Live Weather - National Weather Platform',
      '/map': 'GIS Map - National Weather Platform',
      '/forecast': 'Forecast - National Weather Platform',
      '/analytics': 'Analytics - National Weather Platform',
      '/citizen': 'Citizen Services - National Weather Platform'
    };
    document.title = titles[location.pathname] || 'National Weather Platform';
  }, [location]);

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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
