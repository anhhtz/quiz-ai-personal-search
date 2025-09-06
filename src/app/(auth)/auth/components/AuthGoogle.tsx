'use client'
import {
    Center,
    Container,
    Mark,
    Paper,
    Stack,
    Text,
    Title,
    Tooltip,
    rem
} from '@mantine/core'
import { IconInfoCircle } from '@tabler/icons-react'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import classes from './AuthFormCheck.module.css'
import { GoogleButton } from './GoogleButton'



export default function AuthGoogle() {
    // callbackUrl
    const searchParams = useSearchParams()
    const callbackUrl = searchParams?.get('callbackUrl') || '/' // Mặc định quay về trang chủ nếu không có callbackUrl
    // States
    

    /**
     * render UI
     */
    return (
        <>
            <Container size={500} my={40}>
                <Title ta="center" className={classes.title}>
                    Đăng nhập Quiz.AI <Mark>Console</Mark>
                </Title>

                <Paper withBorder shadow="md" p={{ base: 25, md: 30, lg: 30 }} mt={30} pb={40}>
                    <form>
                        <Stack gap={'md'}>
                            {/* Buttons */}
                            <GoogleButton
                            key={'google'}
                            fullWidth
                            onClick={() =>
                                // push("/auth/google")
                                signIn('google', { callbackUrl })
                            }
                        >
                            Đăng nhập bằng Google
                        </GoogleButton>
                        </Stack>
                    </form>
                </Paper>
                
            </Container>
        </>
    )
}

const emailTipRightSection = (
    <Tooltip
        label="We store your data securely"
        position="top-end"
        withArrow
        transitionProps={{ transition: 'pop-bottom-right' }}
    >
        <Text component="div" c="dimmed" style={{ cursor: 'help' }}>
            <Center>
                <IconInfoCircle style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
            </Center>
        </Text>
    </Tooltip>
)
const passwordTipRightSection = (
    <Tooltip
        label="Đặt mật khẩu mạnh. Không trùng với mật khẩu Email/AD"
        position="top-end"
        withArrow
        transitionProps={{ transition: 'pop-bottom-right' }}
    >
        <Text component="div" c="dimmed" style={{ cursor: 'help' }}>
            <Center>
                <IconInfoCircle style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
            </Center>
        </Text>
    </Tooltip>
)
