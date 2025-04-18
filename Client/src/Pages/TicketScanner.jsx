
import { useState, useEffect, useRef } from 'react';
import { useThemeProvider } from '../contexts/ThemeProvider';
import { Camera, Image, Sun, Moon, TicketIcon, UploadCloud, Hash, Check, X, RefreshCw, Calendar, Clock, MapPin, Music, Star, Volume2 } from 'lucide-react';

export default function TicketScanner() {
  const { currentTheme, changeCurrentTheme } = useThemeProvider();
  const [activeTab, setActiveTab] = useState('camera');
  const [scanResult, setScanResult] = useState(null);
  const [manualToken, setManualToken] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Toggle theme between light and dark
  const toggleTheme = () => {
    changeCurrentTheme(currentTheme === 'dark' ? 'light' : 'dark');
  };

  // Handle camera initialization
  useEffect(() => {
    if (activeTab === 'camera' && showCamera) {
      startCamera();
    } else {
      stopCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [activeTab, showCamera]);

  const startCamera = async () => {
    try {
      const constraints = {
        video: { facingMode: 'environment' }
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  // Mock function to simulate QR code scanning
  const scanQrCode = () => {
    setIsVerifying(true);
    // Simulate scanning delay
    setTimeout(() => {
      const mockTicketCode = "NGTC-" + Math.floor(100000 + Math.random() * 900000);
      setScanResult(mockTicketCode);
      verifyTicket(mockTicketCode);
    }, 1500);
  };

  // Mock function to handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsVerifying(true);
      // Simulate processing delay
      setTimeout(() => {
        const mockTicketCode = "NGTC-" + Math.floor(100000 + Math.random() * 900000);
        setScanResult(mockTicketCode);
        verifyTicket(mockTicketCode);
      }, 1500);
    }
  };

  // Handle manual token submission
  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualToken.trim()) {
      setIsVerifying(true);
      setScanResult(manualToken);
      verifyTicket(manualToken);
    }
  };

  // Mock function to verify ticket with backend
  const verifyTicket = (code) => {
    // Simulate API call to backend
    setTimeout(() => {
      const isValid = Math.random() > 0.3; // 70% chance of valid ticket
      setVerificationResult({
        valid: isValid,
        message: isValid ? 
          "Ticket verified successfully!" : 
          "Invalid ticket or already used.",
        ticketDetails: isValid ? {
          eventName: "Nikita Gandhi: Harmonic Rhapsody Tour",
          ticketType: "VIP Concert Access",
          eventDate: "April 25, 2025",
          venue: "Stellar Arena",
          attendeeName: "John Doe",
          section: "Front Orchestra",
          row: "A",
          seat: "12"
        } : null
      });
      setIsVerifying(false);
    }, 1000);
  };

  // Reset scanner state
  const resetScanner = () => {
    setScanResult(null);
    setVerificationResult(null);
    setManualToken('');
    setShowCamera(false);
  };

  return (
    <div className={`min-h-screen ${currentTheme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Header */}
      <header className={`p-4 ${currentTheme === 'dark' ? 'bg-purple-900' : 'bg-purple-600'} shadow-md`}>
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Music size={24} className="text-white" />
            <h1 className="text-xl font-bold text-white">MelodyPass</h1>
          </div>
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full hover:bg-opacity-20 hover:bg-white transition-colors text-white"
          >
            {currentTheme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </header>

      {/* Banner */}
      <div className={`relative ${currentTheme === 'dark' ? 'bg-purple-900' : 'bg-purple-600'} overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-800 to-pink-500 opacity-80"></div>
        <div className="absolute inset-0 bg-[url('/api/placeholder/1200/400')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="container mx-auto px-4 py-8 relative">
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <div className="w-full h-full bg-[url('/api/placeholder/300/300')] bg-cover bg-center"></div>
            </div>
            <div className="md:ml-6 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Nikita Gandhi</h1>
              <h2 className="text-xl text-white opacity-90 mb-2">Harmonic Rhapsody Tour</h2>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 md:gap-4 text-sm text-white">
                <div className="flex items-center">
                  <Calendar size={16} className="mr-1" />
                  <span>April 25, 2025</span>
                </div>
                <div className="flex items-center">
                  <Clock size={16} className="mr-1" />
                  <span>8:00 PM</span>
                </div>
                <div className="flex items-center">
                  <MapPin size={16} className="mr-1" />
                  <span>Stellar Arena</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`h-6 ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-white'} rounded-t-3xl -mb-1`}></div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto py-6 px-4 max-w-md">
        {/* Title Section */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-2 rounded-full bg-purple-100 text-purple-700 mb-4">
            <TicketIcon size={24} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Ticket Scanner</h2>
          <p className={`${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Verify concert tickets quickly and securely
          </p>
        </div>

        {/* Scanner Container */}
        <div className={`rounded-lg p-4 mb-6 ${currentTheme === 'dark' ? 'bg-gray-800 shadow-xl' : 'bg-gray-50 shadow-md'} border ${currentTheme === 'dark' ? 'border-purple-800' : 'border-purple-200'}`}>
          {/* Result Display */}
          {verificationResult && (
            <div className={`mb-6 p-4 rounded-lg ${verificationResult.valid ? 
              (currentTheme === 'dark' ? 'bg-green-900' : 'bg-green-100') : 
              (currentTheme === 'dark' ? 'bg-red-900' : 'bg-red-100')}`}
            >
              <div className="flex items-center justify-center mb-4">
                {verificationResult.valid ? (
                  <div className={`p-3 rounded-full ${currentTheme === 'dark' ? 'bg-green-700' : 'bg-green-200'}`}>
                    <Check size={32} className="text-green-500" />
                  </div>
                ) : (
                  <div className={`p-3 rounded-full ${currentTheme === 'dark' ? 'bg-red-700' : 'bg-red-200'}`}>
                    <X size={32} className="text-red-500" />
                  </div>
                )}
              </div>
              
              <h3 className={`text-lg font-bold text-center ${verificationResult.valid ? 
                (currentTheme === 'dark' ? 'text-green-300' : 'text-green-800') : 
                (currentTheme === 'dark' ? 'text-red-300' : 'text-red-800')}`}>
                {verificationResult.message}
              </h3>
              
              {verificationResult.valid && verificationResult.ticketDetails && (
                <div className={`mt-4 p-4 rounded-lg ${currentTheme === 'dark' ? 'bg-gray-700' : 'bg-white'} relative overflow-hidden`}>
                  {/* Decorative music notes */}
                  <div className="absolute top-0 right-0 opacity-5">
                    <Music size={80} />
                  </div>

                  <div className="relative">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-bold">Ticket Details</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${currentTheme === 'dark' ? 'bg-purple-800 text-purple-200' : 'bg-purple-100 text-purple-800'}`}>
                        VIP Access
                      </span>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div>
                        <p className={`text-xs ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Event</p>
                        <p className="font-medium">{verificationResult.ticketDetails.eventName}</p>
                      </div>
                      
                      <div className="flex space-x-4">
                        <div className="flex-1">
                          <p className={`text-xs ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Date</p>
                          <p className="font-medium">{verificationResult.ticketDetails.eventDate}</p>
                        </div>
                        <div className="flex-1">
                          <p className={`text-xs ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Venue</p>
                          <p className="font-medium">{verificationResult.ticketDetails.venue}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className={`text-xs ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Attendee</p>
                        <p className="font-medium">{verificationResult.ticketDetails.attendeeName}</p>
                      </div>
                      
                      <div className="flex space-x-4">
                        <div className="flex-1">
                          <p className={`text-xs ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Section</p>
                          <p className="font-medium">{verificationResult.ticketDetails.section}</p>
                        </div>
                        <div className="flex-1">
                          <p className={`text-xs ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Row</p>
                          <p className="font-medium">{verificationResult.ticketDetails.row}</p>
                        </div>
                        <div className="flex-1">
                          <p className={`text-xs ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Seat</p>
                          <p className="font-medium">{verificationResult.ticketDetails.seat}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`p-3 rounded-lg ${currentTheme === 'dark' ? 'bg-gray-800' : 'bg-purple-50'} text-center`}>
                      <p className={`text-sm font-bold ${currentTheme === 'dark' ? 'text-purple-300' : 'text-purple-700'}`}>
                        Ticket ID: {scanResult}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <button 
                onClick={resetScanner}
                className={`mt-4 w-full py-2 px-4 rounded-lg flex justify-center items-center space-x-2 transition-colors ${
                  currentTheme === 'dark' ? 
                  'bg-purple-700 hover:bg-purple-800 text-white' : 
                  'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
              >
                <RefreshCw size={16} />
                <span>Scan Another Ticket</span>
              </button>
            </div>
          )}

          {!verificationResult && (
            <>
              {/* Tabs */}
              <div className="flex border-b mb-4">
                <button
                  onClick={() => { setActiveTab('camera'); setScanResult(null); }}
                  className={`flex-1 py-2 px-4 text-center relative ${
                    activeTab === 'camera' ? 
                    (currentTheme === 'dark' ? 'border-purple-500' : 'border-purple-600') : 
                    'border-transparent'
                  } border-b-2`}
                >
                  <div className="flex justify-center items-center space-x-2">
                    <Camera size={16} />
                    <span>Camera</span>
                  </div>
                </button>
                <button
                  onClick={() => { setActiveTab('upload'); setScanResult(null); }}
                  className={`flex-1 py-2 px-4 text-center relative ${
                    activeTab === 'upload' ? 
                    (currentTheme === 'dark' ? 'border-purple-500' : 'border-purple-600') : 
                    'border-transparent'
                  } border-b-2`}
                >
                  <div className="flex justify-center items-center space-x-2">
                    <Image size={16} />
                    <span>Upload</span>
                  </div>
                </button>
                <button
                  onClick={() => { setActiveTab('manual'); setScanResult(null); }}
                  className={`flex-1 py-2 px-4 text-center relative ${
                    activeTab === 'manual' ? 
                    (currentTheme === 'dark' ? 'border-purple-500' : 'border-purple-600') : 
                    'border-transparent'
                  } border-b-2`}
                >
                  <div className="flex justify-center items-center space-x-2">
                    <Hash size={16} />
                    <span>Manual</span>
                  </div>
                </button>
              </div>

              {/* Tab Content */}
              <div className="py-2">
                {activeTab === 'camera' && (
                  <div className="text-center">
                    {showCamera ? (
                      <div className="mb-4">
                        <div className={`relative rounded-lg overflow-hidden aspect-video mb-4 ${currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                          <video 
                            ref={videoRef} 
                            autoPlay 
                            playsInline 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 border-2 border-purple-500 opacity-50"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-48 h-48 border-2 border-purple-500 rounded-lg"></div>
                          </div>
                        </div>
                        <p className={`text-sm mb-4 ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                          Position the QR code inside the box
                        </p>
                        <button
                          onClick={scanQrCode}
                          className={`w-full py-2 px-4 rounded-lg flex justify-center items-center transition-colors ${
                            currentTheme === 'dark' ? 
                            'bg-purple-700 hover:bg-purple-800 text-white' : 
                            'bg-purple-600 hover:bg-purple-700 text-white'
                          }`}
                          disabled={isVerifying}
                        >
                          {isVerifying ? (
                            <span className="flex items-center">
                              <RefreshCw size={16} className="animate-spin mr-2" />
                              Scanning...
                            </span>
                          ) : (
                            <span>Capture QR Code</span>
                          )}
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowCamera(true)}
                        className={`w-full py-8 border-2 border-dashed rounded-lg flex flex-col justify-center items-center space-y-2 transition-colors ${
                          currentTheme === 'dark' ? 
                          'border-gray-600 hover:border-purple-500 bg-gray-700 hover:bg-gray-600' : 
                          'border-gray-300 hover:border-purple-400 bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        <Camera size={48} className={currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
                        <span className="font-medium">Click to Start Camera</span>
                      </button>
                    )}
                  </div>
                )}

                {activeTab === 'upload' && (
                  <div className="text-center">
                    <label 
                      htmlFor="file-upload"
                      className={`w-full py-8 border-2 border-dashed rounded-lg flex flex-col justify-center items-center space-y-2 cursor-pointer transition-colors ${
                        currentTheme === 'dark' ? 
                        'border-gray-600 hover:border-purple-500 bg-gray-700 hover:bg-gray-600' : 
                        'border-gray-300 hover:border-purple-400 bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <UploadCloud size={48} className={currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
                      <span className="font-medium">
                        {isVerifying ? (
                          <span className="flex items-center justify-center">
                            <RefreshCw size={16} className="animate-spin mr-2" />
                            Processing...
                          </span>
                        ) : (
                          "Upload QR Code Image"
                        )}
                      </span>
                      <p className={`text-xs ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Click or drag image here
                      </p>
                    </label>
                    <input 
                      id="file-upload" 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleFileUpload}
                      disabled={isVerifying}
                    />
                  </div>
                )}

                {activeTab === 'manual' && (
                  <div>
                    <form onSubmit={handleManualSubmit}>
                      <label className="block mb-2 text-sm font-medium">
                        Enter Ticket Code
                      </label>
                      <input
                        type="text"
                        value={manualToken}
                        onChange={(e) => setManualToken(e.target.value)}
                        placeholder="e.g. NGTC-123456"
                        className={`w-full p-2 mb-4 border rounded-lg ${
                          currentTheme === 'dark' ? 
                          'bg-gray-700 border-gray-600 text-white' : 
                          'bg-white border-gray-300 text-gray-900'
                        }`}
                        disabled={isVerifying}
                      />
                      <button
                        type="submit"
                        className={`w-full py-2 px-4 rounded-lg flex justify-center items-center transition-colors ${
                          currentTheme === 'dark' ? 
                          'bg-purple-700 hover:bg-purple-800 text-white' : 
                          'bg-purple-600 hover:bg-purple-700 text-white'
                        }`}
                        disabled={isVerifying || !manualToken.trim()}
                      >
                        {isVerifying ? (
                          <span className="flex items-center">
                            <RefreshCw size={16} className="animate-spin mr-2" />
                            Verifying...
                          </span>
                        ) : (
                          <span>Verify Ticket</span>
                        )}
                      </button>
                    </form>
                  </div>
                )}

                {scanResult && !verificationResult && (
                  <div className={`mt-4 p-3 rounded-lg ${currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        Ticket code:
                      </span>
                      <span className="font-mono font-bold">{scanResult}</span>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Concert Information */}
        <div className={`rounded-lg overflow-hidden shadow-md mb-6 ${currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold mb-2">Concert Information</h3>
            <p className={`text-sm ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Important details for event staff
            </p>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex items-start">
              <div className={`p-2 rounded-full ${currentTheme === 'dark' ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-700'} mr-3`}>
                <Clock size={16} />
              </div>
              <div>
                <h4 className="font-medium">Event Timing</h4>
                <p className={`text-sm ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Doors open: 6:30 PM<br />
                  Concert begins: 8:00 PM
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className={`p-2 rounded-full ${currentTheme === 'dark' ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-700'} mr-3`}>
                <Volume2 size={16} />
              </div>
              <div>
                <h4 className="font-medium">Sound Check</h4>
                <p className={`text-sm ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Premium ticket holders can attend the sound check at 5:00 PM
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className={`p-2 rounded-full ${currentTheme === 'dark' ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-700'} mr-3`}>
                <MapPin size={16} />
              </div>
              <div>
                <h4 className="font-medium">Location & Access</h4>
                <p className={`text-sm ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Staff entrance: North Gate<br />
                  Main entrance: East and West Gates
                </p>
              </div>
            </div>
          </div>
        </div>

   
       
      </main>

      {/* Footer */}
      <footer className={`p-4 mt-8 ${currentTheme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
        <div className="container mx-auto text-center text-sm">
          <p>© 2025 EventScan - All rights reserved</p>
        </div>
      </footer>
    </div>
  );
}