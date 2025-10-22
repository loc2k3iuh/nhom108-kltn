
export type EventPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface CalendarEventRequest {
  title: string;
  description?: string;
  startTime: string; // ISO
  endTime: string; // ISO
  allDay?: boolean;
  priority?: EventPriority;
}