import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Html5Qrcode } from "html5-qrcode";
import jsQR from "jsqr";
import {
  Camera,
  Image as ImageIcon,
  Hash,
  RefreshCw,
  Check,
  X,
  Upload,
} from "lucide-react";
import { useThemeProvider } from "../contexts/ThemeProvider";

const TicketValidation = () => {
  const [ticketId, setTicketId] = useState("");
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scanMode, setScanMode] = useState("manual"); // "manual", "camera", or "gallery"
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef(null);
  const qrContainerRef = useRef(null);
  const html5QrCodeRef = useRef(null);
  const { currentTheme } = useThemeProvider();

  const isDarkMode = currentTheme === "dark";

  // Initialize and cleanup HTML5 QR code scanner
  useEffect(() => {
    let html5QrCode = null;

    if (showCamera && qrContainerRef.current) {
      html5QrCode = new Html5Qrcode("qr-reader");
      html5QrCodeRef.current = html5QrCode;

      const cameraConfig = { facingMode: "environment" }; // Only use facingMode

      // Define QR box size based on viewport
      const viewportWidth = Math.min(window.innerWidth, 500); // Limit to 500px max
      const qrboxSize = Math.min(viewportWidth - 40, 250); // 20px padding on each side

      html5QrCode
        .start(
          cameraConfig,
          {
            fps: 10,
            qrbox: qrboxSize,
          },
          onScanSuccess,
          onScanError
        )
        .catch((err) => {
          console.error("Error starting QR scanner:", err);
          setError("Failed to start camera. Please check permissions.");
        });
    }

    // Cleanup function
    return () => {
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        html5QrCodeRef.current
          .stop()
          .catch((err) => console.error("Error stopping QR scanner:", err));
      }
    };
  }, [showCamera]);

  const validateTicket = async (id) => {
    setLoading(true);
    setError(null);
    setScanResult(null);

    try {
      // Fix the axios request structure - payload is the second parameter
      const response = await axios.post(
        "http://localhost:5000/api/tickets/validate",
        { ticketId: id },
        { withCredentials: true }
      );

      setScanResult({
        valid: true,
        message: response.data.message,
        details: response.data.ticketDetails,
      });
    } catch (error) {
      console.error("Error validating ticket:", error);
      if (error.response && error.response.data) {
        setScanResult({
          valid: false,
          message: error.response.data.message,
          scannedAt: error.response.data.scannedAt,
        });
      } else {
        setError("Failed to validate ticket. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!ticketId.trim()) {
      setError("Please enter a ticket ID");
      return;
    }

    await validateTicket(ticketId);
  };

  const onScanSuccess = (decodedText) => {
    try {
      // First try to parse as JSON
      let ticketIdentifier = decodedText;

      try {
        const parsedData = JSON.parse(decodedText);
        if (parsedData.ticketId) {
          ticketIdentifier = parsedData.ticketId;
        }
      } catch (jsonError) {
        // Not JSON, use as plain text
        console.log("Not JSON format, using as direct ticket ID");
      }

      // Stop scanning once we have a result
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        html5QrCodeRef.current.stop().then(() => {
          setTicketId(ticketIdentifier);
          validateTicket(ticketIdentifier);
        });
      }
    } catch (error) {
      console.error("Error processing QR code data:", error);
      setError("Invalid QR code format");
    }
  };

  const onScanError = (err) => {
    // We don't need to show errors for each failed scan attempt
    console.debug("QR scan error:", err);
  };

  const openGallery = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    // Create a FileReader to read the image file
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        try {
          // Create a canvas to draw the image
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // Set canvas dimensions to match image dimensions
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;

          // Draw the image to the canvas
          ctx.drawImage(img, 0, 0);

          // Get image data from the full canvas
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

          // Try to find QR code in the image data
          const code = jsQR(imageData.data, imageData.width, imageData.height);

          if (code) {
            // Process the QR code data (try parsing as JSON if applicable)
            let ticketIdentifier = code.data;
            try {
              const parsedData = JSON.parse(code.data);
              if (parsedData.ticketId) {
                ticketIdentifier = parsedData.ticketId;
              }
            } catch (jsonError) {
              // Not JSON, use as plain text
              console.log(
                "QR code is not in JSON format, using as direct ticket ID"
              );
            }

            setTicketId(ticketIdentifier);
            validateTicket(ticketIdentifier);
          } else {
            // If no QR code found, try with different scaling
            console.log(
              "No QR code found in original size, trying with scaling..."
            );

            // Try with a scaled version of the image
            tryWithScaledImage(img);
          }
        } catch (err) {
          console.error("Error processing image with jsQR:", err);
          setError("Error processing image. Please try another image.");
          setLoading(false);
        }
      };

      img.onerror = () => {
        setError("Failed to load the image. Please try another image.");
        setLoading(false);
      };

      img.src = event.target.result;
    };

    reader.onerror = () => {
      setError("Failed to read the file. Please try again.");
      setLoading(false);
    };

    reader.readAsDataURL(file);

    // Reset the file input so the same file can be selected again
    e.target.value = "";
  };

  // Function to try scanning with a scaled version of the image
  const tryWithScaledImage = (img) => {
    // Create a canvas with fixed size for scaling
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Try different sizes
    const sizes = [800, 600, 400];

    // Try to detect QR code at different scales
    for (const size of sizes) {
      canvas.width = size;
      canvas.height = size;

      // Clear canvas and draw image scaled to this size
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Calculate scaling to maintain aspect ratio
      const scale = Math.min(size / img.naturalWidth, size / img.naturalHeight);
      const scaledWidth = img.naturalWidth * scale;
      const scaledHeight = img.naturalHeight * scale;

      // Center the image on the canvas
      const x = (size - scaledWidth) / 2;
      const y = (size - scaledHeight) / 2;

      // Draw the image scaled
      ctx.drawImage(img, x, y, scaledWidth, scaledHeight);

      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // Try to find QR code
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        // Process the QR code data
        let ticketIdentifier = code.data;
        try {
          const parsedData = JSON.parse(code.data);
          if (parsedData.ticketId) {
            ticketIdentifier = parsedData.ticketId;
          }
        } catch (jsonError) {
          // Not JSON, use as plain text
        }

        setTicketId(ticketIdentifier);
        validateTicket(ticketIdentifier);
        return; // Exit as we've found a QR code
      }
    }

    // If we reach here, no QR code was found at any scale
    setError(
      "No QR code found in the image. Please try a clearer image or a different scan method."
    );
    setLoading(false);
  };

  // For resetting the scanner
  const resetScanner = () => {
    // Stop scanning if active
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      html5QrCodeRef.current
        .stop()
        .catch((err) => console.error("Error stopping scanner:", err));
    }

    setScanResult(null);
    setTicketId("");
    setError(null);
    setShowCamera(false);
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Main Content */}
      <main className="container mx-auto py-6 px-4 max-w-md">
        {/* Title Section */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-2 rounded-full bg-purple-100 text-purple-700 mb-4">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="7" width="18" height="14" rx="2"></rect>
              <polyline points="16 3 16 7"></polyline>
              <line x1="8" y1="3" x2="8" y2="7"></line>
              <path d="M3 11h18"></path>
              <rect x="7" y="14" width="3" height="3"></rect>
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Ticket Scanner</h2>
          <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            Verify concert tickets quickly and securely
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            className={`mb-4 p-4 rounded-lg ${
              isDarkMode ? "bg-red-900 text-red-300" : "bg-red-100 text-red-800"
            }`}
          >
            <div className="flex items-center">
              <X size={20} className="mr-2" />
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Scanner Container */}
        <div
          className={`rounded-lg p-4 mb-6 shadow-md border ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          {/* Result Display */}
          {scanResult && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                scanResult.valid
                  ? isDarkMode
                    ? "bg-green-900 text-green-300"
                    : "bg-green-100 text-green-800"
                  : isDarkMode
                  ? "bg-red-900 text-red-300"
                  : "bg-red-100 text-red-800"
              }`}
            >
              <div className="flex items-center justify-center mb-4">
                {scanResult.valid ? (
                  <div
                    className={`p-3 rounded-full ${
                      isDarkMode ? "bg-green-700" : "bg-green-200"
                    }`}
                  >
                    <Check size={32} className="text-green-500" />
                  </div>
                ) : (
                  <div
                    className={`p-3 rounded-full ${
                      isDarkMode ? "bg-red-700" : "bg-red-200"
                    }`}
                  >
                    <X size={32} className="text-red-500" />
                  </div>
                )}
              </div>

              <h3 className="text-lg font-bold text-center">
                {scanResult.message}
              </h3>

              {scanResult.valid && scanResult.details && (
                <div
                  className={`mt-4 p-4 rounded-lg ${
                    isDarkMode ? "bg-gray-700" : "bg-white"
                  }`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold">Ticket Details</h4>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        isDarkMode
                          ? "bg-purple-800 text-purple-200"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      Valid Entry
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div>
                      <p
                        className={`text-xs ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Zone
                      </p>
                      <p className="font-medium">{scanResult.details.zone}</p>
                    </div>

                    <div>
                      <p
                        className={`text-xs ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Customer
                      </p>
                      <p className="font-medium">
                        {scanResult.details.customerName}
                      </p>
                    </div>

                    <div>
                      <p
                        className={`text-xs ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Purchase Date
                      </p>
                      <p className="font-medium">
                        {new Date(scanResult.details.scannedAt).toLocaleString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`p-3 rounded-lg ${
                      isDarkMode ? "bg-gray-800" : "bg-gray-100"
                    } text-center`}
                  >
                    <p
                      className={`text-sm font-bold ${
                        isDarkMode ? "text-purple-300" : "text-purple-700"
                      }`}
                    >
                      Ticket ID: {ticketId}
                    </p>
                  </div>
                </div>
              )}

              {!scanResult.valid && scanResult.scannedAt && (
                <div
                  className={`mt-4 p-4 rounded-lg ${
                    isDarkMode ? "bg-gray-700" : "bg-white"
                  }`}
                >
                  <p
                    className={`text-xs ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Previously scanned on
                  </p>
                  <p className="font-medium">
                    {new Date(scanResult.scannedAt).toLocaleString()}
                  </p>
                </div>
              )}

              <button
                onClick={resetScanner}
                className="mt-4 w-full py-2 px-4 rounded-lg flex justify-center items-center space-x-2 transition-colors bg-purple-600 hover:bg-purple-700 text-white"
              >
                <RefreshCw size={16} />
                <span>Scan Another Ticket</span>
              </button>
            </div>
          )}

          {!scanResult && (
            <>
              {/* Tabs */}
              <div className="flex border-b mb-4">
                <button
                  onClick={() => {
                    setScanMode("manual");
                    setShowCamera(false);
                  }}
                  className={`flex-1 py-2 px-4 text-center relative ${
                    scanMode === "manual"
                      ? "border-purple-600 dark:border-purple-500"
                      : "border-transparent"
                  } border-b-2`}
                >
                  <div className="flex justify-center items-center space-x-2">
                    <Hash size={16} />
                    <span>Manual</span>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setScanMode("camera");
                    setShowCamera(true);
                  }}
                  className={`flex-1 py-2 px-4 text-center relative ${
                    scanMode === "camera"
                      ? "border-purple-600 dark:border-purple-500"
                      : "border-transparent"
                  } border-b-2`}
                >
                  <div className="flex justify-center items-center space-x-2">
                    <Camera size={16} />
                    <span>Camera</span>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setScanMode("gallery");
                    openGallery();
                  }}
                  className={`flex-1 py-2 px-4 text-center relative ${
                    scanMode === "gallery"
                      ? "border-purple-600 dark:border-purple-500"
                      : "border-transparent"
                  } border-b-2`}
                >
                  <div className="flex justify-center items-center space-x-2">
                    <ImageIcon size={16} />
                    <span>Upload</span>
                  </div>
                </button>
              </div>

              {/* Tab Content */}
              <div className="py-2">
                {scanMode === "camera" && (
                  <div className="text-center">
                    {showCamera ? (
                      <div className="mb-4">
                        <div className="relative rounded-lg overflow-hidden aspect-square mb-4 bg-gray-200 dark:bg-gray-700">
                          {/* The div where html5-qrcode will be rendered */}
                          <div
                            id="qr-reader"
                            ref={qrContainerRef}
                            className="w-full h-full"
                          ></div>
                          {/* Add scanning visual indicator overlay */}
                          <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none flex items-center justify-center">
                            <div className="border-2 border-purple-500 w-1/2 h-1/2 opacity-70 rounded-lg">
                              <div className="w-full h-full border-2 border-dashed border-white opacity-60 rounded-lg"></div>
                            </div>
                          </div>
                        </div>
                        <p
                          className={`text-sm mb-4 ${
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          Position the QR code inside the box
                        </p>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowCamera(true)}
                        className={`w-full py-8 border-2 border-dashed rounded-lg flex flex-col justify-center items-center space-y-2 transition-colors
                          ${
                            isDarkMode
                              ? "border-gray-600 hover:border-purple-500 bg-gray-700 hover:bg-gray-600"
                              : "border-gray-300 hover:border-purple-400 bg-gray-100 hover:bg-gray-200"
                          }`}
                      >
                        <Camera
                          size={48}
                          className={
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }
                        />
                        <span className="font-medium">
                          Click to Start Camera
                        </span>
                      </button>
                    )}
                  </div>
                )}

                {scanMode === "gallery" && (
                  <div className="text-center">
                    <label
                      htmlFor="file-upload"
                      className={`w-full py-8 border-2 border-dashed rounded-lg flex flex-col justify-center items-center space-y-2 cursor-pointer transition-colors
                        ${
                          isDarkMode
                            ? "border-gray-600 hover:border-purple-500 bg-gray-700 hover:bg-gray-600"
                            : "border-gray-300 hover:border-purple-400 bg-gray-100 hover:bg-gray-200"
                        }`}
                    >
                      <Upload
                        size={48}
                        className={
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }
                      />
                      <span className="font-medium">
                        {loading ? (
                          <span className="flex items-center justify-center">
                            <RefreshCw
                              size={16}
                              className="animate-spin mr-2"
                            />
                            Processing...
                          </span>
                        ) : (
                          "Upload QR Code Image"
                        )}
                      </span>
                      <p
                        className={`text-xs ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Click or drag image here
                      </p>
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleFileUpload}
                      disabled={loading}
                    />
                  </div>
                )}

                {scanMode === "manual" && (
                  <div>
                    <form onSubmit={handleSubmit}>
                      <label className="block mb-2 text-sm font-medium">
                        Enter Ticket ID
                      </label>
                      <input
                        type="text"
                        value={ticketId}
                        onChange={(e) => setTicketId(e.target.value)}
                        placeholder="Enter ticket ID"
                        className={`w-full p-2 mb-4 border rounded-lg
                          ${
                            isDarkMode
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "bg-white border-gray-300 text-gray-900"
                          }`}
                        disabled={loading}
                      />
                      <button
                        type="submit"
                        className="w-full py-2 px-4 rounded-lg flex justify-center items-center transition-colors bg-purple-600 hover:bg-purple-700 text-white"
                        disabled={loading || !ticketId.trim()}
                      >
                        {loading ? (
                          <span className="flex items-center">
                            <RefreshCw
                              size={16}
                              className="animate-spin mr-2"
                            />
                            Validating...
                          </span>
                        ) : (
                          <span>Validate Ticket</span>
                        )}
                      </button>
                    </form>
                  </div>
                )}

                {ticketId && !scanResult && !loading && (
                  <div
                    className={`mt-4 p-3 rounded-lg ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-sm ${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        Ticket ID:
                      </span>
                      <span className="font-mono font-bold">{ticketId}</span>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Event Information */}
        <div
          className={`rounded-lg overflow-hidden shadow-md mb-6 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div
            className={`p-4 border-b ${
              isDarkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <h3 className="text-lg font-bold mb-2">Event Information</h3>
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Important details for event staff
            </p>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex items-start">
              <div
                className={`p-2 rounded-full ${
                  isDarkMode
                    ? "bg-purple-900 text-purple-300"
                    : "bg-purple-100 text-purple-700"
                } mr-3`}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <div>
                <h4 className="font-medium">Event Timing</h4>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Doors open: 6:30 PM
                  <br />
                  Concert begins: 8:00 PM
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div
                className={`p-2 rounded-full ${
                  isDarkMode
                    ? "bg-purple-900 text-purple-300"
                    : "bg-purple-100 text-purple-700"
                } mr-3`}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                </svg>
              </div>
              <div>
                <h4 className="font-medium">Validation Rules</h4>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Each ticket can only be scanned once
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div
                className={`p-2 rounded-full ${
                  isDarkMode
                    ? "bg-purple-900 text-purple-300"
                    : "bg-purple-100 text-purple-700"
                } mr-3`}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <div>
                <h4 className="font-medium">Location & Access</h4>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Staff entrance: North Gate
                  <br />
                  Main entrance: East and West Gates
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TicketValidation;
