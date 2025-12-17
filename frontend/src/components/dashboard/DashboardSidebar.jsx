import React from "react";
import { SiOpenai, SiAnydesk, SiYoutube } from "react-icons/si";
import { FaProjectDiagram } from "react-icons/fa";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const DashboardSidebar = () => {
  const handleAnyDeskClick = (e) => {
    e.preventDefault();
    window.location.href = "anydesk:";

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "info",
      title: "Abriendo AnyDesk...",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  };

  return (
    <motion.aside
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full lg:w-20 flex-shrink-0"
    >
      <div className="bg-white shadow-lg rounded-2xl p-4 sticky top-24 flex flex-col items-center gap-4 border border-gray-100">
        <div className="p-2 bg-indigo-50 rounded-xl mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-indigo-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            />
          </svg>
        </div>

        <div className="flex flex-col gap-4 w-full">
          {/* ChatGPT */}
          <a
            href="https://chat.openai.com/"
            target="_blank"
            rel="noopener noreferrer"
            title="ChatGPT"
            className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-50 text-gray-600 hover:bg-green-100 hover:text-green-600 hover:scale-110 hover:shadow-md transition-all duration-300 mx-auto"
          >
            <SiOpenai size={24} />
          </a>

          {/* Fast.com */}
          <a
            href="https://fast.com/es/"
            target="_blank"
            rel="noopener noreferrer"
            title="Fast.com"
            className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-50 text-gray-800 hover:bg-black hover:text-white hover:scale-110 hover:shadow-md transition-all duration-300 mx-auto font-bold text-[10px]"
          >
            FAST
          </a>

          {/* AnyDesk */}
          <a
            href="anydesk:"
            onClick={handleAnyDeskClick}
            title="AnyDesk"
            className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-50 text-gray-600 hover:bg-red-100 hover:text-red-600 hover:scale-110 hover:shadow-md transition-all duration-300 mx-auto"
          >
            <SiAnydesk size={24} />
          </a>

          {/* YouTube */}
          <a
            href="https://www.youtube.com/"
            target="_blank"
            rel="noopener noreferrer"
            title="YouTube"
            className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-50 text-gray-600 hover:bg-red-100 hover:text-red-600 hover:scale-110 hover:shadow-md transition-all duration-300 mx-auto"
          >
            <SiYoutube size={24} />
          </a>

          {/* Lucidchart */}
          <a
            href="https://www.lucidchart.com/"
            target="_blank"
            rel="noopener noreferrer"
            title="Lucidchart"
            className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-50 text-gray-600 hover:bg-orange-100 hover:text-orange-600 hover:scale-110 hover:shadow-md transition-all duration-300 mx-auto"
          >
            <FaProjectDiagram size={24} />
          </a>

          {/* SHC */}
          <a
            href="https://shc.ms.gba.gov.ar/auth/login"
            target="_blank"
            rel="noopener noreferrer"
            title="SHC"
            className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-purple-100 hover:scale-110 hover:shadow-md transition-all duration-300 mx-auto p-2"
          >
            <img
              src="/HSI_Logo.png"
              alt="SHC"
              className="w-full h-full object-contain"
            />
          </a>
        </div>
      </div>
    </motion.aside>
  );
};

export default DashboardSidebar;
