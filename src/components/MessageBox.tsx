import { Button, CloseButton, Group, Paper, Text } from '@mantine/core';

interface Props {
  title?: string
  message?: string
  buttons: Array<{
    label: string
    onClick: () => void
  }>
}
export function MessageBox(props: Props) {
  return (
    <Paper withBorder p="lg" radius="md" shadow="md">
      <Group justify="space-between" mb="xs">
        <Text fz="md" fw={500}>
          {props.title}
        </Text>
        <CloseButton mr={-9} mt={-9} />
      </Group>
      <Text fz="sm">
        {props.message}
      </Text>
      <Group justify="flex-end" mt="md">
        {props.buttons.map((button, index) => (
          <Button key={index} variant="default" size="sm" onClick={button.onClick}>
            {button.label}
          </Button>
        ))}
        {/* <Button variant="default" size="xs">
          Cookies preferences
        </Button>
        <Button variant="outline" size="xs">
          Accept all
        </Button> */}
      </Group>
    </Paper>
  );
}