import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyCSiN8NyuRqqD47T_VklI4ALwMs-AXablM",
    authDomain: "fluid-installer.firebaseapp.com",
    projectId: "fluid-installer",
    storageBucket: "fluid-installer.appspot.com",
    messagingSenderId: "570303369863",
    appId: "1:570303369863:web:939fddfe418bac53b19e22",
    measurementId: "G-P9G1TP9HJ9"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const analytics = getAnalytics(firebaseApp);

export { logEvent };
