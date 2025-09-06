import { Timestamp } from "firebase/firestore";
import moment from "moment";


export const convertISODateTime = (dateString: string) => {
    // Chuyển đổi chuỗi thành đối tượng Date
    const date = new Date(dateString);

    // Lấy năm, tháng, ngày, giờ, phút, giây, và mili giây
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

    // Định dạng chuỗi ngày giờ theo yêu cầu của PostgreSQL
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;

};

export const formatFirebaseDate = (timestamp: Timestamp): string => {
    const date = moment(timestamp.toDate());
    return date.format('DD/MM/YYYY HH:mm:ss');
}

// format Date to DD/MM/YYYY HH:mm:ss
export const formatDate = (date: Date): string => {
    return moment(date).format('DD/MM/YYYY HH:mm:ss');
}
