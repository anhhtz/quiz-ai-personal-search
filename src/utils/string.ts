import { faker } from '@faker-js/faker';


export const generateRandomDisplayName = () => {
    return faker.person.fullName();
};

export const generateSlug = (text: string): string => {
    // Bảng chữ cái có dấu và không dấu tương ứng
    const vietnameseMap: { [key: string]: string } = {
        'à': 'a', 'á': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
        'ă': 'a', 'ắ': 'a', 'ằ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
        'â': 'a', 'ấ': 'a', 'ầ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
        'đ': 'd',
        'è': 'e', 'é': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
        'ê': 'e', 'ế': 'e', 'ề': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
        'ì': 'i', 'í': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
        'ò': 'o', 'ó': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
        'ô': 'o', 'ố': 'o', 'ồ': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
        'ơ': 'o', 'ớ': 'o', 'ờ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
        'ù': 'u', 'ú': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
        'ư': 'u', 'ứ': 'u', 'ừ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
        'ỳ': 'y', 'ý': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y'
    };

    // Chuyển thành chữ thường và loại bỏ dấu
    const normalizedText: string = text.toLowerCase().split('').map((char: string) => {
        return vietnameseMap[char] || char;
    }).join('');

    // Thay thế ký tự không phải chữ cái hoặc số bằng dấu gạch ngang
    let slugText: string = normalizedText.replace(/[^a-z0-9]+/g, '-');

    // Loại bỏ dấu gạch ngang ở đầu và cuối chuỗi, và thay thế nhiều dấu gạch ngang liên tiếp
    slugText = slugText.trim();
    return slugText.replace(/^-+|-+$/g, '').replace(/-+/g, '-');
};

export const displayInitials = (name: string) => {
    const words = name.split(" ");
    if (words.length === 1) {
        return words[0].charAt(0);
    } else {
        return words[0].charAt(0) + words[words.length - 1].charAt(0);
    }
};

/**
 * Generate a random string
 * @param length Length of the string
 * @returns Random string
 */
export function generateRandomString(length: number) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export function truncateText(text: string, maxLength: number = 100): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
}