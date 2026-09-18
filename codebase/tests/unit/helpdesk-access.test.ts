import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  canAccessLearningFeatures,
  resolveBackendUserIdentity,
  resolveBackendUserRole,
} from '../../src/lib/auth/helpdesk-access';

afterEach(() => vi.unstubAllGlobals());

describe('Helpdesk access', () => {
  it('giữ nguyên role backend và fail closed về Visitor', async () => {
    expect(canAccessLearningFeatures('Visitor')).toBe(false);
    expect(canAccessLearningFeatures('Member')).toBe(true);
    expect(canAccessLearningFeatures('Lecture')).toBe(true);
    expect(canAccessLearningFeatures('SuperAdmin')).toBe(true);
    await expect(resolveBackendUserRole(null)).resolves.toBe('Visitor');
  });

  it('chỉ tin role do backend xác nhận', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(() => Promise.resolve(
        new Response(JSON.stringify({ success: true, data: { id: 'user-123', role: 'Member' } }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      )),
    );

    await expect(resolveBackendUserRole('Bearer signed-token')).resolves.toBe('Member');
    await expect(resolveBackendUserIdentity('Bearer signed-token')).resolves.toEqual({
      role: 'Member',
      userId: 'user-123',
    });
  });
});
