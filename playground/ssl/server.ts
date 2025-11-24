export default {
  port: 443,
  tls: {
    key: Bun.file(import.meta.dir + '/localhost-key.pem'),
    cert: Bun.file(import.meta.dir + '/localhost.pem'),
  },
  fetch() {
    return new Response("Hello World");
  },
};
