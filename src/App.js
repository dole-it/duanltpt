import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react'; // Sửa import
import ProductRegistration from './components/ProductRegistration';
import ProductUpdate from './components/ProductUpdate';
import ProductTrace from './components/ProductTrace';
import NFTManager from './components/NFTManager';
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

const contractAddress = '0xd2b4a6dd625b20ad097ddada2316d1bfdc9ce111';

function App() {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [network, setNetwork] = useState(null);
  const [loading, setLoading] = useState(false);

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
          setError('Please install MetaMask!');
          return;
        }

        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3Instance.eth.getAccounts();
        if (accounts.length === 0) {
          setError('Please connect a MetaMask account!');
          return;
        }

        const chainId = await web3Instance.eth.getChainId();
        const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);

        setAccount(accounts[0]);
        setNetwork(chainId);
        setContract(contractInstance);
        await fetchProducts(contractInstance);

        window.ethereum.on('accountsChanged', async (newAccounts) => {
          setAccount(newAccounts[0] || '');
          await fetchProducts(contractInstance);
        });

        window.ethereum.on('chainChanged', () => {
          window.location.reload();
        });
      } catch (err) {
        setError(`Error connecting MetaMask: ${err.message}`);
      }
    };
    init();
  }, []);

  const fetchProducts = async (contractInstance) => {
    try {
      setLoading(true);
      const data = await contractInstance.methods.getAllProducts().call();
      setProducts(data);
      setError('');
    } catch (error) {
      setError(`Error fetching products: ${error.message}`);
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
        throw new Error('No MetaMask account connected.');
      }
      if (!contract) {
        throw new Error('Contract instance is not available.');
      }

      console.log('Calling deleteProduct with productId:', productId);
      const tx = await contract.methods
        .deleteProduct(productId)
        .send({
          from: account,
          gas: 300000,
        });

      console.log('Transaction successful:', tx);
      setSuccess(`Product deleted successfully! Transaction hash: ${tx.transactionHash}`);
      await fetchProducts(contract);
    } catch (err) {
      console.error('Delete product error:', err);
      setError(`Failed to delete product: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BrowserRouter>
      <div className="app">
        {/* Navbar */}
        <nav className="navbar">
          <div className="container">
            <h1>Organic Supply Chain DApp</h1>
            <div className="nav-links">
              <Link to="/">Register Product</Link>
              <Link to="/update">Update Status</Link>
              <Link to="/trace">Trace Product</Link>
              <Link to="/nft">Manage NFT</Link>
            </div>
            <div className="account-info" title={account}>
              {account ? (
                `Account: ${account.slice(0, 6)}...${account.slice(-4)} | Network: ${network ? getNetworkName(network) : 'Checking...'}`
              ) : (
                'Connecting to MetaMask...'
              )}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="container">
          {error && <div className="alert error">{error}</div>}
          {success && <div className="alert success">{success}</div>}

          <Routes>
            <Route
              path="/"
              element={
                <ProductRegistration
                  contract={contract}
                  account={account}
                  setSuccess={setSuccess}
                  setError={setError}
                  fetchProducts={fetchProducts}
                />
              }
            />
            <Route
              path="/update"
              element={
                <ProductUpdate
                  contract={contract}
                  account={account}
                  setSuccess={setSuccess}
                  setError={setError}
                  fetchProducts={fetchProducts}
                  getNetworkName={getNetworkName}
                />
              }
            />
            <Route
              path="/trace"
              element={
                <ProductTrace
                  contract={contract}
                  account={account}
                  setSuccess={setSuccess}
                  setError={setError}
                />
              }
            />
            <Route
              path="/nft"
              element={
                <NFTManager
                  contract={contract}
                  account={account}
                  setSuccess={setSuccess}
                  setError={setError}
                />
              }
            />
          </Routes>

          {/* Product List */}
          <div className="product-list">
            <h2>Product List</h2>
            {loading ? (
              <p>Loading products...</p>
            ) : products.length === 0 ? (
              <p>No products available.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Origin</th>
                    <th>Method</th>
                    <th>Producer</th>
                    <th>QR Code</th>
                    <th>Actions</th>
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
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
