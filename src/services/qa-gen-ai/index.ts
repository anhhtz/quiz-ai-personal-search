// import { PrismaClient } from "@prisma/client";
import mammoth from 'mammoth';

const prepareData = async (documentFilePath: string) => {
    const result = await mammoth.extractRawText({ path: documentFilePath })
    const value = result.value;

    // // define regex pattern
    const pattern = /Điều \d+\..*?(?=(Điều \d+\.|$))/gs;

    // // mảng chứa các "Điều xx"
    const splittedArray = splitTextByRegex(value, pattern);
    return splittedArray;
}

const splitTextByRegex = (value: string, regex: RegExp) => {

    let match;
    const result = [];

    while ((match = regex.exec(value)) !== null) {
        result.push(match[0].trim());
    }
    return result;
}

export { prepareData };
