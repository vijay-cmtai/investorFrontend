import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Flame, X, ArrowRight } from "lucide-react";

const HotDealsPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); 

  useEffect(() => {

    setIsVisible(false);

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [location.pathname]); 

  const handleDismiss = () => {
    setIsVisible(false);
  };

  const handleNavigate = () => {
    navigate("/hot-deals");
    handleDismiss();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="fixed bottom-6 right-6 z-50 w-full max-w-md bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
        >
          <div className="grid grid-cols-3">
            <div className="col-span-1">
              <img
                src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1974&auto=format=fit=crop"
                alt="Hot Deal Property"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="col-span-2 p-6 relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-7 w-7 text-gray-400 hover:bg-gray-100 hover:text-gray-800 rounded-full"
                onClick={handleDismiss}
              >
                <X className="w-4 h-4" />
              </Button>

              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-red-600" />
                <span className="text-sm font-bold text-red-600 uppercase tracking-wider">
                  Hot Deals
                </span>
              </div>

              <h3 className="font-bold text-xl text-gray-900 mt-2">
                Exclusive Offers Await!
              </h3>
              <p className="text-sm text-gray-600 mt-1 mb-4">
                Grab limited-time deals on premium properties before they're
                gone.
              </p>

              <Button
                className="w-full bg-red-600 text-white hover:bg-red-700 group"
                onClick={handleNavigate}
              >
                Explore Now
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HotDealsPopup;
