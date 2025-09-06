import CryptoJS from 'crypto-js';

const ENC_KEY = process.env.NEXT_PUBLIC_ENC_KEY || '4eA2NtEWAupJ9eVH';
const ENC_IV = process.env.NEXT_PUBLIC_ENC_IV || 'vKnDiBv4OlXz4411';

export const encryptString = async (dataString: string) => {
    // Key and IV for AES encryption (in a real application, manage keys securely)
    const key = CryptoJS.enc.Utf8.parse(ENC_KEY); // 16 bytes key
    const iv = CryptoJS.enc.Utf8.parse(ENC_IV); // 16 bytes IV

    // Encrypt the data
    const encrypted = CryptoJS.AES.encrypt(dataString, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    }).toString();

    return encrypted
}

export const decryptString = async (encryptedString: string) => {
    const cryptoKey = new TextEncoder().encode(ENC_KEY);
    const cryptoIv = new TextEncoder().encode(ENC_IV);


    const importedKey = await crypto.subtle.importKey(
        'raw',
        cryptoKey,
        { name: 'AES-CBC' },
        false,
        ['decrypt'],
    );

    const decrypted = await crypto.subtle.decrypt(
        {
            name: 'AES-CBC',
            iv: cryptoIv,
        },
        importedKey,
        Uint8Array.from(atob(encryptedString), c => c.charCodeAt(0)),
    );

    return new TextDecoder().decode(decrypted);

}

// export as cryptorUtils
export const cryptorUtils = {
    encryptString,
    decryptString
}