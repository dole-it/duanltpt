import React, { useState, useEffect, useRef } from 'react';
import jsQR from 'jsqr';

const ProductTrace = ({ contract, account, setSuccess, setError }) => {
  const [productId, setProductId] = useState('');
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const traceProduct = async (id) => {
    setLoading(true);
    setError('');
    setSuccess('');
    setProduct(null);
    try {
      if (!id || isNaN(id)) {
        throw new Error('Please enter a valid Product ID.');
      }
      if (!contract) {
        throw new Error('Contract instance is not available.');
      }

      console.log('Calling getProduct with productId:', id);
      const result = await contract.methods.getProduct(id).call();
      console.log('Product data:', result);
      setProduct({
        id: result.id,
        name: result.name,
        origin: result.origin,
        productionMethod: result.productionMethod,
        certification: result.certification,
        producer: result.producer,
        supplyChainSteps: result.supplyChainSteps,
        ipfsHashes: result.ipfsHashes,
      });
      setSuccess('Product found successfully!');
    } catch (err) {
      console.error('Trace product error:', err);
      setError('Product not found or error: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const startScanning = async () => {
    try {
      setScanning(true);
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      requestAnimationFrame(tick);
    } catch (err) {
      setError('Error accessing camera: ' + err.message);
      setScanning(false);
    }
  };

  const stopScanning = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setScanning(false);
  };

  const tick = () => {
    if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      canvas.height = videoRef.current.videoHeight;
      canvas.width = videoRef.current.videoWidth;
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      if (code) {
        stopScanning();
        setProductId(code.data);
        traceProduct(code.data);
        return;
      }
    }
    if (scanning) {
      requestAnimationFrame(tick);
    }
  };

  useEffect(() => {
    return () => stopScanning(); // Cleanup on unmount
  }, []);

  return (
    <div className="form-container">
      <h2>Trace Product</h2>

      {account && (
        <p className="account" title={account}>
          Connected account: {account.slice(0, 6)}...{account.slice(-4)}
        </p>
      )}

      <div className="input-group">
        <div>
          <label>Product ID</label>
          <input
            type="number"
            placeholder="Enter Product ID"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            disabled={loading || scanning}
          />
        </div>
        <button
          onClick={() => traceProduct(productId)}
          disabled={loading || scanning}
          className="secondary"
        >
          {loading ? 'Tracing...' : 'Trace Product'}
        </button>
      </div>

      <div>
        <button
          onClick={scanning ? stopScanning : startScanning}
          disabled={loading}
          className="secondary"
        >
          {scanning ? 'Stop Scanning' : 'Scan QR Code'}
        </button>
      </div>

      {scanning && (
        <div style={{ marginTop: '15px' }}>
          <video ref={videoRef} style={{ width: '100%', maxWidth: '300px' }} />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
      )}

      {product && (
        <div className="trace-result">
          <h3>Product Details</h3>
          <div className="grid">
            <div>
              <p><strong>ID:</strong> {product.id}</p>
              <p><strong>Name:</strong> {product.name}</p>
              <p><strong>Origin:</strong> {product.origin}</p>
              <p><strong>Production Method:</strong> {product.productionMethod}</p>
              <p><strong>Certification:</strong> {product.certification}</p>
            </div>
            <div>
              <p className="truncate" title={product.producer}>
                <strong>Producer:</strong> {product.producer.slice(0, 6)}...{product.producer.slice(-4)}
              </p>
              <p>
                <strong>Supply Chain Steps:</strong>{' '}
                {product.supplyChainSteps.length > 0 ? product.supplyChainSteps.join(', ') : 'None'}
              </p>
              <p>
                <strong>IPFS Hashes:</strong>{' '}
                {product.ipfsHashes.length > 0 ? (
                  product.ipfsHashes.map((hash, index) => (
                    <a
                      key={index}
                      href={`https://ipfs.io/ipfs/${hash.replace('ipfs://', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {hash.slice(0, 10)}...
                    </a>
                  ))
                ) : (
                  'None'
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductTrace;