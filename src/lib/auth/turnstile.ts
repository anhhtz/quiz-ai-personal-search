/**
 * Turnstile validation
 */
import type { TurnstileServerValidationResponse } from '@marsidev/react-turnstile'

const VERIFY_ENDPOINT = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;

export const verifyTurnstileToken = async (token: string) => {
    const response = await fetch(VERIFY_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            secret: TURNSTILE_SECRET_KEY as string,
            response: token,
        }),
    });
    const data = (await response.json()) as TurnstileServerValidationResponse;
    return data.success;
};