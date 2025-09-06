// app/hooks/useFirebaseImage.ts
import { useState, useEffect } from "react";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../../utils/firebase";

export function useFirebaseImage(imagePath: string) {
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchImageUrl = async () => {
            try {
                const imageRef = ref(storage, imagePath);
                const url = await getDownloadURL(imageRef);
                setImageUrl(url);
            } catch (error) {
                console.error("Error fetching image URL:", error);
                setImageUrl(null);
            }
        };

        if (imagePath) {
            fetchImageUrl();
        }
    }, [imagePath]);

    return imageUrl;
}