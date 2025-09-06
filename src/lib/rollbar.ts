import Rollbar from "rollbar";


const baseConfig = {
    captureUncaught: true,
    captureUnhandledRejections: true,
    environment: process.env.NODE_ENV,
};

export const rollbarClientConfig = {
    accessToken: process.env.NEXT_PUBLIC_ROLLBAR_CLIENT_TOKEN,
    ...baseConfig,
};



const rollbarServerInstance = new Rollbar({
    accessToken: process.env.ROLLBAR_SERVER_TOKEN,
    ...baseConfig,
});

rollbarServerInstance.configure({
    enabled: process.env.NODE_ENV === 'production',
})

export { rollbarServerInstance };
