import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
// import { v4 as uuidv4 } from 'uuid';
import { storage } from './firebase';

export async function uploadImage(file: File): Promise<string> {
    if (!file) {
        throw new Error('No file provided');
    }

    // Generate a unique file name
    const uniqueName = `${crypto.randomUUID()}_${file.name}`;
    const storageRef = ref(storage, `blog-header-images/${uniqueName}`);

    // Optionally add metadata
    const metadata = {
        contentType: file.type,
    };

    try {
        const snapshot = await uploadBytes(storageRef, file, metadata);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
    } catch (error) {
        console.error('Error uploading file: ', error);
        throw error;
    }
} 