

export const authConfig = {};

export const environment = {
  firebase: {
    apiKey: "AIzaSyCu-IjYSje3BwflXhI9uiY4qMjamMuQRhU",
    authDomain: "pulqui-marketplace.firebaseapp.com",
    databaseURL: "https://pulqui-marketplace.firebaseio.com",
    projectId: "pulqui-marketplace",
    storageBucket: "storage-pulqui-mkp",
    messagingSenderId: "289549735507",
    appId: "1:289549735507:web:25cf73949e7fdde30698a6",
    measurementId: "G-90S35VGNYK"
  },
  production: false,
  urlChatbot: 'https://front-asistente-virtual.firebaseapp.com',
  urlPublic: 'http://localhost:4200',
  urlServer: 'http://34.107.154.137/api/auth',
  URL_BACKEND: 'http://34.107.154.137/api/auth',
  urlSocket: '34.107.154.137',
  URL_BACKEND_PUBLIC: 'http://34.107.154.137/api/public',
  URL_BACKEND_FLIX: 'https://davinciflix.co',
  URL_GOOGLE_DNS: 'https://dns.google.com/resolve',
  urlBackendAccount: 'https://gestion-dot-interno-davinci-account-des.appspot.com/api',

  urlPayu: 'https://sandbox.checkout.payulatam.com/ppp-web-gateway-payu/',
  info_payu: {
    description: 'Adquisición producto o servicio Davinci (Prueba)',
    lng: 'es',
    test: '1',
    responseUrl: 'http://localhost:4200/marketplace/respuesta-pago',
    confirmationUrl: 'https://hookb.in/W1OdjKnr9BhYplzzpQn3',
  },
  response_url_bot_pay:
    'https://tienda-dot-interno-davinci-apps-qa.uc.r.appspot.com/authentication/result_pay',
  googleCredential: {
    client_id: '574213351824-31t68mr5sugsk2du4oae5np0dugl6sk2.apps.googleusercontent.com',
    scope: 'profile email',
    cookiepolicy: 'single_host_origin',
  },
  authConfig,
  googleOauthClientId: '1019423428235-ebhcn8hsstur2eqjj0jopm863onv2liu.apps.googleusercontent.com',
  urlTratamientoDeDatos:
    'https://docs.google.com/document/d/1jSLCr9TLtQRz_5wMuSJSdmQjlRW304X3W5SQ2BGaMdk',

  vapidKey:
    'BEtEx7ZUjXr8ul-JTybwMIwlji86VvLwJExASJV2mj6En4YPN4N2X5u-bkEpimc82jc4XNt94cr0Hw6vR2wMkV8',
  siteKeyRecaptcha:'6LcJz6YgAAAAAN0_sWgpFrrWWj-75PJabSeWeDZh'
};
