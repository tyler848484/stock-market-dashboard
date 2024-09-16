import React, { useState } from 'react';
import axios from 'axios';
import SearchBar from './SearchBar';
import StockData from './StockData';
import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  var apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  
  const [stocks, setStocks] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [stockLimitReached, setStockLimitReached] = useState(false);
  const colors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
    '#9966FF', '#FF9F40', '#8BC34A', '#FF5722'
  ];

  const fetchStockData = async (symbol) => {
    if (stocks.length >= 8) {
      setStockLimitReached(true);
      return;
    }

    try {
      const response = await axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`);
      const stockData = response.data['Time Series (Daily)'];
      
      const dataPoints = Object.keys(stockData).map(date => ({
        date,
        price: parseFloat(stockData[date]['4. close']),
      }));

      const colorIndex = stocks.length % colors.length;
      const stockColor = colors[colorIndex];

      const newStock = {
        symbol,
        price: dataPoints[0].price,
        name: symbol.toUpperCase(),
        dataPoints,
        color: stockColor
      };

      setStocks((prevStocks) => {
        const updatedStocks = [...prevStocks, newStock];
        
        if (updatedStocks.length >= 8) {
          setStockLimitReached(true);
        }
        return updatedStocks;
      });
  
      setChartData((prevChartData) => {
        const newDataset = {
          label: symbol,
          data: dataPoints.map(dp => dp.price).reverse(),
          backgroundColor: `${stockColor}33`,
          borderColor: stockColor, 
        };

        return prevChartData
          ? {
              ...prevChartData,
              datasets: [...prevChartData.datasets, newDataset],
            }
          : {
              labels: dataPoints.map(dp => dp.date).reverse(),
              datasets: [newDataset],
            };
      });
    } catch (error) {
      console.error("Error fetching stock data", error);
      toast.error("Failed to fetch stock data. Please try again later.");
    }
  };

  return (
    <div className='App'>
      <main>
        <h1 className='App'>Stock Market Dashboard</h1>
        <SearchBar onSearch={fetchStockData} disableSearch={stockLimitReached}/>
        <div className='stock-container'>
          {stocks.length > 0 ? stocks.map((stock, index) => (
              <div key={index} className="stock-tile" style={{ color: stock.color }}>
                <h3>{stock.name} ({stock.symbol})</h3>
                <p>Price: ${stock.price}</p>
              </div>
          )) : <h3>Add a stock to learn more about it!</h3> }
        </div> 

        {stockLimitReached && toast.warn("Stock ticker limit reached.")}

        {chartData && <StockData chartData={chartData} />}
      </main>
      <ToastContainer />
    </div>
  );
}

export default App;
