const app = require('./app');
const db = require('./config/db');
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});

const shutdown = (signal) => {
  console.log(`Menerima sinyal ${signal}, menutup server dengan aman...`);
  server.close(async () => {
    try {
      await db.end();
    } catch {}
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10000).unref();
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
});