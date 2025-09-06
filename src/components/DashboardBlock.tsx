import { Card, Text, useMantineTheme } from "@mantine/core";

interface DashboardBlockProps {
  title: string;
  color?: string;
  children?: React.ReactNode;
}

export function DashboardBlock({
  title,
  color,
  children,
}: DashboardBlockProps) {
  const theme = useMantineTheme();

  return (
    <Card
      withBorder
      shadow="md"
      radius={"sm"}
      p="md"
      h="100%"
      style={{
        backgroundColor: color || theme.colors.blue[0],
        cursor: "move",
      }}
    >
      <Text size="lg" fw={500} mb="sm">
        {title}
      </Text>
      {children}
    </Card>
  );
}
