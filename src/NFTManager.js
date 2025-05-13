import React from 'react';

const NFTManager = ({ contract, account, setSuccess, setError }) => {
  return (
    <div className="form-container">
      <h2>Manage NFT</h2>
      <p>NFT management functionality coming soon!</p>
      {account && (
        <p className="account" title={account}>
          Connected account: {account.slice(0, 6)}...{account.slice(-4)}
        </p>
      )}
    </div>
  );
};

export default NFTManager;