// import React, { useState, useEffect } from 'react';

// const ProductUpdate = ({ contract, account, setSuccess, setError, fetchProducts, getNetworkName }) => {
//   const [productId, setProductId] = useState('');
//   const [status, setStatus] = useState('');
//   const [ipfsHash, setIpfsHash] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [networkError, setNetworkError] = useState('');

//   useEffect(() => {
//     const init = async () => {
//       try {
//         if (!window.ethereum) {
//           setError('Please install MetaMask to use this DApp!');
//           return;
//         }

//         const chainId = await window.ethereum.request({ method: 'eth_chainId' });
//         const networkId = parseInt(chainId, 16);
//         console.log('Network ID:', networkId, 'Network Name:', getNetworkName(networkId));

//         if (networkId !== 11155111) {
//           setNetworkError(
//             `Please switch to Sepolia Testnet. Current network: ${getNetworkName(networkId)} (ID: ${networkId}).`
//           );
//           return;
//         }

//         if (!contract) {
//           setNetworkError('Contract instance is not initialized!');
//           return;
//         }
//       } catch (err) {
//         console.error('Initialization error:', err);
//         setError('Error initializing DApp: ' + err.message);
//       }
//     };
//     init();
//   }, [contract, setError, getNetworkName]);

//   const updateStatus = async () => {
//     setLoading(true);
//     setError('');
//     setSuccess('');
//     try {
//       if (!productId || isNaN(productId)) {
//         throw new Error('Please enter a valid Product ID (number).');
//       }
//       if (!status) {
//         throw new Error('Please enter a status.');
//       }
//       if (!account) {
//         throw new Error('No MetaMask account connected.');
//       }
//       if (!contract) {
//         throw new Error('Contract instance is not available.');
//       }

//       console.log('Calling addSupplyChainStep with params:', {
//         productId,
//         status,
//         ipfsHash,
//       });
//       const tx = await contract.methods
//         .addSupplyChainStep(productId, status, ipfsHash)
//         .send({
//           from: account,
//           gas: 300000,
//         });

//       console.log('Transaction successful:', tx);
//       setSuccess(`Status updated successfully! Transaction hash: ${tx.transactionHash}`);
//       fetchProducts(contract);
//     } catch (err) {
//       console.error('Update status error:', err);
//       setError('Failed to update status: ' + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const checkProduct = async () => {
//     try {
//       setError('');
//       if (!productId || isNaN(productId)) {
//         setError('Please enter a valid Product ID.');
//         return;
//       }
//       if (!contract) {
//         setError('Contract instance is not available.');
//         return;
//       }

//       console.log('Calling getProduct with productId:', productId);
//       const product = await contract.methods.getProduct(productId).call();
//       console.log('Product data:', product);
//       alert(
//         `Product found: ${product.name} (Producer: ${product.producer}, Current steps: ${product.supplyChainSteps.join(', ')})`
//       );
//     } catch (err) {
//       console.error('Check product error:', err);
//       setError('Product not found or error: ' + err.message);
//     }
//   };

//   return (
//     <div
//       style={{
//         maxWidth: '600px',
//         margin: '20px auto',
//         padding: '20px',
//         border: '1px solid #ccc',
//         borderRadius: '8px',
//         boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
//         backgroundColor: '#fff',
//       }}
//     >
//       <h2
//         style={{
//           textAlign: 'center',
//           marginBottom: '20px',
//           color: '#333',
//         }}
//       >
//         Update Product Status
//       </h2>

//       {networkError && (
//         <p
//           style={{
//             color: 'red',
//             marginBottom: '10px',
//             fontSize: '14px',
//           }}
//         >
//           {networkError}
//         </p>
//       )}

//       {account && (
//         <p
//           style={{
//             color: '#333',
//             marginBottom: '10px',
//             fontSize: '14px',
//             wordBreak: 'break-all',
//           }}
//         >
//           Connected account: {account}
//         </p>
//       )}

//       <div
//         style={{
//           marginBottom: '15px',
//         }}
//       >
//         <label
//           style={{
//             display: 'block',
//             marginBottom: '5px',
//             fontWeight: 'bold',
//             color: '#333',
//           }}
//         >
//           Product ID
//         </label>
//         <div style={{ display: 'flex', gap: '10px' }}>
//           <input
//             type="number"
//             placeholder="Enter Product ID"
//             value={productId}
//             onChange={(e) => setProductId(e.target.value)}
//             disabled={loading}
//             style={{
//               flex: '1',
//               padding: '8px',
//               border: '1px solid #ccc',
//               borderRadius: '4px',
//               fontSize: '14px',
//             }}
//           />
//           <button
//             onClick={checkProduct}
//             disabled={loading}
//             style={{
//               padding: '8px 16px',
//               backgroundColor: '#007bff',
//               color: 'white',
//               border: 'none',
//               borderRadius: '4px',
//               cursor: loading ? 'not-allowed' : 'pointer',
//               opacity: loading ? 0.6 : 1,
//             }}
//           >
//             Check Product
//           </button>
//         </div>
//       </div>

//       <div
//         style={{
//           marginBottom: '15px',
//         }}
//       >
//         <label
//           style={{
//             display: 'block',
//             marginBottom: '5px',
//             fontWeight: 'bold',
//             color: '#333',
//           }}
//         >
//           New Status (e.g., Harvested)
//         </label>
//         <input
//           type="text"
//           placeholder="Enter new status"
//           value={status}
//           onChange={(e) => setStatus(e.target.value)}
//           disabled={loading}
//           style={{
//             width: '100%',
//             padding: '8px',
//             border: '1px solid #ccc',
//             borderRadius: '4px',
//             fontSize: '14px',
//           }}
//         />
//       </div>

//       <div
//         style={{
//           marginBottom: '15px',
//         }}
//       >
//         <label
//           style={{
//             display: 'block',
//             marginBottom: '5px',
//             fontWeight: 'bold',
//             color: '#333',
//           }}
//         >
//           IPFS Hash (optional)
//         </label>
//         <input
//           type="text"
//           placeholder="Enter IPFS hash (e.g., ipfs://hash)"
//           value={ipfsHash}
//           onChange={(e) => setIpfsHash(e.target.value)}
//           disabled={loading}
//           style={{
//             width: '100%',
//             padding: '8px',
//             border: '1px solid #ccc',
//             borderRadius: '4px',
//             fontSize: '14px',
//           }}
//         />
//       </div>

//       <button
//         onClick={updateStatus}
//         disabled={loading || networkError}
//         style={{
//           width: '100%',
//           padding: '10px',
//           backgroundColor: loading || networkError ? '#ccc' : '#28a745',
//           color: 'white',
//           border: 'none',
//           borderRadius: '4px',
//           cursor: loading || networkError ? 'not-allowed' : 'pointer',
//           fontSize: '16px',
//           opacity: loading || networkError ? 0.6 : 1,
//         }}
//       >
//         {loading ? 'Updating...' : 'Update Status'}
//       </button>
//     </div>
//   );
// };

// export default ProductUpdate;
import React, { useState, useEffect } from 'react';

const ProductUpdate = ({ contract, account, setSuccess, setError, fetchProducts, getNetworkName }) => {
  const [productId, setProductId] = useState('');
  const [status, setStatus] = useState('');
  const [ipfsHash, setIpfsHash] = useState('');
  const [loading, setLoading] = useState(false);
  const [networkError, setNetworkError] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        if (!window.ethereum) {
          setError('Please install MetaMask to use this DApp!');
          return;
        }

        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        const networkId = parseInt(chainId, 16);
        console.log('Network ID:', networkId, 'Network Name:', getNetworkName(networkId));

        if (networkId !== 11155111) {
          setNetworkError(
            `Please switch to Sepolia Testnet. Current network: ${getNetworkName(networkId)} (ID: ${networkId}).`
          );
          return;
        }

        if (!contract) {
          setNetworkError('Contract instance is not initialized!');
          return;
        }
      } catch (err) {
        console.error('Initialization error:', err);
        setError('Error initializing DApp: ' + err.message);
      }
    };
    init();
  }, [contract, setError, getNetworkName]);

  const updateStatus = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      if (!productId || isNaN(productId)) {
        throw new Error('Please enter a valid Product ID (number).');
      }
      if (!status) {
        throw new Error('Please enter a status.');
      }
      if (!account) {
        throw new Error('No MetaMask account connected.');
      }
      if (!contract) {
        throw new Error('Contract instance is not available.');
      }

      console.log('Calling addSupplyChainStep with params:', {
        productId,
        status,
        ipfsHash,
      });
      const tx = await contract.methods
        .addSupplyChainStep(productId, status, ipfsHash)
        .send({
          from: account,
          gas: 500000,
        });

      console.log('Transaction successful:', tx);
      setSuccess(`Status updated successfully! Transaction hash: ${tx.transactionHash}`);
      fetchProducts(contract);
    } catch (err) {
      console.error('Update status error:', err);
      if (err.receipt) {
        console.log('Transaction receipt:', err.receipt);
        console.log('Transaction hash:', err.receipt.transactionHash);
      }
      setError('Failed to update status: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const checkProduct = async () => {
    try {
      setError('');
      if (!productId || isNaN(productId)) {
        setError('Please enter a valid Product ID.');
        return;
      }
      if (!contract) {
        setError('Contract instance is not available.');
        return;
      }

      console.log('Calling getProduct with productId:', productId);
      const product = await contract.methods.getProduct(productId).call();
      console.log('Product data:', product);
      alert(
        `Product found: ${product.name} (Producer: ${product.producer}, Current steps: ${product.supplyChainSteps.join(', ')})`
      );
    } catch (err) {
      console.error('Check product error:', err);
      setError('Product not found or error: ' + err.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Update Product Status</h2>

      {networkError && (
        <p className="text-red-600 mb-4 text-sm">{networkError}</p>
      )}

      {account && (
        <p className="text-gray-600 mb-4 text-sm truncate" title={account}>
          Connected account: {account.slice(0, 6)}...{account.slice(-4)}
        </p>
      )}

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Product ID</label>
        <div className="flex space-x-2">
          <input
            type="number"
            placeholder="Enter Product ID"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            disabled={loading}
            className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={checkProduct}
            disabled={loading}
            className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Check Product
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">New Status (e.g., Harvested)</label>
        <input
          type="text"
          placeholder="Enter new status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          disabled={loading}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">IPFS Hash (optional)</label>
        <input
          type="text"
          placeholder="Enter IPFS hash (e.g., ipfs://hash)"
          value={ipfsHash}
          onChange={(e) => setIpfsHash(e.target.value)}
          disabled={loading}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <button
        onClick={updateStatus}
        disabled={loading || networkError}
        className={`w-full p-3 bg-green-500 text-white rounded hover:bg-green-600 ${loading || networkError ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading ? 'Updating...' : 'Update Status'}
      </button>
    </div>
  );
};

export default ProductUpdate;   