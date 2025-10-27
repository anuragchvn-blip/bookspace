// API utility functions for backend routes

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

/**
 * Standard API response format
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: number;
}

/**
 * Create a successful API response
 */
export function successResponse<T>(data: T, status = 200): NextResponse {
  const response: ApiResponse<T> = {
    success: true,
    data,
    timestamp: Date.now(),
  };
  return NextResponse.json(response, { status });
}

/**
 * Create an error API response
 */
export function errorResponse(
  code: string,
  message: string,
  status = 400,
  details?: any
): NextResponse {
  const response: ApiResponse = {
    success: false,
    error: {
      code,
      message,
      details,
    },
    timestamp: Date.now(),
  };
  return NextResponse.json(response, { status });
}

/**
 * Validate request body against a Zod schema
 */
export async function validateRequest<T>(
  request: NextRequest,
  schema: z.ZodSchema<T>
): Promise<{ data: T; error: null } | { data: null; error: NextResponse }> {
  try {
    const body = await request.json();
    const validated = schema.parse(body);
    return { data: validated, error: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        data: null,
        error: errorResponse(
          'VALIDATION_ERROR',
          'Invalid request data',
          400,
          error.errors
        ),
      };
    }
    return {
      data: null,
      error: errorResponse('PARSE_ERROR', 'Failed to parse request body', 400),
    };
  }
}

/**
 * Rate limiting configuration
 */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  identifier: string,
  maxRequests = 10,
  windowMs = 60000
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetAt) {
    // New window
    const resetAt = now + windowMs;
    rateLimitMap.set(identifier, { count: 1, resetAt });
    return { allowed: true, remaining: maxRequests - 1, resetAt };
  }

  if (record.count >= maxRequests) {
    // Rate limit exceeded
    return { allowed: false, remaining: 0, resetAt: record.resetAt };
  }

  // Increment count
  record.count++;
  return {
    allowed: true,
    remaining: maxRequests - record.count,
    resetAt: record.resetAt,
  };
}

/**
 * Get client IP address from request
 */
export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const real = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (real) {
    return real;
  }
  
  return 'unknown';
}

/**
 * Verify API key from request headers
 */
export function verifyApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get('x-api-key');
  const validApiKey = process.env.INTERNAL_API_KEY;
  
  if (!validApiKey) {
    console.warn('INTERNAL_API_KEY not set in environment variables');
    return true; // Allow if not configured (dev mode)
  }
  
  return apiKey === validApiKey;
}

/**
 * CORS headers for API routes
 */
export function getCorsHeaders(origin?: string) {
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['*'];
  const isAllowed = allowedOrigins.includes('*') || 
                    (origin && allowedOrigins.includes(origin));
  
  return {
    'Access-Control-Allow-Origin': isAllowed ? (origin || '*') : allowedOrigins[0],
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
    'Access-Control-Max-Age': '86400',
  };
}

/**
 * Handle OPTIONS preflight requests
 */
export function handleOptionsRequest(request: NextRequest): NextResponse {
  const origin = request.headers.get('origin') || undefined;
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(origin),
  });
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

/**
 * Validate Ethereum address
 */
export function isValidEthAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate Solana address
 */
export function isValidSolanaAddress(address: string): boolean {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
}

/**
 * Format error for logging
 */
export function formatError(error: unknown): {
  message: string;
  stack?: string;
  code?: string;
} {
  if (error instanceof Error) {
    return {
      message: error.message,
      stack: error.stack,
      code: (error as any).code,
    };
  }
  return {
    message: String(error),
  };
}

/**
 * Log API request for monitoring
 */
export function logApiRequest(
  method: string,
  path: string,
  status: number,
  duration: number,
  ip: string
) {
  const timestamp = new Date().toISOString();
  console.log(
    `[${timestamp}] ${method} ${path} ${status} ${duration}ms - ${ip}`
  );
}

/**
 * Cache control headers
 */
export function getCacheHeaders(maxAge = 0, staleWhileRevalidate = 0) {
  if (maxAge === 0) {
    return {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    };
  }
  
  return {
    'Cache-Control': `public, max-age=${maxAge}, stale-while-revalidate=${staleWhileRevalidate}`,
  };
}

/**
 * Middleware wrapper for API routes with error handling
 */
export function withApiMiddleware(
  handler: (request: NextRequest) => Promise<NextResponse>,
  options: {
    requireAuth?: boolean;
    rateLimit?: { maxRequests: number; windowMs: number };
  } = {}
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const startTime = Date.now();
    const ip = getClientIp(request);
    const path = request.nextUrl.pathname;

    try {
      // Handle OPTIONS preflight
      if (request.method === 'OPTIONS') {
        return handleOptionsRequest(request);
      }

      // Rate limiting
      if (options.rateLimit) {
        const rateLimitKey = `${ip}:${path}`;
        const rateLimit = checkRateLimit(
          rateLimitKey,
          options.rateLimit.maxRequests,
          options.rateLimit.windowMs
        );

        if (!rateLimit.allowed) {
          return errorResponse(
            'RATE_LIMIT_EXCEEDED',
            'Too many requests. Please try again later.',
            429,
            { resetAt: rateLimit.resetAt }
          );
        }
      }

      // API key verification (for internal routes)
      if (options.requireAuth && !verifyApiKey(request)) {
        return errorResponse('UNAUTHORIZED', 'Invalid or missing API key', 401);
      }

      // Execute handler
      const response = await handler(request);

      // Log request
      const duration = Date.now() - startTime;
      logApiRequest(request.method, path, response.status, duration, ip);

      // Add CORS headers
      const origin = request.headers.get('origin') || undefined;
      const corsHeaders = getCorsHeaders(origin);
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });

      return response;
    } catch (error) {
      console.error('API Error:', formatError(error));
      
      // Log error
      const duration = Date.now() - startTime;
      logApiRequest(request.method, path, 500, duration, ip);

      return errorResponse(
        'INTERNAL_ERROR',
        'An unexpected error occurred',
        500,
        process.env.NODE_ENV === 'development' ? formatError(error) : undefined
      );
    }
  };
}
