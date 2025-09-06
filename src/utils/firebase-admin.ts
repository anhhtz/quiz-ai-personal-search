import { ServiceAccount } from 'firebase-admin';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import serviceAccount from './../../.config/agribankquiz-firebase-adminsdk-b0tei-7d30cc1a89.json';


const apps = getApps();

if (!apps.length) {
    initializeApp({
        credential: cert(serviceAccount as ServiceAccount)
    });
}

export const adminDb = getFirestore();
export const adminStorage = getStorage();