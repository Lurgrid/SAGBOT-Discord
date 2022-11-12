import fetch from "node-fetch";
import { hello } from './utils.js';
(async () => {
    const response = await fetch("https://www.google.com");
    console.log(response.headers);
})();
hello("World");
//# sourceMappingURL=index.js.map