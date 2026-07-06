
const dotenv = require ("dotenv");
const path = require ("path");

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

const config = {
    development: {
      apiUrl: 'http://localhost:5000/api/v1',
      // Other development config options...
    },
    production: {
      apiUrl: process.env.REACT_APP_ROOT,
      // Other production config options...
      // console.log(apiUrl)
    },
    // Add configurations for other environments as needed
  };
  
  
  const getConfig = () => {
    const env = process.env.NODE_ENV || 'production';
    return config[env];
  };
  
  export default getConfig;
  