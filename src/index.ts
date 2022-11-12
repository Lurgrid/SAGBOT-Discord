import fetch, { Response } from "node-fetch";
import { hello } from './utils.js';

(async() => {
    const response: Response = await fetch("https://www.google.com");
    console.log(response.headers);
})();

hello("World");
