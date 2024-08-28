import { format } from 'date-fns';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fileName = path.join(__dirname, '../Logs', 'logs.log');

export const logEvents = async (msg) => {
    const dateTime = `${format(new Date(), 'dd-MM-yyyy\tHH:mm:ss')}`;
    const contentLog = `${dateTime}\t ==== ${msg}\n`;
    try {
        await fs.appendFile(fileName, contentLog);
    } catch (error) {
        console.error(error);
    }
};
