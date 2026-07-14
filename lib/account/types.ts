export type CustomerProfile = {
  id: string;
  name: string | null;
  email: string;
  photoUrl: string | null;
};

export type CustomerSession = {
  id: string;
  profile: CustomerProfile;
  expiresAt: string;
};
