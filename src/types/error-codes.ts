export enum ErrorCode {
    // General errors (1000-1999)
    UNKNOWN_ERROR = 1000,
    INVALID_PARAM = 1001,
    UNAUTHORIZED = 1002,
    FORBIDDEN = 1003,
    NOT_FOUND = 1004,
    VALIDATION_ERROR = 1005,
    DATABASE_ERROR = 1006,
    NETWORK_ERROR = 1007,
    TIMEOUT_ERROR = 1008,
    RATE_LIMIT_EXCEEDED = 1009,

    // Authentication errors (2000-2999)
    INVALID_CREDENTIALS = 2000,
    TOKEN_EXPIRED = 2001,
    TOKEN_INVALID = 2002,
    ACCOUNT_LOCKED = 2003,
    ACCOUNT_DISABLED = 2004,
    PASSWORD_EXPIRED = 2005,
    INVALID_OTP = 2006,

    // User errors (3000-3999)
    USER_NOT_FOUND = 3000,
    USER_ALREADY_EXISTS = 3001,
    USER_INACTIVE = 3002,
    USER_DELETED = 3003,
    INVALID_USER_ROLE = 3004,
    USER_PROFILE_INCOMPLETE = 3005,

    // Resource errors (4000-4999)
    RESOURCE_NOT_FOUND = 4000,
    RESOURCE_ALREADY_EXISTS = 4001,
    RESOURCE_IN_USE = 4002,
    RESOURCE_LOCKED = 4003,
    RESOURCE_EXPIRED = 4004,
    RESOURCE_LIMIT_EXCEEDED = 4005,

    // Business logic errors (5000-5999)
    INVALID_OPERATION = 5000,
    OPERATION_NOT_ALLOWED = 5001,
    OPERATION_FAILED = 5002,
    OPERATION_TIMEOUT = 5003,
    OPERATION_CANCELLED = 5004,
    OPERATION_IN_PROGRESS = 5005,

    // Internal errors (6000-6999)
    INTERNAL_ERROR = 6000,
    EXTERNAL_SERVICE_ERROR = 6002,

    // Validation errors (7000-7999)
    MISSING_REQUIRED_FIELD = 7000,
    TOO_SHORT = 7001,
    TOO_LONG = 7002,
    INVALID_FORMAT = 7003,
}

export const ErrorMessages: Record<ErrorCode, string> = {
    // General errors
    [ErrorCode.UNKNOWN_ERROR]: "Đã xảy ra lỗi không xác định",
    [ErrorCode.INVALID_PARAM]: "Tham số không hợp lệ",
    [ErrorCode.UNAUTHORIZED]: "Bạn chưa đăng nhập",
    [ErrorCode.FORBIDDEN]: "Bạn không có quyền thực hiện thao tác này",
    [ErrorCode.NOT_FOUND]: "Không tìm thấy tài nguyên",
    [ErrorCode.VALIDATION_ERROR]: "Dữ liệu không hợp lệ",
    [ErrorCode.DATABASE_ERROR]: "Lỗi cơ sở dữ liệu",
    [ErrorCode.NETWORK_ERROR]: "Lỗi kết nối mạng",
    [ErrorCode.TIMEOUT_ERROR]: "Yêu cầu hết thời gian chờ",
    [ErrorCode.RATE_LIMIT_EXCEEDED]: "Vượt quá giới hạn yêu cầu",

    // Authentication errors
    [ErrorCode.INVALID_CREDENTIALS]: "Thông tin đăng nhập không chính xác",
    [ErrorCode.TOKEN_EXPIRED]: "Phiên đăng nhập đã hết hạn",
    [ErrorCode.TOKEN_INVALID]: "Phiên đăng nhập không hợp lệ",
    [ErrorCode.ACCOUNT_LOCKED]: "Tài khoản đã bị khóa",
    [ErrorCode.ACCOUNT_DISABLED]: "Tài khoản đã bị vô hiệu hóa",
    [ErrorCode.PASSWORD_EXPIRED]: "Mật khẩu đã hết hạn",
    [ErrorCode.INVALID_OTP]: "Mã OTP không hợp lệ",

    // User errors
    [ErrorCode.USER_NOT_FOUND]: "Không tìm thấy người dùng",
    [ErrorCode.USER_ALREADY_EXISTS]: "Người dùng đã tồn tại",
    [ErrorCode.USER_INACTIVE]: "Tài khoản người dùng không hoạt động",
    [ErrorCode.USER_DELETED]: "Tài khoản người dùng đã bị xóa",
    [ErrorCode.INVALID_USER_ROLE]: "Vai trò người dùng không hợp lệ",
    [ErrorCode.USER_PROFILE_INCOMPLETE]: "Thông tin người dùng chưa đầy đủ",

    // Resource errors
    [ErrorCode.RESOURCE_NOT_FOUND]: "Không tìm thấy tài nguyên",
    [ErrorCode.RESOURCE_ALREADY_EXISTS]: "Tài nguyên đã tồn tại",
    [ErrorCode.RESOURCE_IN_USE]: "Tài nguyên đang được sử dụng",
    [ErrorCode.RESOURCE_LOCKED]: "Tài nguyên đang bị khóa",
    [ErrorCode.RESOURCE_EXPIRED]: "Tài nguyên đã hết hạn",
    [ErrorCode.RESOURCE_LIMIT_EXCEEDED]: "Vượt quá giới hạn tài nguyên",

    // Business logic errors
    [ErrorCode.INVALID_OPERATION]: "Thao tác không hợp lệ",
    [ErrorCode.OPERATION_NOT_ALLOWED]: "Không được phép thực hiện thao tác này",
    [ErrorCode.OPERATION_FAILED]: "Thao tác thất bại",
    [ErrorCode.OPERATION_TIMEOUT]: "Thao tác hết thời gian chờ",
    [ErrorCode.OPERATION_CANCELLED]: "Thao tác đã bị hủy",
    [ErrorCode.OPERATION_IN_PROGRESS]: "Thao tác đang được thực hiện",

    // Internal errors
    [ErrorCode.INTERNAL_ERROR]: "Đã xảy ra lỗi không xác định",
    [ErrorCode.EXTERNAL_SERVICE_ERROR]: "Đã xảy ra lỗi khi gọi dịch vụ bên ngoài",

    // Validation errors
    [ErrorCode.MISSING_REQUIRED_FIELD]: "Thiếu thông tin bắt buộc",
    [ErrorCode.TOO_SHORT]: "Dữ liệu quá ngắn",
    [ErrorCode.TOO_LONG]: "Dữ liệu quá dài",
    [ErrorCode.INVALID_FORMAT]: "Định dạng không hợp lệ",
};

// function to get error message from error code
export const getErrorMessage = (errorCode: ErrorCode) => {
    return ErrorMessages[errorCode] || "Đã xảy ra lỗi không xác định";
};