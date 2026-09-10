import dotenv from 'dotenv';
import { resolve } from 'node:path';

dotenv.config();
dotenv.config({ path: resolve(process.cwd(), '.env.local'), override: true });
