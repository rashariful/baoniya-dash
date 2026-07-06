import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    // Trigger animation after mount
    setTimeout(() => setIsVisible(true), 100);
  }, [location.pathname]);

  // Floating animation for background elements
  const floatingElements = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 5}s`,
    duration: `${3 + Math.random() * 4}s`,
    size: `${20 + Math.random() * 60}px`,
  }));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingElements.map((el) => (
          <div
            key={el.id}
            className="absolute rounded-full bg-gradient-to-r from-purple-200/30 to-pink-200/30 animate-float"
            style={{
              left: el.left,
              bottom: `-${el.size}`,
              width: el.size,
              height: el.size,
              animationDelay: el.delay,
              animationDuration: el.duration,
            }}
          />
        ))}
      </div>

      {/* Animated Gradient Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl animate-pulse-slow animation-delay-1000" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-300/10 rounded-full blur-3xl animate-spin-slow" />

      {/* Main Content */}
      <div
        className={`relative transform transition-all duration-700 ease-out ${
          isVisible
            ? "translate-y-0 opacity-100 scale-100"
            : "translate-y-10 opacity-0 scale-95"
        }`}
      >
        <div className="text-center p-8 md:p-12 bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 max-w-lg mx-4">
          {/* Animated 404 Number */}
          <div className="relative mb-6">
            <h1 className="text-8xl md:text-9xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent animate-gradient">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-purple-500/10 rounded-full blur-2xl animate-ping-slow" />
            </div>
          </div>

          {/* Animated Icon */}
          <div className="mb-6 animate-bounce-slow">
            <div className="inline-flex p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full">
              <i className="fas fa-compass text-5xl text-purple-600"></i>
            </div>
          </div>

          {/* Error Message */}
          <p className="text-2xl md:text-3xl font-bold text-gray-800 mb-3 animate-fade-in-up">
            Oops! Page not found
          </p>
          <p className="text-gray-600 mb-8 animate-fade-in-up animation-delay-200">
            The page you're looking for doesn't exist or has been moved.
          </p>

          {/* Path Display (optional) */}
          <div className="mb-8 p-3 bg-gray-50 rounded-lg inline-block animate-fade-in-up animation-delay-400">
            <code className="text-sm text-gray-500">
              <i className="fas fa-link mr-2"></i>
              {location.pathname}
            </code>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-600">
            <button
              onClick={() => navigate("/dashboard/home")}
              className="group px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <i className="fas fa-home group-hover:animate-bounce"></i>
              Return to Home
            </button>
            <button
              onClick={() => navigate(-1)}
              className="group px-8 py-3 bg-white text-gray-700 rounded-xl font-semibold border-2 border-gray-300 hover:border-purple-500 hover:text-purple-600 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <i className="fas fa-arrow-left group-hover:translate-x-[-4px] transition-transform"></i>
              Go Back
            </button>
          </div>

          {/* Helpful Links */}
          <div className="mt-8 pt-6 border-t border-gray-200 animate-fade-in-up animation-delay-800">
            <p className="text-sm text-gray-500 mb-3">Try these helpful links:</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => navigate("/dashboard")}
                className="text-sm text-purple-600 hover:text-purple-800 transition-colors flex items-center gap-1"
              >
                <i className="fas fa-tachometer-alt"></i>
                Dashboard
              </button>
              <span className="text-gray-300">•</span>
              <button
                onClick={() => navigate("/profile")}
                className="text-sm text-purple-600 hover:text-purple-800 transition-colors flex items-center gap-1"
              >
                <i className="fas fa-user"></i>
                Profile
              </button>
              <span className="text-gray-300">•</span>
              <button
                onClick={() => navigate("/settings")}
                className="text-sm text-purple-600 hover:text-purple-800 transition-colors flex items-center gap-1"
              >
                <i className="fas fa-cog"></i>
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
          }
        }

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.05);
          }
        }

        @keyframes spin-slow {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        @keyframes ping-slow {
          0% {
            transform: scale(0.8);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: float ease-in-out infinite;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }

        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
        }

        .animation-delay-800 {
          animation-delay: 0.8s;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default NotFound;