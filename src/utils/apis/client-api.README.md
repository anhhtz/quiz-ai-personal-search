```jsx
'use client';

import { useState } from 'react';
import { apiClient, ApiClientError } from '@/lib/client-api';

export default function UserForm() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any[]>([]);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setErrors([]);

    try {
      const userData = {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
      };

      const result = await apiClient.post('/users', userData);
      console.log('User created:', result);

    } catch (error) {
      if (error instanceof ApiClientError) {
        if (error.error?.details) {
          setErrors(error.error.details);
        } else {
          setErrors([{ message: error.message }]);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    // Your form JSX here
  );
}
```
