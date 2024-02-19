// Custom middleware functions (e.g., authentication)

function authenticate(req, res, next) {
    // Implementation for authentication
    const token = req.headers['authorization'];
    console.log(`Authenticating with token: ${token}`);

    if (token && token.startsWith('Bearer ')) {
      // Remove the "Bearer " prefix from the token
      const authToken = token.slice(7); // Remove the first 7 characters ("Bearer ")

      if (authToken) {
          // Here you can add your logic to verify the token, such as decoding and validating it
          // For example, using a library like jsonwebtoken
          // If the token is valid, call next() to proceed to the next middleware or route handler
          // If the token is invalid, you can return a 401 Unauthorized response
          next();
      } else {
        res.status(498).json({ message: 'Invalid Token' });
      }
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
}
  
  module.exports = {
    authenticate
  };
  