import { Button, Modal, PasswordInput, Stack, TextInput } from '@mantine/core';
import { IconKey } from '@tabler/icons-react';
import { useState } from 'react';

interface PasswordModalProps {
	opened: boolean;
	onClose: () => void;
	onSubmit: (password: string) => void;
	email: string;
}

export function PasswordModal({ opened, onClose, onSubmit, email }: PasswordModalProps) {
	const [password, setPassword] = useState('');

	const handleSubmit = () => {
		onSubmit(password);
		setPassword('');
		onClose();
	};

	return (
		<Modal
			opened={opened}
			onClose={onClose}
			title="Đăng nhập bằng mật khẩu"
			closeOnClickOutside={false}
			closeOnEscape={false}
			overlayProps={{
				backgroundOpacity: 0.7,
				blur: 3,
			}}
		>
			<Stack>
				<TextInput label="Email" value={email} disabled />
				<PasswordInput
					label="Mật khẩu"
					placeholder="Nhập mật khẩu của bạn"
					value={password}
					onChange={e => setPassword(e.target.value)}
					required
					data-autofocus
					autoComplete="on"
				/>
				<Button onClick={handleSubmit} fullWidth leftSection={<IconKey size={16} />}>
					Đăng nhập
				</Button>
			</Stack>
		</Modal>
	);
}
