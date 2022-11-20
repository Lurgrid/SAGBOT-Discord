export default (): string => {
    const d = new Date();
    return `[${d.getFullYear().toString().padStart(4, "0")}-${d.getMonth().toString().padStart(2, "0")}-${d.getDay().toString().padStart(2, "0")}|${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")}.${d.getMilliseconds().toString().padStart(3, "0")}]`;
}