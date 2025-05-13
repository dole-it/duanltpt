// // // import React, { useState } from 'react';

// // // function ProductRegistration({ web3, account, contract }) {
// // //   const [productName, setProductName] = useState('');
// // //   const [productOrigin, setProductOrigin] = useState('');

// // //   const registerProduct = async () => {
// // //     try {
// // //       await contract.methods.registerProduct(productName, productOrigin)
// // //         .send({ from: account });
// // //       alert('Sản phẩm đã được đăng ký!');
// // //     } catch (error) {
// // //       console.error("Lỗi khi đăng ký sản phẩm:", error);
// // //     }
// // //   };

// // //   return (
// // //     <div className="product-registration">
// // //       <h1>Đăng ký Sản phẩm</h1>
// // //       <input
// // //         type="text"
// // //         value={productName}
// // //         onChange={(e) => setProductName(e.target.value)}
// // //         placeholder="Tên sản phẩm"
// // //       />
// // //       <input
// // //         type="text"
// // //         value={productOrigin}
// // //         onChange={(e) => setProductOrigin(e.target.value)}
// // //         placeholder="Nguồn gốc sản phẩm"
// // //       />
// // //       <button onClick={registerProduct}>Đăng ký</button>
// // //     </div>
// // //   );
// // // }

// // // export default ProductRegistration;
// // import React, { useState } from 'react';

// // function ProductRegistration({ web3, account, contract, handlePayment }) {
// //   const [productName, setProductName] = useState('');
// //   const [productOrigin, setProductOrigin] = useState('');
// //   const [amount, setAmount] = useState('');

// //   const registerProduct = async () => {
// //     try {
// //       await contract.methods.registerProduct(productName, productOrigin).send({ from: account });
// //       alert('Sản phẩm đã được đăng ký!');
// //     } catch (error) {
// //       console.error("Lỗi khi đăng ký sản phẩm:", error);
// //     }
// //   };

// //   const handlePay = () => {
// //     handlePayment(amount); // Gọi hàm thanh toán với số tiền người dùng nhập
// //   };

// //   return (
// //     <div className="product-registration">
// //       <h1>Đăng ký Sản phẩm</h1>
// //       <input
// //         type="text"
// //         value={productName}
// //         onChange={(e) => setProductName(e.target.value)}
// //         placeholder="Tên sản phẩm"
// //       />
// //       <input
// //         type="text"
// //         value={productOrigin}
// //         onChange={(e) => setProductOrigin(e.target.value)}
// //         placeholder="Nguồn gốc sản phẩm"
// //       />
// //       <input
// //         type="text"
// //         value={amount}
// //         onChange={(e) => setAmount(e.target.value)}
// //         placeholder="Số tiền thanh toán (ETH)"
// //       />
// //       <button onClick={registerProduct}>Đăng ký</button>
// //       <button onClick={handlePay}>Thanh toán</button>
// //     </div>
// //   );
// // }

// // export default ProductRegistration;
// import React, { useState } from 'react';

// const ProductRegistration = ({ contract, account, setSuccess, setError, fetchProducts }) => {
//   const [form, setForm] = useState({
//     name: '',
//     origin: '',
//     productionMethod: '',
//     certification: '',
//     ipfsHash: ''
//   });

//   const handleSubmit = async () => {
//     if (!form.name || !form.origin || !form.productionMethod || !form.certification) {
//       setError('Vui lòng điền đầy đủ thông tin bắt buộc.');
//       return;
//     }

//     try {
//       if (!contract || !account) {
//         setError('Vui lòng kết nối MetaMask và đảm bảo contract đã được tải.');
//         return;
//       }

//       const tx = await contract.methods.createProduct(
//         form.name,
//         form.origin,
//         form.productionMethod,
//         form.certification,
//         form.ipfsHash || ''
//       ).send({ from: account });

//       setSuccess(`Sản phẩm được thêm với tokenId: ${tx.events.ProductCreated.returnValues.tokenId}`);
//       setError('');
//       setForm({ name: '', origin: '', productionMethod: '', certification: '', ipfsHash: '' });
//       fetchProducts(contract);
//     } catch (error) {
//       setError('Lỗi khi thêm sản phẩm: ' + error.message);
//     }
//   };

//   return (
//     <div style={{ marginTop: 20 }}>
//       <h3>Đăng ký sản phẩm mới</h3>
//       <input
//         type="text"
//         placeholder="Tên sản phẩm"
//         value={form.name}
//         onChange={(e) => setForm({ ...form, name: e.target.value })}
//         style={{ display: 'block', marginBottom: 10, padding: 8, width: '100%' }}
//       />
//       <input
//         type="text"
//         placeholder="Nguồn gốc"
//         value={form.origin}
//         onChange={(e) => setForm({ ...form, origin: e.target.value })}
//         style={{ display: 'block', marginBottom: 10, padding: 8, width: '100%' }}
//       />
//       <input
//         type="text"
//         placeholder="Phương pháp sản xuất"
//         value={form.productionMethod}
//         onChange={(e) => setForm({ ...form, productionMethod: e.target.value })}
//         style={{ display: 'block', marginBottom: 10, padding: 8, width: '100%' }}
//       />
//       <input
//         type="text"
//         placeholder="Chứng nhận"
//         value={form.certification}
//         onChange={(e) => setForm({ ...form, certification: e.target.value })}
//         style={{ display: 'block', marginBottom: 10, padding: 8, width: '100%' }}
//       />
//       <input
//         type="text"
//         placeholder="IPFS Hash (tùy chọn)"
//         value={form.ipfsHash}
//         onChange={(e) => setForm({ ...form, ipfsHash: e.target.value })}
//         style={{ display: 'block', marginBottom: 10, padding: 8, width: '100%' }}
//       />
//       <button
//         onClick={handleSubmit}
//         style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}
//       >
//         Thêm sản phẩm
//       </button>
//     </div>
//   );
// };

// export default ProductRegistration;
import React, { useState } from 'react';

const ProductRegistration = ({ contract, account, setSuccess, setError, fetchProducts }) => {
  const [name, setName] = useState('');
  const [origin, setOrigin] = useState('');
  const [productionMethod, setProductionMethod] = useState('');
  const [certification, setCertification] = useState('');
  const [ipfsHash, setIpfsHash] = useState('');
  const [loading, setLoading] = useState(false);

  const registerProduct = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      if (!name || !origin || !productionMethod || !certification) {
        throw new Error('Please fill in all required fields.');
      }
      if (!account) {
        throw new Error('No MetaMask account connected.');
      }
      if (!contract) {
        throw new Error('Contract instance is not available.');
      }

      console.log('Calling createProduct with params:', {
        name,
        origin,
        productionMethod,
        certification,
        ipfsHash,
      });
      const tx = await contract.methods
        .createProduct(name, origin, productionMethod, certification, ipfsHash)
        .send({
          from: account,
          gas: 500000,
        });

      console.log('Transaction successful:', tx);
      setSuccess(`Product registered successfully! Transaction hash: ${tx.transactionHash}`);
      fetchProducts(contract);
    } catch (err) {
      console.error('Register product error:', err);
      if (err.receipt) {
        console.log('Transaction receipt:', err.receipt);
        console.log('Transaction hash:', err.receipt.transactionHash);
      }
      setError('Failed to register product: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Register New Product</h2>

      {account && (
        <p className="text-gray-600 mb-4 text-sm truncate" title={account}>
          Connected account: {account.slice(0, 6)}...{account.slice(-4)}
        </p>
      )}

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Product Name</label>
        <input
          type="text"
          placeholder="Enter product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Origin</label>
        <input
          type="text"
          placeholder="Enter origin (e.g., Vietnam)"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          disabled={loading}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Production Method</label>
        <input
          type="text"
          placeholder="Enter production method (e.g., Organic)"
          value={productionMethod}
          onChange={(e) => setProductionMethod(e.target.value)}
          disabled={loading}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Certification</label>
        <input
          type="text"
          placeholder="Enter certification (e.g., USDA Organic)"
          value={certification}
          onChange={(e) => setCertification(e.target.value)}
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
        onClick={registerProduct}
        disabled={loading}
        className={`w-full p-3 bg-green-500 text-white rounded hover:bg-green-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading ? 'Registering...' : 'Register Product'}
      </button>
    </div>
  );
};

export default ProductRegistration;