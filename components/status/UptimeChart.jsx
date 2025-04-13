// components/status/UptimeChart.jsx
import { useState, useEffect, useCallback } from 'react';

const timeframeConfig = {
  '24h': {
    label: '24 Hours',
    hours: 24,
    interval: 60, // minutes
    formatTime: (date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  },
  '7d': {
    label: '7 Days',
    hours: 24 * 7,
    interval: 360, // 6 hours
    formatTime: (date) => date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit' })
  },
  '30d': {
    label: '30 Days',
    hours: 24 * 30,
    interval: 24 * 60, // 24 hours
    formatTime: (date) => date.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }
};

export default function UptimeChart({ componentId }) {
  const [timeframe, setTimeframe] = useState('24h');
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Generate sample uptime data
  const generateUptimeData = useCallback(() => {
    const now = new Date();
    const data = [];
    const config = timeframeConfig[timeframe];
    
    for (let i = config.hours; i >= 0; i -= config.interval / 60) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      // Generate mostly operational status with occasional incidents
      const status = Math.random() > 0.95 ? 'incident' : 'operational';
      data.push({
        time: time.toISOString(),
        status,
        formattedTime: config.formatTime(time)
      });
    }
    
    return data;
  }, [timeframe]);
  
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setChartData(generateUptimeData());
      setIsLoading(false);
    }, 500);
  }, [timeframe, componentId, generateUptimeData]);
  
  const calculateUptimePercentage = useCallback(() => {
    if (!chartData.length) return 0;
    const operationalCount = chartData.filter(point => point.status === 'operational').length;
    return ((operationalCount / chartData.length) * 100).toFixed(1);
  }, [chartData]);
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Uptime History</h3>
          <p className="mt-1 text-sm text-gray-500">
            {calculateUptimePercentage()}% uptime in the past {timeframeConfig[timeframe].label}
          </p>
        </div>
        <div className="flex space-x-2">
          {Object.entries(timeframeConfig).map(([key, config]) => (
            <button 
              key={key}
              onClick={() => setTimeframe(key)}
              className={`px-3 py-1 text-sm rounded-md transition-colors duration-150 ${
                timeframe === key 
                  ? 'bg-blue-100 text-blue-800 font-medium' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {config.label}
            </button>
          ))}
        </div>
      </div>
      
      {isLoading ? (
        <div className="h-16 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="h-16 flex items-end space-x-1">
            {chartData.map((point, index) => (
              <div 
                key={index} 
                className="flex-1 h-full flex flex-col justify-end group relative"
              >
                <div 
                  className={`w-full transition-all duration-150 ${
                    point.status === 'operational' 
                      ? 'bg-green-500 hover:bg-green-600' 
                      : 'bg-red-500 hover:bg-red-600'
                  }`} 
                  style={{ 
                    height: point.status === 'operational' ? '100%' : '30%',
                    minHeight: '4px'
                  }}
                ></div>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap">
                  {point.formattedTime}: {point.status}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6">
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Operational</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Outage/Incident</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">
                {timeframeConfig[timeframe].formatTime(new Date(Date.now() - timeframeConfig[timeframe].hours * 60 * 60 * 1000))}
              </span>
              <span className="text-xs text-gray-500">Now</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}