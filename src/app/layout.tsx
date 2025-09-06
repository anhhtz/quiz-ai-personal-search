// import { quickSand } from '@/styles/fonts';
import { NavigationProgressBar } from "@/components/NavigationProgressBar";
import { theme } from "@/styles/theme";
import "@mantine/carousel/styles.css";
import "@mantine/code-highlight/styles.css";
import { DirectionProvider, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import "@mantine/nprogress/styles.css";
import { Analytics } from "@vercel/analytics/next";
import { AppProvider } from "./providers";

export const metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "https://quiz.ai"),
  title: {
    default: "Quiz.AI",
    template: "%s | Quiz.AI",
  },
  description: "Ứng dụng ôn tập, thi thử trắc nghiệm trực tuyến Quiz.AI",
  keywords: ["Quiz", "Quiz.AI"],
  authors: {
    organization: "Quiz.AI Team",
  },
  openGraph: {
    images: "/static/images/og/og.png",
  },

  // manifest: `${process.env.NEXTAUTH_URL!}/site.webmanifest`,
};
export const dynamic = "force-dynamic";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en-US"
      // className={quickSand.className}
    >
      <head>
        {/* <ColorSchemeScript /> */}
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <DirectionProvider>
          <MantineProvider theme={theme}>
            <NavigationProgressBar />
            <Notifications position="top-right" autoClose={7000} />
            <ModalsProvider>
              <AppProvider>{children}</AppProvider>
              <Analytics />
            </ModalsProvider>
          </MantineProvider>
        </DirectionProvider>
      </body>
    </html>
  );
}
