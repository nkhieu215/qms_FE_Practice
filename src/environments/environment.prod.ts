export const environment = {
  production: true,
  serverUrl: '/api',
  title: 'Local Environment Heading',
  apiURL: 'http://192.168.68.92:8000',
  api_end_point: 'http://192.168.68.92/qms',
  auth_api: '/api/auth/',
  keycloak: {
    // Url of the Identity Provider
    issuer: 'http://192.168.68.90:8080/auth/',
    // Realm
    realm: 'QLSX',
    clientId: 'qms',
  },
};

