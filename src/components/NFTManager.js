// import React, { useState } from 'react';
// import web3 from '../web3';


// const NFTManager = () => {
//   const [productId, setProductId] = useState('');

//   const mintNFT = async () => {
//     const accounts = await web3.eth.getAccounts();
//     const networkId = await web3.eth.net.getId();
//     const instance = new web3.eth.Contract(contract.abi, contract.networks[networkId].address);

//     await instance.methods.mintNFT(productId).send({ from: accounts[0] });
//     alert('NFT minted!');
//   };

//   return (
//     <div>
//       <input placeholder="Product ID" onChange={(e) => setProductId(e.target.value)} />
//       <button onClick={mintNFT}>Mint NFT</button>
//     </div>
//   );
// };

// export default NFTManager;
import React, { useState } from 'react';

function NFTManager({ web3, account, contract }) {
  const [productInfo, setProductInfo] = useState(null);

  // Ví dụ gọi contract để lấy thông tin sản phẩm
  const fetchProductInfo = async () => {
    try {
      const result = await contract.methods.getProductInfo().call();
      setProductInfo(result);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin sản phẩm:", error);
    }
  };

  return (
    <div>
      <h1>Quản lý NFT Sản Phẩm</h1>
      <button onClick={fetchProductInfo}>Lấy thông tin sản phẩm</button>
      {productInfo && (
        <div>
          <h3>Thông tin sản phẩm:</h3>
          <p>{JSON.stringify(productInfo)}</p>
        </div>
      )}
    </div>
  );
}

export default NFTManager;
