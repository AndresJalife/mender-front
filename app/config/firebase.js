import { initializeApp } from 'firebase/app';
import config from '../../firebase-config.json';

let instance = null;

class FirebaseService {
    constructor() {
        if (!instance) {
            this.app = initializeApp(config);
            instance = this;
        }
        return instance;
    }
}

const firebaseService = new FirebaseService().app;
export default firebaseService;