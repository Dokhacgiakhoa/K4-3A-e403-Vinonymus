import { z } from 'zod';
import { profile, id } from './platform-base.response';
import { accountRole } from '../requests/platform-common';

export const Profile = profile;
export const ProfileList = z.array(profile);
export const Session = z.union([z.object({requiresEmailConfirmation:z.literal(true),session:z.null()}),
  z.object({accessToken:z.string(),refreshToken:z.string(),expiresAt:z.number().nullable(),requiresEmailConfirmation:z.literal(false),user:profile})]);
export const LoggedOut = z.object({loggedOut:z.literal(true)});
export const Role = accountRole;