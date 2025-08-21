const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add custom resolver for network requests
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Configure network timeout
config.server = {
  ...config.server,
  port: 8081,
  enhanceMiddleware: (middleware, server) => {
    return (req, res, next) => {
      // Add CORS headers for development
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      
      if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
      }
      
      return middleware(req, res, next);
    };
  }
};

module.exports = config;
