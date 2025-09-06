import { ObjectStatus } from "@/types/enums";

export function getEnumDisplayText<T extends number>(
    value: T,
    translationMap: { [key: number]: string },
    fallback?: string
): string {
    return translationMap[value] || fallback || `Unknown (${value})`;
}

export function displayObjectStatus(objectStatus: ObjectStatus, lang: string = 'en'): string {
    if (lang === 'en') {
        switch (objectStatus) {
            case ObjectStatus.ReadyToUse:
                return "Ready";
            case ObjectStatus.Drafted:
                return "Draft";
            case ObjectStatus.Obsoleted:
                return "Deleted";
            default:
                return "Unknown";
        }
    }
    else {
        switch (objectStatus) {
            case ObjectStatus.ReadyToUse:
                return "Hoạt động";
            case ObjectStatus.Drafted:
                return "Nháp";
            case ObjectStatus.Obsoleted:
                return "Đã hủy";
            default:
                return "Không xác định";
        }
    }

}