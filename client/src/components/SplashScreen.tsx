import { useEffect } from "react";
import { useLocation } from "wouter";

export default function SplashScreen() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLocation("/login");
    }, 2000);

    return () => clearTimeout(timer);
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-light/20 to-primary-dark/20"></div>
      <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
      <div className="absolute bottom-40 right-8 w-24 h-24 bg-white/5 rounded-full animate-pulse delay-1000"></div>
      
      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center animate-fade-in">
        {/* KIT Logo placeholder */}
        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-8 shadow-lg">
          <span className="text-white text-3xl font-bold">KIT</span>
        </div>
        
        {/* App Title */}
        <h1 className="text-4xl font-bold text-white mb-4 tracking-wide">
          KIT-Canteen
        </h1>
        
        {/* Subtitle */}
        <p className="text-white/80 text-lg font-medium">
          Powered by KIT College
        </p>
        
        {/* Loading indicator */}
        <div className="mt-12 flex space-x-2">
          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    </div>
  );
}