import React, { useState, useEffect } from "react";
import { useThemeProvider } from '../contexts/ThemeProvider';
import { RefreshCw } from 'lucide-react';
import axios from "axios";

const TicketStats = () => {
  const { currentTheme } = useThemeProvider();
  const [stats, setStats] = useState({
    B: { total: 0, sold: 0, scanned: 0 },
    C: { total: 0, sold: 0, scanned: 0 },
    D: { total: 0, sold: 0, scanned: 0 },
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Get total tickets per zone
      const totalRes = await axios.get('/api/tickets/total-tickets');
      const totals = totalRes.data;
      
      const zones = ["B", "C", "D"];
      const updatedStats = { ...stats };

      for (const zone of zones) {
        // Update total count from API
        updatedStats[zone].total = totals[zone];
        
        // Get unscanned tickets (available)
        const availableRes = await axios.get(`/api/tickets/available/${zone}`);
        const unscannedCount = availableRes.data.availableCount;
        
        // Calculate sold tickets (total - available)
        const soldCount = updatedStats[zone].total - unscannedCount;
        updatedStats[zone].sold = soldCount;
        
        // Set scanned equal to sold as requested
        updatedStats[zone].scanned = soldCount;
      }

      setStats(updatedStats);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get zone-specific styling
  const getZoneStyling = (zone) => {
    switch(zone) {
      case 'B':
        return {
          header: currentTheme === 'dark' ? 'bg-purple-900 text-purple-100' : 'bg-purple-100 text-purple-900',
          sold: 'bg-purple-600',
          scanned: 'bg-purple-400'
        };
      case 'C':
        return {
          header: currentTheme === 'dark' ? 'bg-blue-900 text-blue-100' : 'bg-blue-100 text-blue-900',
          sold: 'bg-blue-600',
          scanned: 'bg-blue-400'
        };
      case 'D':
        return {
          header: currentTheme === 'dark' ? 'bg-teal-900 text-teal-100' : 'bg-teal-100 text-teal-900',
          sold: 'bg-teal-600',
          scanned: 'bg-teal-400'
        };
      default:
        return {
          header: currentTheme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900',
          sold: 'bg-gray-600',
          scanned: 'bg-gray-400'
        };
    }
  };

  return (
    <div className={`min-h-screen ${currentTheme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto py-8 px-4">
        <h2 className="text-2xl font-bold mb-4">Ticket Statistics</h2>

        <button
          className={`mb-6 px-4 py-2 rounded-lg flex items-center space-x-2 ${
            currentTheme === 'dark' 
              ? 'bg-gray-700 hover:bg-gray-600 text-white' 
              : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
          } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          onClick={fetchStats}
          disabled={loading}
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          <span>{loading ? 'Refreshing...' : 'Refresh Stats'}</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Zone B Card */}
          <div className={`rounded-lg overflow-hidden shadow-md ${currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`px-4 py-3 font-bold text-lg ${getZoneStyling('B').header}`}>
              Zone B (350 Rupees)
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className={`p-3 rounded-lg ${currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Total Tickets</div>
                  <div className="text-xl font-bold">{stats.B.total}</div>
                </div>
                <div className={`p-3 rounded-lg ${currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Sold</div>
                  <div className="text-xl font-bold">{stats.B.sold}</div>
                </div>
                <div className={`p-3 rounded-lg ${currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Available</div>
                  <div className="text-xl font-bold">{stats.B.total - stats.B.sold}</div>
                </div>
                <div className={`p-3 rounded-lg ${currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Scanned</div>
                  <div className="text-xl font-bold">{stats.B.scanned}</div>
                </div>
              </div>

              <div className="mb-4">
                <h6 className="text-sm font-medium mb-2">Sold Progress:</h6>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div 
                    className={`${getZoneStyling('B').sold} h-2.5 rounded-full flex items-center justify-center text-xs text-white`} 
                    style={{ width: `${Math.min(100, (stats.B.sold / stats.B.total) * 100)}%` }}
                  >
                  </div>
                </div>
                <div className="text-xs text-right mt-1">{stats.B.sold}/{stats.B.total}</div>
              </div>

              <div>
                <h6 className="text-sm font-medium mb-2">Entry Progress:</h6>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div 
                    className={`${getZoneStyling('B').scanned} h-2.5 rounded-full`} 
                    style={{ width: `${Math.min(100, (stats.B.scanned / stats.B.total) * 100)}%` }}
                  >
                  </div>
                </div>
                <div className="text-xs text-right mt-1">{stats.B.scanned}/{stats.B.total}</div>
              </div>
            </div>
          </div>

          {/* Zone C Card */}
          <div className={`rounded-lg overflow-hidden shadow-md ${currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`px-4 py-3 font-bold text-lg ${getZoneStyling('C').header}`}>
              Zone C (200 Rupees)
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className={`p-3 rounded-lg ${currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Total Tickets</div>
                  <div className="text-xl font-bold">{stats.C.total}</div>
                </div>
                <div className={`p-3 rounded-lg ${currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Sold</div>
                  <div className="text-xl font-bold">{stats.C.sold}</div>
                </div>
                <div className={`p-3 rounded-lg ${currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Available</div>
                  <div className="text-xl font-bold">{stats.C.total - stats.C.sold}</div>
                </div>
                <div className={`p-3 rounded-lg ${currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Scanned</div>
                  <div className="text-xl font-bold">{stats.C.scanned}</div>
                </div>
              </div>

              <div className="mb-4">
                <h6 className="text-sm font-medium mb-2">Sold Progress:</h6>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div 
                    className={`${getZoneStyling('C').sold} h-2.5 rounded-full flex items-center justify-center text-xs text-white`} 
                    style={{ width: `${Math.min(100, (stats.C.sold / stats.C.total) * 100)}%` }}
                  >
                  </div>
                </div>
                <div className="text-xs text-right mt-1">{stats.C.sold}/{stats.C.total}</div>
              </div>

              <div>
                <h6 className="text-sm font-medium mb-2">Entry Progress:</h6>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div 
                    className={`${getZoneStyling('C').scanned} h-2.5 rounded-full`} 
                    style={{ width: `${Math.min(100, (stats.C.scanned / stats.C.total) * 100)}%` }}
                  >
                  </div>
                </div>
                <div className="text-xs text-right mt-1">{stats.C.scanned}/{stats.C.total}</div>
              </div>
            </div>
          </div>

          {/* Zone D Card */}
          <div className={`rounded-lg overflow-hidden shadow-md ${currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`px-4 py-3 font-bold text-lg ${getZoneStyling('D').header}`}>
              Zone D (100 Rupees)
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className={`p-3 rounded-lg ${currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Total Tickets</div>
                  <div className="text-xl font-bold">{stats.D.total}</div>
                </div>
                <div className={`p-3 rounded-lg ${currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Sold</div>
                  <div className="text-xl font-bold">{stats.D.sold}</div>
                </div>
                <div className={`p-3 rounded-lg ${currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Available</div>
                  <div className="text-xl font-bold">{stats.D.total - stats.D.sold}</div>
                </div>
                <div className={`p-3 rounded-lg ${currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Scanned</div>
                  <div className="text-xl font-bold">{stats.D.scanned}</div>
                </div>
              </div>

              <div className="mb-4">
                <h6 className="text-sm font-medium mb-2">Sold Progress:</h6>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div 
                    className={`${getZoneStyling('D').sold} h-2.5 rounded-full flex items-center justify-center text-xs text-white`} 
                    style={{ width: `${Math.min(100, (stats.D.sold / stats.D.total) * 100)}%` }}
                  >
                  </div>
                </div>
                <div className="text-xs text-right mt-1">{stats.D.sold}/{stats.D.total}</div>
              </div>

              <div>
                <h6 className="text-sm font-medium mb-2">Entry Progress:</h6>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div 
                    className={`${getZoneStyling('D').scanned} h-2.5 rounded-full`} 
                    style={{ width: `${Math.min(100, (stats.D.scanned / stats.D.total) * 100)}%` }}
                  >
                  </div>
                </div>
                <div className="text-xs text-right mt-1">{stats.D.scanned}/{stats.D.total}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketStats;