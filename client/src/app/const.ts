const isProduction = process.env.NODE_ENV === 'production';
const serverUrl = isProduction
  ? process.env.PUBLIC_URL
  : 'http://localhost:3001';

const CONST = {
  isProduction,
  serverUrl,
};

export default CONST;
