import app from "./app";

// Menjalankan server Elysia di port 3001
app.listen(3001);

console.log(`🚀 Backend running at http://localhost:${app.server?.port || 3001}`);