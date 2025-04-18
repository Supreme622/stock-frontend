import React, { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
  const [products, setProducts] = useState([]);
  const [logs, setLogs] = useState([]);
  const [file, setFile] = useState(null);

  const loadProducts = async () => {
    const res = await axios.get('https://stock-backend-s4da.onrender.com/products');
    setProducts(res.data);
  };

  const loadLogs = async () => {
    const res = await axios.get('https://stock-backend-s4da.onrender.com/logs');
    setLogs(res.data.reverse());
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);
    await axios.post('https://stock-backend-s4da.onrender.com/upload-stock', formData);
    loadProducts();
  };

  const updateStock = async (type, product, size, quantity) => {
    await axios.post(`https://stock-backend-s4da.onrender.com/stock-${type}`, {
      product, size, quantity: parseInt(quantity)
    });
    loadProducts();
    loadLogs();
  };

  useEffect(() => {
    loadProducts();
    loadLogs();
  }, []);

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: 'auto' }}>
      <h1>📦 Stock Manager</h1>
      
      <div>
        <input type="file" onChange={e => setFile(e.target.files[0])} />
        <button onClick={handleUpload}>Upload Stock CSV</button>
      </div>

      <h2>Products</h2>
      {products.map(prod => (
        <div key={prod.name} style={{ borderBottom: '1px solid #ccc', marginBottom: 10 }}>
          <h3>{prod.name}</h3>
          {Object.entries(prod.sizes).map(([size, qty]) => (
            <div key={size}>
              <strong>{size}:</strong> {qty}
              <input type="number" placeholder="Qty" id={`${prod.name}-${size}`} />
              <button onClick={() => {
                const qty = document.getElementById(`${prod.name}-${size}`).value;
                updateStock('in', prod.name, size, qty);
              }}>IN</button>
              <button onClick={() => {
                const qty = document.getElementById(`${prod.name}-${size}`).value;
                updateStock('out', prod.name, size, qty);
              }}>OUT</button>
            </div>
          ))}
        </div>
      ))}

      <h2>Logs</h2>
      <ul>
        {logs.map((log, i) => (
          <li key={i}>
            [{log.timestamp}] {log.type} {log.quantity} of {log.product} ({log.size})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;