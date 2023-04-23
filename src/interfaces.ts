export interface Organization {
  id: string;
  name: string;
  avatarURI: string;
  owner: string;
  type: string;
}

export interface Location {
  id: string;
  name: string;
  description: string;
  tags: any;
  organizationId: string;
  lastUpdatedDate: string;
  avatarURI: string;
  roblox: {
    placeId: string;
  };
}