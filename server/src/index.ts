import express from 'express';
import path from 'path';

const app = express();
const PORT = 3001;

const clientDir = path.join(__dirname, '../../client/build');
app.use(express.static(clientDir));

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
