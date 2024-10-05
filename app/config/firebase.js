import firebase from '@firebase/app';
import config from '../../firebase-config.json'; // Path to your Firebase config file

let instance = null;

class FirebaseService {
    constructor() {
        if (!instance) {
            this.app = firebase.initializeApp(config);
            instance = this;
        }
        return instance;
    }
}

const firebaseService = new FirebaseService().app;
export default firebaseService;