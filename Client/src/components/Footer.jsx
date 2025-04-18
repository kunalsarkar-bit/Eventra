import auctionx from "../assets/android-chrome-192x192.png"
import eventraLogo from "../assets/Eventra Logo.png" // Assuming this is the path to your Eventra logo

export default function Footer({ currentTheme }) {
  return (
    <footer className={`p-4 mt-8 ${currentTheme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
      <div className="container mx-auto text-center text-sm">
        <div className="flex items-center justify-center mb-2">
          <a 
            href="https://auction-x-minor-project-2024.onrender.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <img 
              src={auctionx} 
              alt="Auction X Logo" 
              className="h-6 w-6 rounded-full object-cover mr-2" 
            />
            <span>In collaboration with Auction X</span>
          </a>
        </div>
        <div className="flex items-center justify-center">
          <img 
            src={eventraLogo} 
            alt="Eventra Logo" 
            className="h-6 w-auto object-cover mr-2" 
          />
          <p>© 2025 Eventra - All rights reserved</p>
        </div>
      </div>
    </footer>
  );
}