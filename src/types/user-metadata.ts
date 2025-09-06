/**
 * Enum định danh các loại metadata cho người dùng.
 * Giúp đảm bảo tính nhất quán và gợi ý code trong toàn bộ ứng dụng.
 */
export enum MetaKey {
    // --- THÔNG TIN CÁ NHÂN ---
    /** Tên thường gọi, biệt danh */
    NICKNAME = 'NICKNAME',
    /** Giới thiệu ngắn về bản thân */
    BIO = 'BIO',
    /** Tình trạng hôn nhân (e.g., 'Single', 'Married') */
    MARITAL_STATUS = 'MARITAL_STATUS',
    /** Quốc tịch */
    NATIONALITY = 'NATIONALITY',

    // --- THÔNG TIN LIÊN HỆ ---
    /** Số điện thoại (dùng 'group' để phân loại 'WORK', 'HOME') */
    PHONE = 'PHONE',
    /** Địa chỉ (dùng 'group' để phân loại 'SHIPPING', 'BILLING', 'PERMANENT') */
    ADDRESS = 'ADDRESS',

    // --- THÔNG TIN NHẬN DẠNG ---
    /** Số Căn cước công dân / CMND */
    NATIONAL_ID = 'NATIONAL_ID',
    /** Số Hộ chiếu */
    PASSPORT_ID = 'PASSPORT_ID',
    /** Mã số thuế cá nhân */
    TAX_ID = 'TAX_ID',
    /** Số giấy phép lái xe */
    DRIVER_LICENSE_ID = 'DRIVER_LICENSE_ID',

    // --- THÔNG TIN CÔNG VIỆC & HỌC VẤN ---
    /** Chức danh hiện tại/cũ (dùng startDate, endDate cho lịch sử) */
    JOB_TITLE = 'JOB_TITLE',
    /** Tên công ty đang làm việc */
    COMPANY_NAME = 'COMPANY_NAME',
    /** Lĩnh vực, ngành nghề */
    INDUSTRY = 'INDUSTRY',
    /** Các kỹ năng chuyên môn */
    SKILL = 'SKILL',
    /** Tên trường đại học, cao đẳng */
    UNIVERSITY_NAME = 'UNIVERSITY_NAME',
    /** Bằng cấp cao nhất */
    DEGREE = 'DEGREE',

    // --- TÀI KHOẢN MẠNG XÃ HỘI ---
    /** URL trang cá nhân Facebook */
    FACEBOOK_URL = 'FACEBOOK_URL',
    /** URL trang cá nhân LinkedIn */
    LINKEDIN_URL = 'LINKEDIN_URL',
    /** Tên người dùng Github */
    GITHUB_USERNAME = 'GITHUB_USERNAME',
    /** Số điện thoại hoặc ID Zalo */
    ZALO_ID = 'ZALO_ID',
    /** Website cá nhân hoặc blog */
    WEBSITE_URL = 'WEBSITE_URL',

    // --- THÔNG TIN TÀI CHÍNH (Cẩn trọng với dữ liệu nhạy cảm) ---
    /** Phân loại khách hàng (e.g., 'VIP', 'Standard', 'New') */
    CUSTOMER_SEGMENT = 'CUSTOMER_SEGMENT',
    /** Điểm tín dụng nội bộ */
    CREDIT_SCORE = 'CREDIT_SCORE',
    /** Nguồn thu nhập chính */
    INCOME_SOURCE = 'INCOME_SOURCE',

    // --- CÀI ĐẶT & SỞ THÍCH ---
    /** Giao diện ưu thích (e.g., 'dark', 'light') */
    PREFERRED_THEME = 'PREFERRED_THEME',
    /** Ngôn ngữ ưu thích (e.g., 'vi', 'en') */
    PREFERRED_LANGUAGE = 'PREFERRED_LANGUAGE',
    /** Các sở thích cá nhân */
    HOBBY = 'HOBBY',

    /** Mã chi nhánh */
    BRANCH_CODE = 'BRANCH_CODE',
    /** Tên chi nhánh */
    BRANCH_NAME = 'BRANCH_NAME',
}