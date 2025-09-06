const getClientIP = (request: Request) => {
    try {
        const headers = request.headers;

        // const xForwardedFor = headers.get('x-forwarded-for');
        // const xRealIp = headers.get('x-real-ip');
        // const remoteAddr = headers.get('x-remote-addr');

        // const clientIp = xForwardedFor || xRealIp || remoteAddr;

        // return clientIp
        const cfConnectingIp = headers.get('cf-connecting-ip');
        if (cfConnectingIp) {
            return cfConnectingIp;
        }

        const xForwardedFor = headers.get('x-forwarded-for');
        if (xForwardedFor) {
            const ips = xForwardedFor.split(',');
            return ips[0].trim();
        }

        const trueClientIp = headers.get('true-client-ip');
        if (trueClientIp) {
            return trueClientIp;
        }

        const xRealIp = headers.get('x-real-ip');
        if (xRealIp) {
            return xRealIp;
        }

        const remoteAddr = headers.get('x-remote-addr');
        if (remoteAddr) {
            return remoteAddr;
        }
    } catch (error) {
    }

    // Nếu không có header nào, trả về undefined
    return undefined;
}

export default getClientIP
