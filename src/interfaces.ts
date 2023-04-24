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

export interface LocationEditorProps {
  location: Location | null;
  locationLoading: boolean;
  saveLocationChanges: (e: React.FormEvent<HTMLFormElement>) => void;
  locationDownloadPackage: (e: React.MouseEvent<HTMLButtonElement>) => void;
  alertMessage: [boolean, string] | null;
}