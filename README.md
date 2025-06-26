# 🚰 Floripa Testnet Faucet

A beautiful, modern testnet faucet website for the Azore blockchain network. Get free AZE tokens for testing and development on the Azore testnet.

![Floripa Faucet](https://via.placeholder.com/800x400/5547f4/ffffff?text=Azore+Testnet+Faucet)

## ✨ Features

- 🌟 **Beautiful UI**: Modern glassmorphism design with Azore's signature purple theme
- 🦊 **MetaMask Integration**: Seamless wallet connection and network addition
- 🎨 **Smooth Animations**: Framer Motion powered animations and transitions
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- 🔐 **Rate Limiting**: Built-in protection against spam requests
- 🎉 **Success Animations**: Celebratory animations when tokens are sent
- 🚨 **Error Handling**: Clear error messages and user feedback
- ⚡ **Real-time Notifications**: Toast notifications for user actions

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MetaMask browser extension

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd azore-faucet
```

2. Install dependencies:
```bash
npm install
```

3. Start both frontend and backend:
```bash
npm run dev
```

This will start:
- Frontend React app on `http://localhost:3000`
- Backend API server on `http://localhost:3001`

### Individual Commands

Start only the frontend:
```bash
npm start
```

Start only the backend:
```bash
npm run server
```

Build for production:
```bash
npm run build
```

## 🛠️ Configuration

### Network Configuration

Update the network configuration in `src/App.tsx`:

```javascript
const AZORE_NETWORK = {
  chainId: '0x7A69', // Replace with your chain ID
  chainName: 'Floripa Testnet',
  nativeCurrency: {
    name: 'Azore Testner',
    symbol: 'AZE-t',
    decimals: 18,
  },
  rpcUrls: ['YOUR_RPC_URL_HERE'],
  blockExplorerUrls: ['YOUR_EXPLORER_URL_HERE'],
};
```

### Backend Configuration

The backend server (`server.js`) includes:
- Rate limiting (1 request per address per 24 hours)
- Request validation
- Transaction simulation
- CORS enabled for frontend communication

## 📱 How to Use

1. **Open the Website**: Navigate to `http://localhost:3000`

2. **Add Network**: Click "Add Network to MetaMask" to add Azore testnet to your MetaMask

3. **Connect Wallet**: Click "Connect Wallet" to connect your MetaMask wallet

4. **Request Tokens**: Once connected, click "Request 0.5 AZE" to get testnet tokens

5. **Enjoy**: Watch the beautiful success animation when tokens are sent!

## 🎨 Design System

The faucet uses Azore's brand colors and design principles:

- **Primary Color**: `#5547f4` (Azore Purple)
- **Secondary Colors**: `#7c4dff`, `#3f51b5`
- **Background**: Dark gradient with floating orbs
- **Typography**: System fonts with gradient text effects
- **Components**: Glassmorphism cards with backdrop blur

## 🔧 API Endpoints

### POST `/api/faucet`
Request testnet tokens for an address.

**Request Body:**
```json
{
  "address": "0x...",
  "amount": "0.5"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Successfully sent 0.5 AZE to 0x...",
  "txHash": "0x..."
}
```

**Response (Rate Limited):**
```json
{
  "success": false,
  "message": "You exceeded request rate for today, try tomorrow"
}
```

### GET `/api/health`
Health check endpoint.

### GET `/api/info`
Get faucet information and configuration.

## 🔒 Security Features

- Rate limiting per wallet address
- Input validation and sanitization
- CORS protection
- Error handling and logging
- Request size limits

## 🌐 Deployment

### Frontend Deployment

Build the React app:
```bash
npm run build
```

Deploy the `build/` folder to your hosting service (Netlify, Vercel, etc.).

### Backend Deployment

Deploy `server.js` to your Node.js hosting service with environment variables:
- `PORT`: Server port (default: 3001)
- Add database connection for persistent rate limiting in production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎉 Acknowledgments

- Built with React and TypeScript
- Styled with modern CSS and Framer Motion
- MetaMask integration with ethers.js
- Express.js backend with rate limiting
- Azore brand assets and color scheme

## 📞 Support

For support, please open an issue on GitHub or contact the Azore development team.

---

**Made with ❤️ for the Azore Community**
