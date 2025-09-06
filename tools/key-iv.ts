async function generateKeyAndIv() {
    // Tạo AES key
    const key = await crypto.subtle.generateKey(
        {
            name: 'AES-CBC',
            length: 256,
        },
        true,
        ['encrypt', 'decrypt']
    );

    // Tạo IV (Initialization Vector)
    const iv = crypto.getRandomValues(new Uint8Array(16));

    // Xuất key dưới dạng raw (để có thể lưu trữ hoặc sử dụng trực tiếp)
    const rawKey = await crypto.subtle.exportKey('raw', key);

    return {
        key: rawKey,
        iv: iv,
    };
}

// Hàm để mã hóa và giải mã có thể dùng key và iv này
// generateKeyAndIv().then(({ key, iv }) => {
//     console.log('Key:', new Uint8Array(key));
//     console.log('IV:', iv);
// });

function generateRandomString(length: number) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const randomKey = generateRandomString(16);
const randomIv = generateRandomString(16);

console.log('Random Key:', randomKey);
console.log('Random IV:', randomIv);
