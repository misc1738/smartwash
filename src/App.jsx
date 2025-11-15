import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Routes, Route, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import Navbar from "./components/Navbar";
import ErrorBoundary from "./components/ErrorBoundary";
import Home from "./pages/Home";
import Bookings from "./pages/Bookings";
import Services from "./pages/Services";
import BookingConfirmation from "./pages/BookingConfirmation";
import AdminDashboard from "./pages/AdminDashboard";
import RequireAuth from './components/RequireAuth';
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Terms from "./pages/Terms";
import MpesaTestPage from "./pages/MpesaTestPage";
import ScrollProgress from "./components/ui/ScrollProgress";

// Lazy-load heavy visual components so they don't bloat the main bundle or run on low-end devices
const CustomCursor = lazy(() => import('./components/ui/CustomCursor'));
const AnimatedBackground = lazy(() => import('./components/ui/AnimatedBackground'));
const FloatingElements = lazy(() => import('./components/ui/FloatingElements'));
const ParticleField = lazy(() => import('./components/ui/ParticleField'));

function App() {
  const location = useLocation();
  
  // Pages that should not show navbar and footer
  const authPages = ['/login', '/signup'];
  const isAuthPage = authPages.includes(location.pathname);

  // Only show heavy visuals on the client and on larger screens
  const [mounted, setMounted] = useState(false);
  const [showVisuals, setShowVisuals] = useState(false);
  useEffect(() => {
    setMounted(true);
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(min-width: 768px)');
    const apply = () => setShowVisuals(mq.matches && !navigator?.connection?.saveData);
    apply();
    try {
      mq.addEventListener('change', apply);
    } catch (e) {
      mq.addListener(apply);
    }
    return () => {
      try { mq.removeEventListener('change', apply); } catch (e) { mq.removeListener(apply); }
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-black relative overflow-x-hidden">
      {!isAuthPage && mounted && showVisuals && (
        <>
          <Suspense fallback={null}>
            <ErrorBoundary>
              <AnimatedBackground />
            </ErrorBoundary>
            <ErrorBoundary>
              <FloatingElements />
            </ErrorBoundary>
            <ErrorBoundary>
              <ParticleField />
            </ErrorBoundary>
          </Suspense>
          <ScrollProgress />
        </>
      )}

      {/* Custom cursor is visual-only; lazy-load and only mount on larger screens */}
      {mounted && showVisuals && (
        <Suspense fallback={null}>
          <ErrorBoundary>
            <CustomCursor />
          </ErrorBoundary>
        </Suspense>
      )}
      
      {!isAuthPage && (
        <>
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-white p-2 rounded shadow-lg">Skip to content</a>
          <Navbar />
        </>
      )}
      
      <main id="main-content" role="main" className={!isAuthPage ? "flex-grow pt-24" : "flex-grow"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<RequireAuth><Services /></RequireAuth>} />
          <Route path="/bookings" element={<RequireAuth><Bookings /></RequireAuth>} />
          <Route path="/booking-confirmation" element={<RequireAuth><BookingConfirmation /></RequireAuth>} />
          <Route path="/admin" element={<RequireAuth><AdminDashboard /></RequireAuth>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/mpesa-test" element={<MpesaTestPage />} />
        </Routes>
      </main>
      
      {!isAuthPage && <Footer />}
      <Analytics />
    </div>
  );
}

export default App;
