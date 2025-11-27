let apiRoot = ''
if (process.env.BUILD_MODE === 'dev') {
  apiRoot = 'http://localhost:2004'
}
if (process.env.BUILD_MODE === 'production') {
  apiRoot = 'https://shop-api-w5ss.onrender.com'
}

export const API_ROOT = apiRoot