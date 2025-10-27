// Analytics tracking endpoint

import { NextRequest } from 'next/server';
import { z } from 'zod';
import {
  successResponse,
  errorResponse,
  validateRequest,
  withApiMiddleware,
  getClientIp,
} from '@/lib/api-utils';

const trackEventSchema = z.object({
  event: z.string().min(1).max(100),
  userAddress: z.string().optional(),
  properties: z.record(z.any()).optional(),
  timestamp: z.number().optional(),
});

// In-memory storage for demo (replace with database)
const events: any[] = [];

async function handler(request: NextRequest) {
  // Validate request
  const { data, error } = await validateRequest(request, trackEventSchema);
  if (error) return error;

  const { event, userAddress, properties, timestamp } = data;
  const ip = getClientIp(request);

  // Create event record
  const eventRecord = {
    id: Date.now().toString(),
    event,
    userAddress: userAddress || 'anonymous',
    properties: properties || {},
    timestamp: timestamp || Date.now(),
    ip,
    userAgent: request.headers.get('user-agent') || 'unknown',
  };

  // Store event (in production, use a database or analytics service)
  events.push(eventRecord);

  // Keep only last 1000 events in memory
  if (events.length > 1000) {
    events.shift();
  }

  // Log for monitoring
  console.log('Analytics event:', event, userAddress || 'anonymous');

  return successResponse({
    tracked: true,
    eventId: eventRecord.id,
  });
}

async function statsHandler(request: NextRequest) {
  // Get basic stats
  const totalEvents = events.length;
  const uniqueUsers = new Set(events.map(e => e.userAddress)).size;
  const eventTypes = events.reduce((acc, e) => {
    acc[e.event] = (acc[e.event] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return successResponse({
    totalEvents,
    uniqueUsers,
    eventTypes,
    recentEvents: events.slice(-10).reverse(),
  });
}

export const POST = withApiMiddleware(handler, {
  rateLimit: { maxRequests: 100, windowMs: 60000 },
});

export const GET = withApiMiddleware(statsHandler);
