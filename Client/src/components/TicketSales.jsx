import { useState, useEffect } from "react";
import { useThemeProvider } from "../contexts/ThemeProvider";

import {
  TicketIcon,
  Download,
  FileSpreadsheet,
  RefreshCw,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import axios from "axios";

export default function TicketSalesPage() {
  const { currentTheme } = useThemeProvider();
  const [customerName, setCustomerName] = useState("");
  const [selectedZone, setSelectedZone] = useState("B");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const [totalTickets, setTotalTickets] = useState({});

  useEffect(() => {
    fetchTotalTickets();
    fetchAvailableTickets();
  }, []);

  const [availableTickets, setAvailableTickets] = useState({
    B: 0,
    C: 0,
    D: 0,
  });

  useEffect(() => {
    // Initialize tickets if needed
    const initializeTickets = async () => {
      try {
        // await axios.post('/api/tickets/initialize');
        // For demo purposes, we'll simulate the API call
        setTimeout(() => {
          fetchAvailableTickets();
        }, 500);
      } catch (error) {
        console.error("Error initializing tickets:", error);
        setError("Failed to initialize tickets");
      }
    };

    initializeTickets();
  }, []);

  useEffect(() => {
    fetchAvailableTickets();
  }, []);

  const fetchAvailableTickets = async () => {
    try {
      const zones = ["B", "C", "D"];
      const updatedAvailability = { ...availableTickets };

      for (const zone of zones) {
        const res = await axios.get(`/api/tickets/available/${zone}`, {
          withCredentials: true,
        });
        updatedAvailability[zone] = res.data.availableCount;
      }

      setAvailableTickets(updatedAvailability);
    } catch (error) {
      console.error("Error fetching available tickets:", error);
      setError("Failed to fetch available tickets");
    }
  };
  const fetchTotalTickets = async () => {
    try {
      const response = await axios.get("/api/tickets/total-tickets", {
        withCredentials: true,
      });
      setTotalTickets(response.data);
    } catch (error) {
      console.error("Error fetching total tickets:", error);
    }
  };

  const handleGenerateAllTickets = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await axios.post(
        "/api/tickets/bulk-generate-all",
        {},
        {
          responseType: "blob", // For PDF download
          withCredentials: true,
        }
      );

      // Create a download link for the PDF
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "AllTickets.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();

      setMessage("All 900 tickets generated successfully! PDF downloaded.");
      fetchAvailableTickets();
    } catch (error) {
      console.error("Error generating all tickets:", error);
      setError("Failed to generate all tickets. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customerName.trim()) {
      setError("Please enter customer name");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      // Simulate API call for selling ticket
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate success
      if (Math.random() > 0.2) {
        // Create a simulated PDF download
        // In a real app, this would be handled by axios with blob response
        const simulateDownload = () => {
          alert(
            `Ticket for ${customerName} in Zone ${selectedZone} would download now`
          );
        };
        simulateDownload();

        setMessage("Ticket sold successfully! PDF ticket downloaded.");
        setCustomerName("");

        // Refresh available tickets
        fetchAvailableTickets();
      } else {
        throw new Error("Simulated error");
      }
    } catch (error) {
      console.error("Error selling ticket:", error);
      setError("Failed to sell ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    // Simulate Excel export

    window.location.href = "/api/tickets/export";
    alert("Exporting ticket sales to Excel...");
  };

  return (
    <main
      className={`min-h-screen ${
        currentTheme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        {/* Title Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-2 rounded-full bg-purple-100 text-purple-700 mb-4">
            <TicketIcon size={24} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Sell Concert Tickets</h2>
          <p
            className={`${
              currentTheme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Issue tickets for Nikita Gandhi's Harmonic Rhapsody Tour
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center ${
              currentTheme === "dark"
                ? "bg-red-900 text-red-200"
                : "bg-red-100 text-red-800"
            }`}
          >
            <AlertCircle size={20} className="mr-2" />
            {error}
          </div>
        )}

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center ${
              currentTheme === "dark"
                ? "bg-green-900 text-green-200"
                : "bg-green-100 text-green-800"
            }`}
          >
            <CheckCircle size={20} className="mr-2" />
            {message}
          </div>
        )}

        {/* Zone Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Zone B */}
          <div
            className={`rounded-lg overflow-hidden shadow-md ${
              selectedZone === "B"
                ? currentTheme === "dark"
                  ? "ring-2 ring-purple-500 bg-purple-900"
                  : "ring-2 ring-purple-500 bg-purple-50"
                : currentTheme === "dark"
                ? "bg-gray-800"
                : "bg-white"
            }`}
          >
            <div
              className={`h-2 ${
                currentTheme === "dark" ? "bg-purple-700" : "bg-purple-500"
              }`}
            ></div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-lg">Zone B</h3>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    currentTheme === "dark"
                      ? "bg-purple-800 text-purple-200"
                      : "bg-purple-100 text-purple-700"
                  }`}
                >
                  Premium
                </span>
              </div>
              <p
                className={`text-xl font-bold mb-1 ${
                  currentTheme === "dark"
                    ? "text-purple-300"
                    : "text-purple-700"
                }`}
              >
                350 Rupees
              </p>
              <div className="flex justify-between items-center mt-3">
                <span
                  className={`text-sm ${
                    currentTheme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Available
                </span>
                <span className="font-medium">
                  {availableTickets.B}/{totalTickets.B}
                </span>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  className="bg-purple-600 h-2.5 rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      (availableTickets.B / totalTickets.B) * 100
                    )}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Zone C */}
          <div
            className={`rounded-lg overflow-hidden shadow-md ${
              selectedZone === "C"
                ? currentTheme === "dark"
                  ? "ring-2 ring-purple-500 bg-purple-900"
                  : "ring-2 ring-purple-500 bg-purple-50"
                : currentTheme === "dark"
                ? "bg-gray-800"
                : "bg-white"
            }`}
          >
            <div
              className={`h-2 ${
                currentTheme === "dark" ? "bg-blue-700" : "bg-blue-500"
              }`}
            ></div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-lg">Zone C</h3>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    currentTheme === "dark"
                      ? "bg-blue-800 text-blue-200"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  Standard
                </span>
              </div>
              <p
                className={`text-xl font-bold mb-1 ${
                  currentTheme === "dark" ? "text-blue-300" : "text-blue-700"
                }`}
              >
                200 Rupees
              </p>
              <div className="flex justify-between items-center mt-3">
                <span
                  className={`text-sm ${
                    currentTheme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Available
                </span>
                <span className="font-medium">
                  {availableTickets.C}/{totalTickets.C}
                </span>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      (availableTickets.C / totalTickets.C) * 100
                    )}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Zone D */}
          <div
            className={`rounded-lg overflow-hidden shadow-md ${
              selectedZone === "D"
                ? currentTheme === "dark"
                  ? "ring-2 ring-purple-500 bg-purple-900"
                  : "ring-2 ring-purple-500 bg-purple-50"
                : currentTheme === "dark"
                ? "bg-gray-800"
                : "bg-white"
            }`}
          >
            <div
              className={`h-2 ${
                currentTheme === "dark" ? "bg-teal-700" : "bg-teal-500"
              }`}
            ></div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-lg">Zone D</h3>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    currentTheme === "dark"
                      ? "bg-teal-800 text-teal-200"
                      : "bg-teal-100 text-teal-700"
                  }`}
                >
                  Budget
                </span>
              </div>
              <p
                className={`text-xl font-bold mb-1 ${
                  currentTheme === "dark" ? "text-teal-300" : "text-teal-700"
                }`}
              >
                100 Rupees
              </p>
              <div className="flex justify-between items-center mt-3">
                <span
                  className={`text-sm ${
                    currentTheme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Available
                </span>
                <span className="font-medium">
                  {availableTickets.D}/{totalTickets.D}
                </span>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  className="bg-teal-600 h-2.5 rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      (availableTickets.D / totalTickets.D) * 100
                    )}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Ticket Form
        <div
          className={`rounded-lg p-6 mb-6 ${
            currentTheme === "dark"
              ? "bg-gray-800 shadow-xl"
              : "bg-white shadow-md"
          } border ${
            currentTheme === "dark" ? "border-purple-800" : "border-purple-200"
          }`}
        >
          <h3 className="text-lg font-bold mb-4">Issue New Ticket</h3>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Customer Name
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer full name"
                className={`w-full p-3 rounded-lg border ${
                  currentTheme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white focus:border-purple-500"
                    : "bg-white border-gray-300 text-gray-900 focus:border-purple-500"
                } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50`}
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Select Zone
              </label>
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className={`w-full p-3 rounded-lg border ${
                  currentTheme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white focus:border-purple-500"
                    : "bg-white border-gray-300 text-gray-900 focus:border-purple-500"
                } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50`}
              >
                <option value="B">Zone B - 350 Rupees (Premium)</option>
                <option value="C">Zone C - 200 Rupees (Standard)</option>
                <option value="D">Zone D - 100 Rupees (Budget)</option>
              </select>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 py-3 px-4 rounded-lg flex justify-center items-center space-x-2 font-medium transition-colors ${
                  currentTheme === "dark"
                    ? "bg-purple-700 hover:bg-purple-800 text-white"
                    : "bg-purple-600 hover:bg-purple-700 text-white"
                } ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {loading ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Download size={18} />
                    <span>Issue Ticket</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={exportToExcel}
                className={`py-3 px-4 rounded-lg flex justify-center items-center space-x-2 font-medium transition-colors ${
                  currentTheme === "dark"
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                }`}
              >
                <FileSpreadsheet size={18} />
                <span>Export to Excel</span>
              </button>
            </div>
          </form>
        </div> */}

        {/* Venue Map */}
        <div
          className={`rounded-lg overflow-hidden shadow-md mb-6 ${
            currentTheme === "dark" ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold mb-2">Venue Seating Map</h3>
            <p
              className={`text-sm ${
                currentTheme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Help customers choose their preferred zone
            </p>
          </div>
          <div className="p-4 sm:p-6">
            {/* Seating Map */}
            <div className="relative bg-gray-200 dark:bg-gray-700 rounded-lg w-full max-w-4xl mx-auto p-4 sm:p-6 overflow-y-auto max-h-[90vh]">
              <div className="flex flex-col items-center justify-center space-y-2">
                {/* Stage */}
                <div
                  className={`h-12 sm:h-14 md:h-16 w-3/4 rounded-t-full mb-3 sm:mb-4 flex items-center justify-center
        ${currentTheme === "dark" ? "bg-gray-600" : "bg-gray-300"}`}
                >
                  <span className="text-xs sm:text-sm font-bold">STAGE</span>
                </div>

                {/* Zone B */}
                <div
                  className={`h-20 sm:h-24 w-3/4 ${
                    selectedZone === "B" ? "ring-2 ring-white" : ""
                  } ${
                    currentTheme === "dark"
                      ? "bg-purple-800 text-white"
                      : "bg-purple-200 text-purple-800"
                  } rounded-lg flex items-center justify-center`}
                >
                  <span className="text-sm sm:text-base font-bold">
                    ZONE B - PREMIUM
                  </span>
                </div>

                {/* Zone C */}
                <div
                  className={`h-20 sm:h-24 w-5/6 ${
                    selectedZone === "C" ? "ring-2 ring-white" : ""
                  } ${
                    currentTheme === "dark"
                      ? "bg-blue-800 text-white"
                      : "bg-blue-200 text-blue-800"
                  } rounded-lg flex items-center justify-center`}
                >
                  <span className="text-sm sm:text-base font-bold">
                    ZONE C - STANDARD
                  </span>
                </div>

                {/* Zone D */}
                <div
                  className={`h-20 sm:h-24 w-full ${
                    selectedZone === "D" ? "ring-2 ring-white" : ""
                  } ${
                    currentTheme === "dark"
                      ? "bg-teal-800 text-white"
                      : "bg-teal-200 text-teal-800"
                  } rounded-lg flex items-center justify-center`}
                >
                  <span className="text-sm sm:text-base font-bold">
                    ZONE D - BUDGET
                  </span>
                </div>
              </div>
            </div>

            {/* Pricing Legend */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-xs sm:text-sm max-w-4xl mx-auto">
              <div>
                <div
                  className={`w-full h-4 rounded ${
                    currentTheme === "dark" ? "bg-purple-800" : "bg-purple-200"
                  } mb-1`}
                ></div>
                <span
                  className={`${
                    currentTheme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Zone B - ₹350
                </span>
              </div>
              <div>
                <div
                  className={`w-full h-4 rounded ${
                    currentTheme === "dark" ? "bg-blue-800" : "bg-blue-200"
                  } mb-1`}
                ></div>
                <span
                  className={`${
                    currentTheme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Zone C - ₹200
                </span>
              </div>
              <div>
                <div
                  className={`w-full h-4 rounded ${
                    currentTheme === "dark" ? "bg-teal-800" : "bg-teal-200"
                  } mb-1`}
                ></div>
                <span
                  className={`${
                    currentTheme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Zone D - ₹100
                </span>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`rounded-lg overflow-hidden shadow-md mb-6 ${
            currentTheme === "dark" ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div
            className={`p-4 border-b ${
              currentTheme === "dark" ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <h3 className="text-lg font-bold">Generate All Tickets</h3>
          </div>
          <div className="p-4 flex flex-col md:flex-row gap-4 md:gap-6">
            <button
              onClick={handleGenerateAllTickets}
              disabled={loading}
              className={`w-full md:w-auto py-3 px-4 rounded-lg flex justify-center items-center space-x-2 font-medium transition-colors ${
                currentTheme === "dark"
                  ? "bg-purple-700 hover:bg-purple-800 text-white"
                  : "bg-purple-600 hover:bg-purple-700 text-white"
              } ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {loading ? (
                <>
                  <RefreshCw size={18} className="animate-spin mr-2" />
                  <span>Generating All Tickets...</span>
                </>
              ) : (
                <>
                  <Download size={18} className="mr-2" />
                  <span>Generate All 900 Tickets</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={exportToExcel}
              className={`w-full md:w-auto py-3 px-4 rounded-lg flex justify-center items-center space-x-2 font-medium transition-colors ${
                currentTheme === "dark"
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800"
              }`}
            >
              <FileSpreadsheet size={18} />
              <span>Export to Excel</span>
            </button>
          </div>

          <p
            className={`mt-3 m-6 text-sm ${
              currentTheme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            This will generate 300 tickets for each zone (B, C, D) with QR
            codes, arranged 4 per A4 page in a PDF document.
          </p>
        </div>
      </div>
    </main>
  );
}
