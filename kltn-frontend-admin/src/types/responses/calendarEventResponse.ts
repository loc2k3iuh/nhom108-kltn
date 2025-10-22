
export type EventPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface CalendarEventResponse {
  id: number;
  title: string;
  description?: string;
  startTime: string; // ISO
  endTime: string; // ISO
  allDay?: boolean;
  priority?: EventPriority;
  createdById?: number;
  createdByUsername?: string;
}
