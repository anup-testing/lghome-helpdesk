import './config/env.js';
import { app } from './app.js';

const port = process.env.PORT || 4100;

app.listen(port, () => {
  console.log(`backend listening on :${port}`);
});
