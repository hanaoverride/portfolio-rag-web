import { describe, it, expect } from 'vitest';
import { middleware } from '../middleware';
import { NextRequest } from 'next/server';

describe('middleware', () => {
  describe('auth guard', () => {
    it('redirects unauthenticated user from /bookmark to /login', async () => {
      const request = new NextRequest('http://localhost/bookmark');
      const response = await middleware(request);
      expect([302, 307]).toContain(response.status);
      expect(response.headers.get('location')).toContain('/login?redirect=%2Fbookmark');
    });

    it('redirects unauthenticated user from /bookmark/123 to /login', async () => {
      const request = new NextRequest('http://localhost/bookmark/123');
      const response = await middleware(request);
      expect([302, 307]).toContain(response.status);
      expect(response.headers.get('location')).toContain('/login?redirect=%2Fbookmark%2F123');
    });

    it('redirects unauthenticated user from /profile to /login', async () => {
      const request = new NextRequest('http://localhost/profile');
      const response = await middleware(request);
      expect([302, 307]).toContain(response.status);
      expect(response.headers.get('location')).toContain('/login?redirect=%2Fprofile');
    });

    it('redirects unauthenticated user from /profile/settings to /login', async () => {
      const request = new NextRequest('http://localhost/profile/settings');
      const response = await middleware(request);
      expect([302, 307]).toContain(response.status);
      expect(response.headers.get('location')).toContain('/login?redirect=%2Fprofile%2Fsettings');
    });

    it('allows authenticated user to access /bookmark', async () => {
      const request = new NextRequest('http://localhost/bookmark', {
        headers: new Headers({ cookie: 'auth_token=valid_token' }),
      });
      const response = await middleware(request);
      expect(response.status).toBe(200);
    });

    it('allows authenticated user to access /profile', async () => {
      const request = new NextRequest('http://localhost/profile', {
        headers: new Headers({ cookie: 'auth_token=valid_token' }),
      });
      const response = await middleware(request);
      expect(response.status).toBe(200);
    });

    it('allows unauthenticated access to /login', async () => {
      const request = new NextRequest('http://localhost/login');
      const response = await middleware(request);
      expect(response.status).toBe(200);
    });

    it('allows unauthenticated access to /', async () => {
      const request = new NextRequest('http://localhost/');
      const response = await middleware(request);
      expect(response.status).toBe(200);
    });

    it('allows unauthenticated access to /contents', async () => {
      const request = new NextRequest('http://localhost/contents');
      const response = await middleware(request);
      expect(response.status).toBe(200);
    });
  });
});