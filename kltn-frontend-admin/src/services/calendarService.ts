import axiosInstance from "@/lib/axios";
import { CalendarEventRequest } from "@/types/requests/calendarEventRequest";
import { CalendarEventResponse } from "@/types/responses/calendarEventResponse";

const PREFIX = "/calendar-events";

export const getMyEvents = async (
  start?: string,
  end?: string
): Promise<CalendarEventResponse[]> => {
  const params: any = {};
  if (start) params.start = start;
  if (end) params.end = end;
  const response = await axiosInstance.get(`${PREFIX}/my`, { params });
  return response.data.result as CalendarEventResponse[];
};

export const getAllEvents = async (
  start?: string,
  end?: string
): Promise<CalendarEventResponse[]> => {
  const params: any = {};
  if (start) params.start = start;
  if (end) params.end = end;
  const response = await axiosInstance.get(`${PREFIX}/all`, { params });
  return response.data.result as CalendarEventResponse[];
};

export const createEvent = async (
  data: CalendarEventRequest
): Promise<CalendarEventResponse> => {
  const response = await axiosInstance.post(`${PREFIX}`, data);
  return response.data.result as CalendarEventResponse;
};

export const updateEvent = async (
  id: number,
  data: CalendarEventRequest
): Promise<CalendarEventResponse> => {
  const response = await axiosInstance.put(`${PREFIX}/${id}`, data);
  return response.data.result as CalendarEventResponse;
};

export const deleteEvent = async (id: number): Promise<void> => {
  axiosInstance.delete(`${PREFIX}/${id}`);
};
