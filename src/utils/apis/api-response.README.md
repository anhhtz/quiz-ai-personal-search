## `app/api/users/route.ts` - Example usage

````ts
// app/api/users/route.ts - Example usage

import { NextRequest } from 'next/server';
import { ApiSuccess, ApiError, ValidationHelper, withErrorHandling } from '@/lib/api-response';

// GET /api/users
export const GET = withErrorHandling(async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams?.get('page') || '1');
  const limit = parseInt(searchParams?.get('limit') || '10');

  // Simulate database query
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  ];

  const response = {
    users,
    pagination: {
      page,
      limit,
      total: users.length,
      totalPages: Math.ceil(users.length / limit),
    },
  };

  return ApiSuccess.ok(response, 'Users retrieved successfully');
});

// POST /api/users
export const POST = withErrorHandling(async (request: NextRequest) => {
  const body = await request.json();
  const { name, email, password } = body;

  // Validation
  const validationErrors = [];

  if (!name) {
    validationErrors.push(ValidationHelper.required('name'));
  }

  if (!email) {
    validationErrors.push(ValidationHelper.required('email'));
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    validationErrors.push(ValidationHelper.invalidFormat('email', 'valid email'));
  }

  if (!password) {
    validationErrors.push(ValidationHelper.required('password'));
  } else if (password.length < 8) {
    validationErrors.push(ValidationHelper.tooShort('password', 8));
  }

  if (validationErrors.length > 0) {
    return ApiError.validation('Validation failed', validationErrors);
  }

  // Check if user exists
  const existingUser = false; // Simulate database check
  if (existingUser) {
    return ApiError.conflict('User already exists', 'USER_ALREADY_EXISTS');
  }

  // Create user (simulate)
  const newUser = {
    id: Date.now(),
    name,
    email,
    createdAt: new Date().toISOString(),
  };

  return ApiSuccess.created(newUser, 'User created successfully');
});

// app/api/users/[id]/route.ts - Dynamic route example

interface RouteParams {
  params: { id: string };
}

export const GET = withErrorHandling(async (
  request: NextRequest,
  { params }: RouteParams
) => {
  const { id } = params;

  if (!id || isNaN(Number(id))) {
    return ApiError.badRequest('Invalid user ID');
  }

  // Simulate database query
  const user = null; // Simulate user not found

  if (!user) {
    return ApiError.notFound('User not found');
  }

  return ApiSuccess.ok(user, 'User retrieved successfully');
});

export const PUT = withErrorHandling(async (
  request: NextRequest,
  { params }: RouteParams
) => {
  const { id } = params;
  const body = await request.json();

  // Validation
  const validationErrors = [];

  if (body.name && body.name.length < 2) {
    validationErrors.push(ValidationHelper.tooShort('name', 2));
  }

  if (body.email && !/\S+@\S+\.\S+/.test(body.email)) {
    validationErrors.push(ValidationHelper.invalidFormat('email'));
  }

  if (validationErrors.length > 0) {
    return ApiError.validation('Validation failed', validationErrors);
  }

  // Simulate update
  const updatedUser = {
    id: parseInt(id),
    ...body,
    updatedAt: new Date().toISOString(),
  };

  return ApiSuccess.ok(updatedUser, 'User updated successfully');
});

export const DELETE = withErrorHandling(async (
  request: NextRequest,
  { params }: RouteParams
) => {
  const { id } = params;

  // Simulate deletion
  return ApiSuccess.noContent('User deleted successfully');
});

// app/api/auth/login/route.ts - Authentication example

export const POST = withErrorHandling(async (request: NextRequest) => {
  const body = await request.json();
  const { email, password } = body;

  // Validation
  const validationErrors = [];

  if (!email) {
    validationErrors.push(ValidationHelper.required('email'));
  }

  if (!password) {
    validationErrors.push(ValidationHelper.required('password'));
  }

  if (validationErrors.length > 0) {
    return ApiError.validation('Invalid login credentials', validationErrors);
  }

  // Simulate authentication
  const isValidCredentials = false; // Simulate invalid credentials

  if (!isValidCredentials) {
    return ApiError.unauthorized('Invalid email or password', 'INVALID_CREDENTIALS');
  }

  const loginResponse = {
    user: {
      id: 1,
      email,
      name: 'John Doe',
    },
    token: 'jwt_token_here',
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };

  return ApiSuccess.ok(loginResponse, 'Login successful');
});

// app/api/protected/route.ts - Protected route example

export const GET = withErrorHandling(async (request: NextRequest) => {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return ApiError.unauthorized('Missing or invalid authorization header');
  }

  const token = authHeader.substring(7);

  // Simulate token validation
  const isValidToken = false; // Simulate invalid token

  if (!isValidToken) {
    return ApiError.unauthorized('Invalid or expired token', 'TOKEN_INVALID');
  }

  const protectedData = {
    message: 'This is protected data',
    userId: 1,
    timestamp: new Date().toISOString(),
  };

  return ApiSuccess.ok(protectedData, 'Protected data retrieved');
});```
````
