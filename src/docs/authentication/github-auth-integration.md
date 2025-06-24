# Extending OAuth Support for GitHub in NestJS with Prisma

## 1. Prisma Schema Considerations

Your existing `Account` model is already structured to support multiple OAuth providers, including GitHub. No schema changes are required.

## 2. Create DTOs for GitHub Profile and Tokens

Define DTOs to validate and document GitHub profile data and OAuth tokens.

Example:

```typescript
// src/auth/dto/github-profile.dto.ts
import { IsString, IsUrl, IsOptional, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GitHubProfileDto {
  @ApiProperty({ example: '12345678' })
  @IsString()
  id: string;

  @ApiProperty({ example: 'octocat' })
  @IsString()
  login: string;

  @ApiPropertyOptional({ example: 'The Octocat' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'octocat@github.com' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ example: 'https://avatars.githubusercontent.com/u/12345678?v=4' })
  @IsOptional()
  @IsUrl()
  avatar_url?: string;
}

export class GitHubTokenDto {
  @ApiProperty()
  @IsString()
  accessToken: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  refreshToken?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  scope?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tokenType?: string;
}
```

## 3. Implement GitHub Passport Strategy

Create a GitHub strategy extending `passport-github2`.

```typescript
// src/auth/strategies/github.strategy.ts
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy, VerifyCallback } from 'passport-github2';

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor() {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ['user:email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { id, username, displayName, emails, photos } = profile;

    const user = {
      id,
      login: username,
      name: displayName,
      email: emails?.[0]?.value,
      avatar_url: photos?.[0]?.value,
      accessToken,
      refreshToken,
    };

    done(null, user);
  }
}
```

## 4. Create GitHub Auth Guard

```typescript
// src/auth/guards/github.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GitHubAuthGuard extends AuthGuard('github') {}
```

## 5. Update Auth Service to Validate GitHub Profile

Add a method to validate and persist GitHub profile data, similar to Google:

```typescript
async validateGitHubProfile(profile: GitHubProfileDto, tokens: GitHubTokenDto) {
  const { id, email, name, avatar_url } = profile;

  if (!email) {
    throw new Error('GitHub profile does not contain a valid email address.');
  }

  let user = await this.prisma.user.findUnique({ where: { email } });

  if (!user) {
    user = await this.prisma.user.create({
      data: {
        email,
        name,
        image: avatar_url,
        emailVerified: new Date(),
      },
    });
  } else if (!user.image && avatar_url) {
    await this.prisma.user.update({
      where: { id: user.id },
      data: { image: avatar_url },
    });
  }

  await this.prisma.account.upsert({
    where: {
      provider_providerAccountId: {
        provider: 'github',
        providerAccountId: id,
      },
    },
    update: {
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
      scope: tokens.scope,
      token_type: tokens.tokenType,
    },
    create: {
      provider: 'github',
      providerAccountId: id,
      type: 'oauth',
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
      scope: tokens.scope,
      token_type: tokens.tokenType,
      createdBy: {
        connect: { id: user.id },
      },
    },
  });

  return user;
}
```

## 6. Add Controller Endpoints

Add GitHub OAuth endpoints in your AuthController:

```typescript
@Get('github')
@UseGuards(GitHubAuthGuard)
@ApiOperation({ summary: 'Initiate GitHub OAuth2 login' })
@ApiResponse({ status: 302, description: 'Redirects to GitHub login' })
async githubAuth() {
  // Initiates the GitHub OAuth2 login flow
}

@Get('github/callback')
@UseGuards(GitHubAuthGuard)
@ApiOperation({ summary: 'Handle GitHub OAuth2 callback and issue JWT token' })
@ApiResponse({ status: 200, description: 'GitHub login successful with JWT issued' })
@ApiResponse({ status: 401, description: 'Unauthorized or failed login attempt' })
async githubAuthRedirect(@Req() req: AuthRequest, @Res() res: Response) {
  const profile = req.user;

  const user = await this.authService.validateGitHubProfile(profile, {
    accessToken: profile.accessToken,
    refreshToken: profile.refreshToken,
    scope: profile.scope,
    tokenType: profile.tokenType,
  });

  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = await this.authService.generateToken(payload);
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  return res.json({
    message: 'GitHub login successful',
    accessToken,
    user,
  });
}
```

## 7. Environment Variables

Ensure you have these set in your `.env`:

```
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=https://your-domain.com/auth/github/callback
```

## 8. Register Strategy and Guard in Module

Import and provide `GitHubStrategy` and `GitHubAuthGuard` similarly as done for Google.

