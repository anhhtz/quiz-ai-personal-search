"use client";
import { ApiResponse } from "@/utils/apis/api-response";
import {
  Anchor,
  Button,
  Center,
  Container,
  Divider,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
  rem,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Turnstile } from "@marsidev/react-turnstile";
import { IconInfoCircle, IconShieldCheckFilled } from "@tabler/icons-react";
import ky from "ky";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { ReactNode, useState } from "react";
import classes from "./AuthFormCheck.module.css";
import { GoogleButton } from "./GoogleButton";

const TURNSTILE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const ALLOWED_DOMAINS = (
  process.env.NEXT_PUBLIC_ALLOWED_DOMAINS ||
  "agribank.com.vn,agribank.me,quiz.ai"
)
  .split(",")
  .map((domain) => domain.trim());

export default function AuthFormCheck() {
  // callbackUrl
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl") || "/"; // Mặc định quay về trang chủ nếu không có callbackUrl
  // States
  const [emailError, setEmailError] = useState("");
  const [username, setUsername] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileError, setTurnstileError] = useState("");
  const { push } = useRouter();
  const [isTurnstileLoaded, setIsTurnstileLoaded] = useState(false);
  const [step, setStep] = useState("begin");
  const [name, setName] = useState("");
  const [loginProviders, setLoginProviders] = useState<number[]>([]);
  const [isLoading, setLoading] = useState(false);

  /**
   * Append @agribank.com.vn to username
   * @param username
   * @returns
   */
  const usernameToAgribankEmail = (username: string) => {
    if (!username) return "";
    return `${username}@agribank.com.vn`;
  };
  /**
   *
   * @param email
   * @returns
   */
  const isEmailValid = (email: string) => {
    if (!email)
      return {
        success: false,
        message: "Vui lòng sử dụng email hợp lệ",
        email,
      };

    const parts = email.split("@");
    //
    if (parts.length !== 2) {
      return {
        success: false,
        message: "Vui lòng sử dụng email hợp lệ",
        email,
      };
    }
    //
    // const username = parts[0];
    const domain = parts[1];

    const isAgribankEmail = ALLOWED_DOMAINS.includes(domain);
    if (!isAgribankEmail) {
      return {
        success: false,
        message: `Vui lòng sử dụng email: '@agribank.com.vn'`,
        email,
      };
    }
    return { success: true, message: "", email };
  };

  const handleSearchLoginMethod = async () => {
    try {
      if (!turnstileToken) {
        setTurnstileError(
          "Vui lòng xác thực bạn không phải robot trước khi đăng nhập"
        );
        notifications.show({
          title: "Xác thực thất bại",
          message: "Vui lòng xác thực bạn không phải robot trước khi đăng nhập",
          color: "red",
        });
        return;
      }
      //
      setLoading(true);
      // set email from username
      const email = usernameToAgribankEmail(username);
      const emailValidator = isEmailValid(email);
      if (!emailValidator.success) {
        setEmailError(emailValidator.message);
        return;
      }
      setEmailError("");

      const response = await ky
        .post("/api/auth/search-login-method", {
          json: { email, turnstileToken },
        })
        .json<ApiResponse>();

      if (response.success) {
        const { user, loginProviders } = await response.data;

        if (user) {
          setName(user.fullName || user.firstName || "");
        }
        // loginProvider : null
        if (!loginProviders || loginProviders.length === 0) {
          setLoginProviders([1]);
          setStep("loginX");
          setLoading(false);
          return;
        }
        setLoginProviders(loginProviders);
        setStep("loginX");
        setLoading(false);
      } else {
      }
    } catch (error) {
      console.log(error);
      notifications.show({
        title: "Lỗi",
        message: "Vui lòng thử lại sau",
        color: "red",
      });
      setLoading(false);
    }
  };

  /**
   * login by OTP
   * @returns
   */
  const handleOtpLogin = async () => {
    try {
      if (!turnstileToken) {
        setTurnstileError(
          "Vui lòng xác thực bạn không phải robot trước khi đăng nhập"
        );
        notifications.show({
          title: "Xác thực thất bại",
          message: "Vui lòng xác thực bạn không phải robot trước khi đăng nhập",
          color: "red",
        });
        return;
      }
      // set email from username
      const email = usernameToAgribankEmail(username);
      const emailValidator = isEmailValid(email);
      if (!emailValidator.success) {
        setEmailError(emailValidator.message);
        return;
      }
      setEmailError("");
      signIn("auth0", { callbackUrl }, { login_hint: email });
    } catch (error) {
      notifications.show({
        title: "Đăng nhập thất bại",
        message: "Vui lòng thử lại sau",
        color: "red",
      });
    }
  };

  const renderLoginMethodsButtons = () => {
    let buttons: ReactNode[] = [];

    loginProviders.forEach((provider) => {
      switch (provider) {
        case 1:
          buttons = [
            ...buttons,
            <Button
              key={provider}
              fullWidth
              onClick={() => handleOtpLogin()}
              leftSection={<IconShieldCheckFilled size={20} />}
            >
              Đăng nhập bằng OTP qua email Agribank
            </Button>,
          ];
          break;
        case 2:
          buttons = [
            ...buttons,
            <Divider key={`divider`} label="hoặc" labelPosition="center" />,
            <GoogleButton
              key={"google"}
              fullWidth
              onClick={() =>
                // push("/auth/google")
                signIn("google", { callbackUrl })
              }
            >
              Đăng nhập bằng Google
            </GoogleButton>,
          ];
          break;
        default:
          break;
      }
    });
    return buttons;
  };
  /**
   * render UI
   */
  return (
    <>
      <Container size={500} my={40}>
        <Title ta="center" className={classes.title}>
          Đăng nhập Quiz.AI
        </Title>

        <Paper
          withBorder
          shadow="md"
          p={{ base: 25, md: 30, lg: 30 }}
          mt={30}
          pb={40}
        >
          <form>
            <Stack gap={"md"}>
              {/* Email */}
              <TextInput
                name="username"
                label="Account Agribank"
                description="Nhập tài khoản Agribank của bạn để tiếp tục"
                placeholder="AnhHoangTuan2"
                size="md"
                mt={"md"}
                value={username}
                autoComplete="username"
                onChange={(e) => {
                  setUsername(e.target.value);
                  setEmailError("");
                }}
                error={emailError}
                required
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSearchLoginMethod();
                  }
                }}
                // rightSection={emailTipRightSection}
                rightSection={
                  <div style={{ fontSize: 14 }}>@agribank.com.vn</div>
                }
                rightSectionWidth={130}
                disabled={step !== "begin"}
                readOnly={step !== "begin"}
              />

              {/* Cloudflare Turnstile */}
              <Turnstile
                siteKey={TURNSTILE_KEY!}
                options={{
                  language: "vi",
                  size: "flexible",
                }}
                onSuccess={(token) => {
                  setTurnstileToken(token);
                  setTurnstileError("");
                }}
                onWidgetLoad={() => setIsTurnstileLoaded(true)}
                hidden={!isTurnstileLoaded}
              />
              {turnstileError && (
                <Text c="red" size="sm" mt={-8}>
                  {turnstileError}
                </Text>
              )}

              {/* Buttons */}
              {step !== "begin" && loginProviders.length > 0 && (
                <Stack>{renderLoginMethodsButtons()}</Stack>
              )}

              {/* ==================== */}
              {/* Search Login methods */}
              {/* ==================== */}
              {step === "begin" && (
                <Button
                  fullWidth
                  onClick={handleSearchLoginMethod}
                  leftSection={<IconShieldCheckFilled size={20} />}
                  loading={isLoading}
                >
                  Đăng nhập
                </Button>
              )}
            </Stack>
          </form>
        </Paper>
        {/* ============== */}
        {/* Documentations */}
        {/* ============== */}
        <Stack gap={"xs"} mt={"md"}>
          <Text c="dimmed" size="md" ta="center" mt={"md"}>
            <Anchor
              size="sm"
              href={
                process.env.NEXT_PUBLIC_DOCUMENTATION_URL ||
                "https://docs.quiz.ai"
              }
              target="_blank"
            >
              � Hướng dẫn đăng nhập
            </Anchor>
          </Text>
        </Stack>
      </Container>
    </>
  );
}

const emailTipRightSection = (
  <Tooltip
    label="We store your data securely"
    position="top-end"
    withArrow
    transitionProps={{ transition: "pop-bottom-right" }}
  >
    <Text component="div" c="dimmed" style={{ cursor: "help" }}>
      <Center>
        <IconInfoCircle
          style={{ width: rem(18), height: rem(18) }}
          stroke={1.5}
        />
      </Center>
    </Text>
  </Tooltip>
);
const passwordTipRightSection = (
  <Tooltip
    label="Đặt mật khẩu mạnh. Không trùng với mật khẩu Email/AD"
    position="top-end"
    withArrow
    transitionProps={{ transition: "pop-bottom-right" }}
  >
    <Text component="div" c="dimmed" style={{ cursor: "help" }}>
      <Center>
        <IconInfoCircle
          style={{ width: rem(18), height: rem(18) }}
          stroke={1.5}
        />
      </Center>
    </Text>
  </Tooltip>
);
