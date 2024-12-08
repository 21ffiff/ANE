// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;
//------------------------------------------------
/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
      return [
        {
          source: "/api/products", // Sesuaikan dengan API route Anda
          headers: [
            {
              key: "Cache-Control",
              value: "no-store, max-age=0, must-revalidate", // Nonaktifkan caching
            },
          ],
        },
      ];
    },
  };
  
  export default nextConfig;
  