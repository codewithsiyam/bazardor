/** Which social providers are really configured (both id and secret present). */
export interface SocialAvailability {
  google: boolean;
  github: boolean;
}

export function getSocialAvailability(): SocialAvailability {
  return {
    google: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    github: Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET),
  };
}
