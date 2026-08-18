export interface ChatRoom {
  id: string;
  title: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  averagePrice: number;
  maxParticipants: number;
  currentParticipants?: number;
  pictureUrl?: string | null;
  category?: string | null;
  startDate?: string;
}

