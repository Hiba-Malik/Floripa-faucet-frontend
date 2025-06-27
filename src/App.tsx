import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { Wallet,Info, Plus, CheckCircle, AlertCircle, Droplets } from 'lucide-react';
import './App.css';

// MetaMask network configuration for Azore testnet
const AZORE_NETWORK = {
  chainId: '0x157C1',
  chainName: 'Azore Testnet',
  nativeCurrency: {
    name: 'Azore Testnet',
    symbol: 'AZE-t',
    decimals: 18,
  },
  rpcUrls: [process.env.REACT_APP_RPC_URL || 'https://rpc-testnet.azore.technology'],
  blockExplorerUrls: [process.env.REACT_APP_BLOCK_EXPLORER_URL || 'https://floripa.azorescan.com'],
};



function App() {
  const [account, setAccount] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Check if wallet is already connected and set up event listeners
  useEffect(() => {
    checkWalletConnection();
    setupWalletEventListeners();
    
    // Cleanup event listeners on component unmount
    return () => {
      removeWalletEventListeners();
    };
  }, []);

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
        } else {
          setAccount('');
          setIsConnected(false);
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
        setAccount('');
        setIsConnected(false);
      }
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      // User disconnected their wallet
      setAccount('');
      setIsConnected(false);
      setShowSuccess(false);
      setShowError(false);
      toast.error('Wallet disconnected');
    } else {
      // User switched accounts
      const newAccount = accounts[0];
      if (newAccount !== account) {
        setAccount(newAccount);
        setIsConnected(true);
        toast.success(`Switched to account: ${newAccount.slice(0, 6)}...${newAccount.slice(-4)}`);
      }
    }
  };

  const handleChainChanged = (chainId: string) => {
    // Reload the page when chain changes
    window.location.reload();
  };

  const setupWalletEventListeners = () => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }
  };

  const removeWalletEventListeners = () => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    }
  };

  const addNetwork = async () => {
    if (typeof window.ethereum === 'undefined') {
      toast.error('MetaMask is not installed.');
      return;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [AZORE_NETWORK],
      });
      toast.success('Azore Testnet added to MetaMask!');
    } catch (error: any) {
      if (error.code === 4001) {
        toast.error('User rejected the request to add the network.');
      } else if (error.code === -32602) {
        toast.error('Error with network parameters. Please check the configuration.');
      }
      else {
        console.error('Failed to add network:', error);
        toast.error('Failed to add the network.');
      }
    }
  };

  const showNetworkInstructions = () => {
    const rpcUrl = process.env.REACT_APP_RPC_URL || 'https://rpc-testnet.azore.technology';
    const explorerUrl = process.env.REACT_APP_BLOCK_EXPLORER_URL || 'https://floripa.azorescan.com';
    
    toast((t) => (
      <div style={{ textAlign: 'left', maxWidth: '300px' }}>
        <strong>Add Network Manually:</strong><br/>
        1. Open MetaMask → Settings → Networks<br/>
        2. Click "Add Network"<br/>
        3. Enter these details:<br/><br/>
        <strong>Network Name:</strong> Floripa Testnet<br/>
        <strong>RPC URL:</strong> {rpcUrl}<br/>
        <strong>Chain ID:</strong> 88001<br/>
        <strong>Symbol:</strong> AZE-t<br/>
        <strong>Explorer:</strong> {explorerUrl}
      </div>
    ), { duration: 15000 });
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        setIsLoading(true);
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
          toast.success('Wallet connected successfully!');
        }
      } catch (error: any) {
        console.error('Error connecting wallet:', error);
        if (error.code === 4001) {
          toast.error('User rejected the connection');
        } else {
          toast.error('Failed to connect wallet');
        }
      }
    } else {
      toast.error('MetaMask is not installed');
    }
    setIsLoading(false);
  };

  const disconnectWallet = () => {
    setAccount('');
    setIsConnected(false);
    setShowSuccess(false);
    setShowError(false);
    toast.success('Wallet disconnected');
  };

  const requestTokens = async () => {
    if (!isConnected || !account) {
      toast.error('Please connect your wallet first');
      return;
    }

    setIsLoading(true);

    
        try {
      // Make sure the URL matches your backend port and endpoint
      const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'https://faucet.azorescan.com/api';
      const response = await fetch(`${apiBaseUrl}/faucet/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: account,  // Changed from 'address' to 'walletAddress'
          // Removed 'amount' since it's fixed at 0.5 AZE in the backend
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 4000);
        toast.success(`Successfully sent ${data.transaction.amount} AZE to your wallet!`);
        
        // Optional: Log transaction details
        console.log('Transaction Hash:', data.transaction.hash);
        console.log('Block Number:', data.transaction.blockNumber);
      } else {
        // Handle different error types
        let errorMessage = 'Request failed';
        
        if (response.status === 429) {
          // Rate limiting or cooldown
          errorMessage = data.message || `You can request tokens again in ${data.hoursRemaining} hours`;
        } else if (response.status === 400) {
          // Validation error
          errorMessage = data.details || data.error || 'Invalid wallet address';
        } else if (response.status === 503) {
          // Service unavailable
          errorMessage = 'Faucet temporarily unavailable. Please try again later.';
        } else {
          errorMessage = data.message || data.error || 'Request failed';
        }
        
        setErrorMessage(errorMessage);
        setShowError(true);
        setTimeout(() => setShowError(false), 4000);
      }
    } catch (error) {
      console.error('Error requesting tokens:', error);
      setErrorMessage('Network error, please try again');
      setShowError(true);
      setTimeout(() => setShowError(false), 4000);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="App">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1a1a2e',
            color: '#fff',
            border: '1px solid #5547f4',
          },
        }}
      />
      
      {/* Background */}
      <div className="background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      {/* Main Content */}
      <div className="container">
        <motion.div 
          className="faucet-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="header">
            <img src="/logo-white.svg" alt="Azore" className="logo" />
            <h1>Azore Testnet Faucet</h1>
            <p>Get free AZE tokens for testing on the Azore network</p>
          </div>

          {/* Main Actions */}
          <div className="actions">
            {!isConnected && (
              <motion.button
                className="btn btn-secondary"
                onClick={addNetwork}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus size={20} />
                Add to Metamask
              </motion.button>
            )}

            {!isConnected && (
              <motion.button
                className="btn btn-secondary"
                onClick={showNetworkInstructions}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Info size={20} />
                Show Instructions
              </motion.button>
            )}

            <motion.button
              className="btn btn-secondary"
              onClick={showNetworkInstructions}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Info size={20} />
              Show Instructions
            </motion.button>

            <motion.button
              className={`btn ${isConnected ? 'btn-success' : 'btn-primary'}`}
              onClick={connectWallet}
              disabled={isLoading || isConnected}
              whileHover={{ scale: isConnected ? 1 : 1.02 }}
              whileTap={{ scale: isConnected ? 1 : 0.98 }}
            >
              <Wallet size={20} />
              {isConnected ? 'Wallet Connected' : 'Connect Wallet'}
            </motion.button>
          </div>
          

          {/* Connected Wallet Info */}
          <AnimatePresence>
            {isConnected && (
              <motion.div
                className="wallet-info"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="address">
                  <span>Connected: </span>
                  <code>{account.slice(0, 6)}...{account.slice(-4)}</code>
                </div>
                <motion.button
                  className="disconnect-btn"
                  onClick={disconnectWallet}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Disconnect
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Faucet Button */}
          <AnimatePresence>
            {isConnected && (
              <motion.div
                className="faucet-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <motion.button
                  className="btn btn-faucet"
                  onClick={requestTokens}
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Droplets size={20} />
                  {isLoading ? 'Requesting...' : 'Request 0.5 AZE'}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Success Animation */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="success-modal"
                initial={{ scale: 0, y: -100, rotateX: -90 }}
                animate={{ scale: 1, y: 0, rotateX: 0 }}
                exit={{ scale: 0.8, y: 100, rotateX: 90, opacity: 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
              >
                {/* Animated Background Particles */}
                <div className="particles">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="particle"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ 
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0],
                        x: [0, (i % 2 === 0 ? 1 : -1) * (30 + i * 10)],
                        y: [0, (i % 3 === 0 ? -1 : 1) * (20 + i * 8)]
                      }}
                      transition={{ 
                        duration: 2,
                        delay: i * 0.1,
                        repeat: Infinity,
                        repeatDelay: 0.5
                      }}
                    />
                  ))}
                </div>

                {/* Main Icon with Pulse Effect */}
                <motion.div
                  className="success-icon-container"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.4, type: "spring" }}
                >

                  <CheckCircle size={64} className="success-icon" />
                </motion.div>

                {/* Text Content */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                >
                  Transaction Successful!
                </motion.h2>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                  className="amount-text"
                >
                  0.5 AZE sent to your wallet
                </motion.p>
                
                <motion.div
                  className="congrats"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, duration: 0.4, type: "spring" }}
                >
                  <div className="congrats-text">Amazing! Your tokens are on the way</div>
                  <motion.div
                    className="glow-effect"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      opacity: [0.5, 0.8, 0.5]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Modal */}
        <AnimatePresence>
          {showError && (
            <motion.div
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="error-modal"
                initial={{ scale: 0, y: -50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0, y: 50 }}
                transition={{ duration: 0.3 }}
              >
                <AlertCircle size={48} className="error-icon" />
                <h2>Request Failed</h2>
                <p>{errorMessage}</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>Powered by Azore Network</p>
      </footer>
    </div>
  );
}

export default App;
