# Google OAuth2 Integration with NestJS and Prisma — Implementation Documentation

## Overview

This documentation summarizes the design and implementation details of Google OAuth2 integration for authentication within a NestJS application using Prisma ORM. The integration covers:

- Initiating Google OAuth2 login flow
- Validating and persisting Google user profiles and OAuth tokens into the database
- Issuing JWT tokens on successful authentication
- API endpoint documentation with Swagger annotations
- Guard and strategy setup for PassportJS Google OAuth

---

## 1. Prisma Schema Usage

We utilized existing Prisma models to store users, OAuth accounts, and sessions:

- **User**: Stores user data such as email, name, image, email verification timestamp, and related relations.
- **Account**: Stores OAuth provider details and tokens (`access_token`, `refresh_token`, `id_token`, etc.).
- **Session**: (Prepared for future JWT session management).

---

## 2. DTOs (Data Transfer Objects)

### GoogleProfileDto

Validated and documented using `class-validator` and `@nestjs/swagger` decorators:

- Captures Google user profile fields: `id`, `emails`, `name`, `photos`.
- Nested DTOs for `GoogleNameDto`, `GoogleEmailDto`, `GooglePhotoDto` with validation and example data.

### GoogleTokenDto

Contains fields for Google OAuth tokens and metadata:

- `accessToken`, `refreshToken`, `idToken`, `expiresAt`, `scope`, `tokenType`.

---

## 3. Auth Service: `validateGoogleProfile` Method

- Extracts user details (`email`, `name`, `image`) from the Google profile.
- Validates presence of an email (throws error if absent).
- Attempts to find an existing user by email.
- If user does not exist, creates a new user record.
- If user exists but `image` is null, updates the user record with Google profile image.
- Upserts OAuth account record with latest tokens and provider data linked to the user.

---

## 4. Google OAuth Strategy

- Implemented a Passport strategy extending `passport-google-oauth20`.
- Configured with client ID, secret, callback URL, and requested scopes (`email`, `profile`).
- The `validate` method extracts Google profile data and passes it on for further validation and persistence.

---

## 5. Guards

- Created `GoogleAuthGuard` extending Passport’s Google guard to protect OAuth routes.
- Properly typed request objects to include Passport’s `logIn` method to fix type errors.

---

## 6. Controller Endpoints

### `GET /auth/google`

- Initiates Google OAuth2 login flow.
- Protected by `GoogleAuthGuard`.
- Documented with Swagger annotations (`@ApiOperation`, `@ApiResponse`).

### `GET /auth/google/callback`

- Handles OAuth2 callback.
- Uses `GoogleAuthGuard` to validate the callback.
- Uses a strongly typed request interface (`AuthRequest`) to access `req.user`.
- Calls `validateGoogleProfile` to save/update the user and account data.
- Generates JWT token upon successful login.
- Sets an HTTP-only cookie with the JWT token.
- Returns JSON response containing success message, JWT token, and user profile.
- Fully documented with Swagger.

---

## 7. Types and Interfaces

- Defined `AuthRequest` interface extending Express `Request` to strongly type `req.user` with user properties (`id`, `email`, `name`, `role`).

---

## 8. Validation and Error Handling

- Used validation decorators (`class-validator`) to enforce DTO correctness.
- Throws explicit error if Google profile does not provide an email.

---

## 9. Future Considerations

- Implement session management and JWT refresh tokens.
- Extend OAuth support for additional providers (e.g., GitHub).
- Enhance error handling and logging.
- Consider updating additional user profile fields upon login if missing.

---

## Summary

This implementation enables robust, secure Google OAuth2 authentication with profile persistence and JWT issuance, using NestJS, PassportJS, and Prisma. API endpoints are well-documented with Swagger, enabling ease of use and integration in client applications.
