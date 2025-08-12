import request from '@/utils/request';
import { isLogged } from '@/utils/auth';
import firebase from 'firebase/app';
import 'firebase/messaging';

export const NotificationPermission = () => {
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('Notification permission granted');
      registerServiceWorker();
    } else {
      console.log('Unable to get permission to notify.');
    }
  });
};

const registerServiceWorker = async() => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('firebase-messaging-sw.js', {
        scope: '/',
      });

      if (registration.installing) {
        console.log('Service worker installing');
      } else if (registration.active) {
        console.log('Service worker active');
        setupFCM(registration);
      }
    } catch (error) {
      console.error(`Registration failed with ${error}`);
    }
  }
};

function setupFCM(registration) {
  // Setup FCM
  const firebaseConfig = {
    apiKey: process.env.MIX_FCM_API_KEY,
    authDomain: process.env.MIX_FCM_AUTH_DOMAIN,
    projectId: process.env.MIX_FCM_PROJECT_ID,
    storageBucket: process.env.MIX_FCM_STORAGE_BUCKET,
    messagingSenderId: process.env.MIX_FCM_MESSAGE_SENDER_ID,
    appId: process.env.MIX_FCM_APP_ID,
    measurementId: process.env.MIX_FCM_MEASUREMENT_ID,
  };

  // firebase.initializeApp(firebaseConfig);
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  } else {
    firebase.app();
  }
  const messaging = firebase.messaging();

  messaging.getToken(
    {
      vapidKey: 'BFumaoCwKujL7gfd11-aVuAawn2I-mkkYDeiXGhr6O736Zu4bKkMWhb6WTIlCnLFTakiEqPURBizsSJSm2SSWfg',
      serviceWorkerRegistration: registration,
    })
    .then(function(token) {
      request({
        url: 'store-token',
        method: 'post',
        data: { token: token },
      })
        .then(response => {
          console.log(token);
          console.log(response);
        })
        .catch(error => {
          console.log(`error store token: ${error}`);
        });
    })
    .catch(function(error) {
      console.log(`Failure to get token ${error}`);
    });

  messaging.onMessage(function(payload){
    console.log(payload);
    if (isLogged()) {
      const title = payload.notification.title;
      const options = {
        body: payload.notification.body,
        url: payload.notification.click_action,
      };
      new Notification(title, options);
      console.log(title);
    }
  });
}
