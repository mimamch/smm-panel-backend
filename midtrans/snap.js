const midtransClient = require("midtrans-client");
// Create Snap API instance
let snap = new midtransClient.Snap({
  isProduction: process.env.NODE_ENV == "development" ? false : true,
  serverKey:
    process.env.NODE_ENV == "development"
      ? process.env.MIDTRANS_SERVER_KEY_SB
      : process.env.MIDTRANS_SERVER_KEY,
  clientKey:
    process.env.NODE_ENV == "development"
      ? process.env.MIDTRANS_CLIENT_KEY_SB
      : process.env.MIDTRANS_CLIENT_KEY,
});

module.exports = { snap };
