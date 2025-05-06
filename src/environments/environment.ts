// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
//build bản hệ thống
export const environment = {
  production: false,
  serverUrl: '/api',
  title: 'Local Environment Heading',
  apiURL: 'http://localhost:8000',
  api_end_point: 'http://localhost:8443',
  auth_api: '/api/auth/',
  keycloak: {
    // Url of the Identity Provider
    issuer: 'http://192.168.68.90:8080/auth/',
    // Realm
    realm: 'QLSX',
    clientId: 'qms_local',
  },
};
// build bản test
// export const environment = {
//   production: false,
//   serverUrl: '/api',
//   title: 'Local Environment Heading',
//   apiURL: 'http://localhost:8000',
//   api_end_point: 'http://localhost:8449',
//   auth_api: '/api/auth/',
//   keycloak: {
//     // // Url of the Identity Provider
//     // issuer: 'http://localhost:8180/auth/',
//     // // Realm
//     // realm: 'jhipster',
//     // clientId: 'qms',
//     // Url of the Identity Provider
//     issuer: 'http://192.168.68.90:8080/auth/',
//     // Realm
//     realm: 'QLSX',
//     clientId: 'qms_local_new',
//   },
// };
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
