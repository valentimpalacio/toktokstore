// server/src/passport/google.strategy.ts
import { Strategy } from 'passport-google-oauth20';
import { prisma } from '@/config/prisma';
import { IUserProfile } from '@/types/user';

export const googleStrategy = new Strategy(
{
clientID: process.env.GOOGLE_CLIENT_ID!,
clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
callbackURL: '/api/auth/google/callback'
},
async (accessToken, refreshToken, profile, done) => {
try {
const existingUser = await prisma.user.findUnique({
where: { googleId: profile.id }
});

      if (existingUser) {
        return done(null, existingUser);
      }

      const newUser = await prisma.user.create({
        data: {
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          role: 'USER'
        }
      });

      return done(null, newUser);
    } catch (error) {
      return done(error as Error);
    }

}
);

// server/src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { UnauthorizedError } from '@/utils/errors';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
const token = req.headers.authorization?.split(' ')[1];

if (!token) {
throw new UnauthorizedError('Authentication required');
}

try {
const decoded = verify(token, process.env.JWT_SECRET!);
req.user = decoded;
next();
} catch (error) {
throw new UnauthorizedError('Invalid token');
}
};

// server/src/middleware/validate.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/utils/errors';

export const validateBody = (schema: any) => {
return (req: Request, res: Response, next: NextFunction) => {
try {
const validated = schema.parse(req.body);
req.body = validated;
next();
} catch (error) {
next(new AppError('Validation failed', 400, error));
}
};
};

// server/src/utils/logger.ts
import { createLogger, format, transports } from 'winston';

export const logger = createLogger({
level: 'info',
format: format.combine(
format.timestamp(),
format.json()
),
transports: [
new transports.Console(),
new transports.File({ filename: 'logs/error.log', level: 'error' }),
new transports.File({ filename: 'logs/combined.log' })
]
});

// server/src/utils/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from './errors';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
if (err instanceof AppError) {
return res.status(err.statusCode).json({
success: false,
message: err.message,
code: err.code
});
}

console.error(err.stack);

res.status(500).json({
success: false,
message: 'Internal server error',
code: 'INTERNAL_ERROR'
});
};

// server/src/utils/errors.ts
export class AppError extends Error {
constructor(
public message: string,
public statusCode: number = 500,
public code: string = 'ERROR',
public cause?: any
) {
super(message);
Object.setPrototypeOf(this, AppError.prototype);
}

static badRequest(message: string) {
return new AppError(message, 400, 'BAD_REQUEST');
}

static notFound(message: string) {
return new AppError(message, 404, 'NOT_FOUND');
}

static forbidden(message: string) {
return new AppError(message, 403, 'FORBIDDEN');
}

static unauthorized(message: string) {
return new AppError(message, 401, 'UNAUTHORIZED');
}

static conflict(message: string) {
return new AppError(message, 409, 'CONFLICT');
}
}

// server/src/config/passport.ts
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import passport from 'passport';
import { prisma } from '@/prisma';

passport.serializeUser((user: any, done) => {
done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
try {
const user = await prisma.user.findUnique({ where: { id } });
done(null, user);
} catch (error) {
done(error as Error);
}
});

export const configurePassport = () => {
passport.use(new GoogleStrategy({
clientID: process.env.GOOGLE_CLIENT_ID!,
clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
callbackURL: '/api/auth/google/callback'
},
async (accessToken, refreshToken, profile, done) => {
try {
const existingUser = await prisma.user.findUnique({
where: { googleId: profile.id }
});

      if (existingUser) {
        return done(null, existingUser);
      }

      const newUser = await prisma.user.create({
        data: {
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          role: 'USER'
        }
      });

      return done(null, newUser);
    } catch (error) {
      return done(error as Error);
    }

}));
};
