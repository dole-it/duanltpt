import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import ProductRegistration from './components/ProductRegistration';
import ProductUpdate from './components/ProductUpdate';
import ProductTrace from './components/ProductTrace';
import NFTManager from './components/NFTManager';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import AdminDashboard from './components/AdminDashboard';
import { getUser, logout } from './auth';
import './App.css';

// ABI từ OrganicSupplyChain.sol (giữ nguyên)
const contractABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "ERC721IncorrectOwner",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "ERC721InsufficientApproval",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "approver",
        "type": "address"
      }
    ],
    "name": "ERC721InvalidApprover",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      }
    ],
    "name": "ERC721InvalidOperator",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "ERC721InvalidOwner",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "receiver",
        "type": "address"
      }
    ],
    "name": "ERC721InvalidReceiver",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "ERC721InvalidSender",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "ERC721NonexistentToken",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "approved",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "ApprovalForAll",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "producer",
        "type": "address"
      }
    ],
    "name": "ProductCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "updater",
        "type": "address"
      }
    ],
    "name": "ProductDeleted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "updater",
        "type": "address"
      }
    ],
    "name": "ProductUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "step",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "updater",
        "type": "address"
      }
    ],
    "name": "SupplyChainStepAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_tokenId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_step",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_ipfsHash",
        "type": "string"
      }
    ],
    "name": "addSupplyChainStep",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_origin",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_productionMethod",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_certification",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_ipfsHash",
        "type": "string"
      }
    ],
    "name": "createProduct",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_tokenId",
        "type": "uint256"
      }
    ],
    "name": "deleteProduct",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllProducts",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "origin",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "productionMethod",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "certification",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "producer",
            "type": "address"
          },
          {
            "internalType": "string[]",
            "name": "supplyChainSteps",
            "type": "string[]"
          },
          {
            "internalType": "string[]",
            "name": "ipfsHashes",
            "type": "string[]"
          }
        ],
        "internalType": "struct OrganicSupplyChain.Product[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "getApproved",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_tokenId",
        "type": "uint256"
      }
    ],
    "name": "getProduct",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "origin",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "productionMethod",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "certification",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "producer",
        "type": "address"
      },
      {
        "internalType": "string[]",
        "name": "supplyChainSteps",
        "type": "string[]"
      },
      {
        "internalType": "string[]",
        "name": "ipfsHashes",
        "type": "string[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      }
    ],
    "name": "isApprovedForAll",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "ownerOf",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "productIds",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "productToOwner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "products",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "origin",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "productionMethod",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "certification",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "producer",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "setApprovalForAll",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "interfaceId",
        "type": "bytes4"
      }
    ],
    "name": "supportsInterface",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "tokenURI",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_tokenId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_origin",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "productionMethod",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_certification",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_ipfsHash",
        "type": "string"
      }
    ],
    "name": "updateProduct",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const contractAddress = '0x6b17078875dcadb1f0f27d61e19ea8414b1d11cf';

function Navbar() {
  const user = getUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <h1>Organic Supply Chain DApp</h1>
        <div className="nav-links">
          {user ? (
            <>
              <Link to="/">Trang chủ</Link>
              <Link to="/register-product">Đăng ký sản phẩm</Link>
              <Link to="/update">Cập nhật trạng thái</Link>
              <Link to="/trace">Truy xuất sản phẩm</Link>
              <Link to="/nft">Quản lý NFT</Link>
              {user.role === 'admin' && <Link to="/admin">Quản trị</Link>}
              <button onClick={handleLogout} className="error">Đăng xuất</button>
            </>
          ) : (
            <>
              <Link to="/login">Đăng nhập</Link>
              <Link to="/register">Đăng ký</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function App() {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [network, setNetwork] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = getUser();

  const getNetworkName = (chainId) => {
    const id = typeof chainId === 'string' ? parseInt(chainId, 16) : chainId;
    switch (id) {
      case 1: return 'Ethereum Mainnet';
      case 137: return 'Polygon Mainnet';
      case 42161: return 'Arbitrum One';
      case 10: return 'Optimism';
      case 56: return 'BNB Smart Chain Mainnet';
      case 11155111: return 'Sepolia Testnet';
      case 5: return 'Goerli Testnet';
      case 80001: return 'Polygon Mumbai Testnet';
      case 421614: return 'Arbitrum Sepolia Testnet';
      case 11155420: return 'Optimism Sepolia Testnet';
      case 97: return 'BNB Smart Chain Testnet';
      case 1337:
      case 31337: return 'Localhost (Geth/Ganache/Hardhat)';
      default: return 'Unknown Network';
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        if (!window.ethereum) {
          setError('Vui lòng cài đặt MetaMask!');
          return;
        }

        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3Instance.eth.getAccounts();
        if (accounts.length === 0) {
          setError('Vui lòng kết nối tài khoản MetaMask!');
          return;
        }

        const chainId = await web3Instance.eth.getChainId();
        const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);

        setAccount(accounts[0]);
        setNetwork(chainId);
        setContract(contractInstance);
        if (user) {
          await fetchProducts(contractInstance);
        }

        window.ethereum.on('accountsChanged', async (newAccounts) => {
          setAccount(newAccounts[0] || '');
          if (user) {
            await fetchProducts(contractInstance);
          }
        });

        window.ethereum.on('chainChanged', () => {
          window.location.reload();
        });
      } catch (err) {
        setError(`Lỗi kết nối MetaMask: ${err.message}`);
      }
    };
    init();
  }, [user]);

  const fetchProducts = async (contractInstance) => {
    try {
      setLoading(true);
      const data = await contractInstance.methods.getAllProducts().call();
      setProducts(data);
      setError('');
    } catch (error) {
      setError(`Lỗi khi tải sản phẩm: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      if (!account) {
        throw new Error('Không có tài khoản MetaMask được kết nối.');
      }
      if (!contract) {
        throw new Error('Không tìm thấy hợp đồng thông minh.');
      }

      console.log('Gọi hàm deleteProduct với productId:', productId);
      const tx = await contract.methods
        .deleteProduct(productId)
        .send({
          from: account,
          gas: 300000,
        });

      console.log('Giao dịch thành công:', tx);
      setSuccess(`Xóa sản phẩm thành công! Mã giao dịch: ${tx.transactionHash}`);
      await fetchProducts(contract);
    } catch (err) {
      console.error('Lỗi xóa sản phẩm:', err);
      setError(`Không thể xóa sản phẩm: ${err.message || 'Lỗi không xác định'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BrowserRouter>
      <div className="app">
        {/* Navbar */}
        <Navbar />
        
        {/* Main Content */}
        <div className="container">
          {error && <div className="alert error">{error}</div>}
          {success && <div className="alert success">{success}</div>}

          <Routes>
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
            <Route
              path="/"
              element={user ? <Profile /> : <Navigate to="/login" />}
            />
            <Route
              path="/register-product"
              element={
                user ? (
                  <ProductRegistration
                    contract={contract}
                    account={account}
                    setSuccess={setSuccess}
                    setError={setError}
                    fetchProducts={fetchProducts}
                  />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/update"
              element={
                user ? (
                  <ProductUpdate
                    contract={contract}
                    account={account}
                    setSuccess={setSuccess}
                    setError={setError}
                    fetchProducts={fetchProducts}
                    getNetworkName={getNetworkName}
                  />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/trace"
              element={
                user ? (
                  <ProductTrace
                    contract={contract}
                    account={account}
                    setSuccess={setSuccess}
                    setError={setError}
                  />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/nft"
              element={
                user ? (
                  <NFTManager
                    contract={contract}
                    account={account}
                    setSuccess={setSuccess}
                    setError={setError}
                  />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/admin"
              element={
                user && user.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />
              }
            />
          </Routes>

          {/* Product List */}
          {user && (
            <div className="product-list">
              <h2>Danh sách sản phẩm</h2>
              {loading ? (
                <p>Đang tải sản phẩm...</p>
              ) : products.length === 0 ? (
                <p>Không có sản phẩm nào.</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Tên</th>
                      <th>Nguồn gốc</th>
                      <th>Phương pháp</th>
                      <th>Nhà sản xuất</th>
                      <th>Mã QR</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td>{product.id}</td>
                        <td>{product.name}</td>
                        <td>{product.origin}</td>
                        <td>{product.productionMethod}</td>
                        <td className="truncate" title={product.producer}>
                          {product.producer.slice(0, 6)}...{product.producer.slice(-4)}
                        </td>
                        <td>
                          <QRCodeCanvas value={product.id.toString()} size={50} />
                        </td>
                        <td>
                          <button
                            onClick={() => deleteProduct(product.id)}
                            disabled={loading}
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;