import Web3 from 'web3';

let web3;

if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
  try {
    web3 = new Web3(window.ethereum);
    window.ethereum.request({ method: 'eth_requestAccounts' }).catch((error) => {
      console.error('User denied account access:', error);
    });
  } catch (error) {
    console.error('Error initializing MetaMask provider:', error);
  }
} else {
  try {
    const provider = new Web3.providers.HttpProvider(
      'https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID'
    );
    web3 = new Web3(provider);
  } catch (error) {
    console.error('Error initializing fallback provider:', error);
  }
}

if (!web3) {
  console.error('Web3 provider not initialized. Check network or provider settings.');
}

export default web3;