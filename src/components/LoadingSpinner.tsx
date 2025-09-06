import { Center, Loader, Stack, Text } from '@mantine/core'

export function LoadingSpinner({ message }: { message: string }) {
    return (
        <Center p="xl">
            <Stack align="center" gap="sm">
                <Loader size="md" type="dots" />
                <Text size="sm" c="dimmed">
                    {message}
                </Text>
            </Stack>
        </Center>
    )
}
