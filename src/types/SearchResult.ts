export type SearchResult = {
  id: string;
  name: string;
  url: string;
  images: Images[];
  type: {
    id: number;
    name: string;
  };
  defaultCountry: {
    id: number;
    name: string;
    images: Images[];
  };
  gender: {
    id: number;
    name: string;
  };
  sport: {
    id: number;
    name: string;
    statusId?: number;
  };

  favouriteKey: {
    portable: string | null;
    web: string | null;
  };

  // optional

  flagId: number | null;
  participantTypes: ParticipantType[] | null;
  teams:
    | {
        id: string;
        name: string;
        kind: string;
        participantType: ParticipantType;
      }[]
    | null;
  defaultTournament: {
    id: number;
    name: string;
    stageWithStatsDataIds: string[];
  } | null;
  superTemplate: any | null;
};

export type Images = {
  path: string;
  usageId: number;
  variantTypeId: number;
};

export type ParticipantType = {
  id: number;
  name: string;
};
