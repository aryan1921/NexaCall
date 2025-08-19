// App server base URL from environment variable
const server = process.env.REACT_APP_API_URL || "http://localhost:8000";
console.log('Server URL:', server);
export default server;
