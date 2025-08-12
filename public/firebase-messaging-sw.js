importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js");

self.addEventListener('notificationclick', function(event) {
  console.log(event.notification);
  event.notification.close();
  if (event.notification && event.notification.data && event.notification.data.FCM_MSG && event.notification.data.FCM_MSG.notification) {
    const url = event.notification.data.FCM_MSG.notification.click_action;
    event.waitUntil(
        self.clients.matchAll({type: 'window'}).then( windowClients => {
            // then open the target URL in a new window/tab.
            if (self.clients.openWindow) {
                return self.clients.openWindow(url);
            }
        })
    )
  }
}, false);


const firebaseConfig = {
  apiKey: "AIzaSyD9bytpt7oqndp63vZFMnNCXNnC_alDYPc",
  authDomain: "cms-jcc-01.firebaseapp.com",
  projectId: "cms-jcc-01",
  storageBucket: "cms-jcc-01.appspot.com",
  messagingSenderId: "364954358846",
  appId: "1:364954358846:web:35993eea59dcf633726d6f",
  measurementId: "G-7GFWEGYX2Y"

  // apiKey: process.env.MIX_FCM_API_KEY,
  // authDomain: process.env.MIX_FCM_AUTH_DOMAIN,
  // projectId: process.env.MIX_FCM_PROJECT_ID,
  // storageBucket: process.env.MIX_FCM_STORAGE_BUCKET,
  // messagingSenderId: process.env.MIX_FCM_MESSAGE_SENDER_ID,
  // appId: process.env.MIX_FCM_APP_ID,
  // measurementId: process.env.MIX_FCM_MEASUREMENT_ID,
};

firebase.initializeApp(firebaseConfig);
//if (!firebase.apps.length) {
//  firebase.initializeApp(firebaseConfig);
//} else {
//  firebase.app();
//}

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  console.log(`setBackgroundMessageHandler ${payload}`);
  const title = payload.notification.title;
  const options = {
    body: payload.notification.body,
    url: payload.notification.click_action,
  };
  return self.registration.showNotification(
    title,
    options
  );
  console.log(title);
});