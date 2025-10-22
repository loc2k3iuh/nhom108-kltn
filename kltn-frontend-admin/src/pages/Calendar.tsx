import { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput, DateSelectArg, EventClickArg } from "@fullcalendar/core";
import { Modal } from "../components/ui/modal";
import { useModal } from "../hooks/useModal";
import PageMeta from "../components/common/PageMeta";
import { CalendarEventResponse } from "@/types/responses/calendarEventResponse";
import {
  CalendarEventRequest,
  EventPriority,
} from "@/types/requests/calendarEventRequest";
import {
  createEvent,
  deleteEvent,
  getAllEvents,
  getMyEvents,
  updateEvent,
} from "@/services/calendarService";
import { useAuthStore } from "@/stores/useAuthStore";

interface CalendarEvent extends EventInput {
  extendedProps: {
    calendar: string;
    description?: string;
    createdByUsername?: string;
  };
}

// Helper function to format time to 12-hour format
const formatTo12Hour = (date: Date): string => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, "0");
  return `${displayHours}:${displayMinutes} ${ampm}`;
};

// Helper function to parse 12-hour format to 24-hour format
const parseTo24Hour = (time: string): { hours: number; minutes: number } => {
  const [timePart, ampm] = time.split(" ");
  const [hoursStr, minutesStr] = timePart.split(":");
  let hours = parseInt(hoursStr);
  const minutes = parseInt(minutesStr);

  if (ampm === "PM" && hours !== 12) {
    hours += 12;
  } else if (ampm === "AM" && hours === 12) {
    hours = 0;
  }

  return { hours, minutes };
};

const Calendar: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [eventTitle, setEventTitle] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [eventStartTime, setEventStartTime] = useState("");
  const [eventEndTime, setEventEndTime] = useState("");
  const [eventLevel, setEventLevel] = useState("");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [viewFilter, setViewFilter] = useState<"my" | "all">("all"); // Filter state
  const [isDeleting, setIsDeleting] = useState(false); // Prevent double delete
  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();
  const { authUser } = useAuthStore();

  // Helper function to parse time string
  const parseTime = (timeStr: string) => {
    if (!timeStr) return { hour: 12, minute: 0, ampm: "AM" };
    const [timePart, ampm] = timeStr.split(" ");
    const [hourStr, minuteStr] = timePart.split(":");
    return {
      hour: parseInt(hourStr) || 12,
      minute: parseInt(minuteStr) || 0,
      ampm: ampm || "AM",
    };
  };

  // Build a Date object in local time from a YYYY-MM-DD string
  const makeDateFromYMD = (dateStr: string, hours = 0, minutes = 0) => {
    const [y, m, d] = dateStr.split("-").map((s) => parseInt(s, 10));
    return new Date(y, (m || 1) - 1, d || 1, hours, minutes, 0, 0);
  };

  // Format a Date to YYYY-MM-DD (local) — safe for display in inputs
  const formatYMD = (date: Date) => {
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )}`;
  };

  // Subtract one day from a YYYY-MM-DD string and return YYYY-MM-DD
  const subtractOneDayYMD = (dateStr: string) => {
    const d = makeDateFromYMD(dateStr);
    d.setDate(d.getDate() - 1);
    return formatYMD(d);
  };

  // Format a Date to ISO_LOCAL_DATE_TIME (YYYY-MM-DDTHH:mm:ss) — compatible with Java LocalDateTime
  const formatForBackend = (date: Date) => {
    const pad = (n: number) => n.toString().padStart(2, "0");
    return (
      date.getFullYear() +
      "-" +
      pad(date.getMonth() + 1) +
      "-" +
      pad(date.getDate()) +
      " " +
      pad(date.getHours()) +
      ":" +
      pad(date.getMinutes()) +
      ":" +
      pad(date.getSeconds())
    );
  };

  // Helper function to format time
  const formatTime = (hour: number, minute: number, ampm: string) => {
    const formattedMinute = minute.toString().padStart(2, "0");
    return `${hour}:${formattedMinute} ${ampm}`;
  };

  // Handle start time changes
  const handleStartTimeChange = (
    hour: number,
    minute: number,
    ampm: string
  ) => {
    if (hour && minute !== undefined && ampm) {
      const newTime = formatTime(hour, minute, ampm);
      setEventStartTime(newTime);
    } else {
      setEventStartTime("");
    }
  };

  // Handle end time changes
  const handleEndTimeChange = (hour: number, minute: number, ampm: string) => {
    if (hour && minute !== undefined && ampm) {
      const newTime = formatTime(hour, minute, ampm);
      setEventEndTime(newTime);
    } else {
      setEventEndTime("");
    }
  };

  const calendarsEvents: Record<EventPriority, EventPriority> = {
    LOW: "LOW",
    MEDIUM: "MEDIUM",
    HIGH: "HIGH",
    CRITICAL: "CRITICAL",
  };

  // Map priority to colors (used for event background/border)
  const priorityColors: Record<
    string,
    { background: string; border: string; text?: string }
  > = {
    LOW: { background: "#34D399", border: "#10B981", text: "#ffffff" }, // green
    MEDIUM: { background: "#F59E0B", border: "#D97706", text: "#ffffff" }, // amber
    HIGH: { background: "#F97316", border: "#EA580C", text: "#ffffff" }, // orange
    CRITICAL: { background: "#EF4444", border: "#DC2626", text: "#ffffff" }, // red
  };

  // Helper function to map backend events to FullCalendar events
  const mapEventsFromBackend = (
    data: CalendarEventResponse[]
  ): CalendarEvent[] => {
    return (data || []).map((e) => {
      const priority = (e.priority || "LOW").toUpperCase();
      const colors = priorityColors[priority] || priorityColors.LOW;

      // For all-day events, ensure the end date is converted to exclusive format (next day 00:00:00)
      // because FullCalendar expects exclusive end dates for all-day events
      let mappedEnd = e.endTime;
      if (e.allDay && e.endTime) {
        const endDate = new Date(e.endTime);
        // Check if this is an inclusive end time (23:59:59 or 23:59:xx)
        const h = endDate.getHours();
        const m = endDate.getMinutes();

        // If the end time is at 23:59 or later, it's an inclusive end time that should be converted to exclusive
        if (h === 23 && m >= 59) {
          // Convert to next day 00:00:00 for FullCalendar's exclusive end format
          endDate.setDate(endDate.getDate() + 1);
          endDate.setHours(0, 0, 0, 0);
          mappedEnd = endDate.toISOString();
        }
      }

      return {
        id: e.id.toString(),
        title: e.title,
        start: e.startTime,
        end: mappedEnd,
        allDay: !!e.allDay,
        backgroundColor: colors.background,
        borderColor: colors.border,
        textColor: colors.text,
        extendedProps: {
          calendar: priority,
          description: e.description,
          createdByUsername: e.createdByUsername,
        },
      } as CalendarEvent;
    });
  };

  // Load events based on current filter
  const loadEvents = async () => {
    try {
      const data =
        viewFilter === "my" ? await getMyEvents() : await getAllEvents();
      const mapped = mapEventsFromBackend(data);
      setEvents(mapped);
    } catch (err) {
      console.error("Failed to load calendar events", err);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [viewFilter]);

  // Cleanup tooltips on unmount
  useEffect(() => {
    return () => {
      // Remove all tooltips when component unmounts
      document.querySelectorAll(".event-tooltip").forEach((el) => el.remove());
    };
  }, []);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    resetModalFields();
    // FullCalendar returns an exclusive end for all-day selections (end is day after the last selected)
    // Convert endStr to inclusive end for display by subtracting one day when endStr exists
    setEventStartDate(selectInfo.startStr);
    if (selectInfo.endStr) {
      setEventEndDate(subtractOneDayYMD(selectInfo.endStr));
    } else {
      setEventEndDate(selectInfo.startStr);
    }
    openModal();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    setSelectedEvent(event as unknown as CalendarEvent);
    setEventTitle(event.title);
    // Use local Y-M-D without timezone shift
    setEventStartDate(event.start ? formatYMD(new Date(event.start)) : "");
    // If the event has an end date, determine whether it's exclusive midnight or an actual end-of-day
    if (event.end) {
      const endDateObj = new Date(event.end);
      const endYmd = formatYMD(endDateObj);
      if (event.allDay) {
        // Only treat as exclusive (subtract one day) if end time is exactly 00:00:00 local
        const h = endDateObj.getHours();
        const m = endDateObj.getMinutes();
        const s = endDateObj.getSeconds();
        if (h === 0 && m === 0 && s === 0) {
          setEventEndDate(subtractOneDayYMD(endYmd));
        } else {
          setEventEndDate(endYmd);
        }
      } else {
        setEventEndDate(endYmd);
      }
    } else {
      setEventEndDate(event.start ? formatYMD(new Date(event.start)) : "");
    }

    // Handle time extraction
    if (event.start && !event.allDay) {
      const startTime = formatTo12Hour(event.start);
      setEventStartTime(startTime);
    } else {
      setEventStartTime("");
    }

    if (event.end && !event.allDay) {
      const endTime = formatTo12Hour(event.end);
      setEventEndTime(endTime);
    } else {
      setEventEndTime("");
    }

    setEventLevel(event.extendedProps.calendar);
    openModal();
  };

  // Check if current user is the owner of the event
  const isEventOwner = () => {
    if (!selectedEvent || !authUser) return false;
    return selectedEvent.extendedProps.createdByUsername === authUser.username;
  };

  const handleAddOrUpdateEvent = () => {
    // Create start and end datetime strings (ISO_LOCAL_DATE_TIME, no trailing Z)
    let startDateTime: string;
    let endDateTime: string;

    if (eventStartTime) {
      const { hours: startHours, minutes: startMinutes } =
        parseTo24Hour(eventStartTime);
      const startDate = makeDateFromYMD(
        eventStartDate,
        startHours,
        startMinutes
      );
      startDateTime = formatForBackend(startDate);
    } else {
      // all-day or date-only: start at 00:00:00 local
      const startDate = makeDateFromYMD(eventStartDate, 0, 0);
      startDateTime = formatForBackend(startDate);
    }

    if (eventEndTime) {
      const { hours: endHours, minutes: endMinutes } =
        parseTo24Hour(eventEndTime);
      const endDate = makeDateFromYMD(
        eventEndDate || eventStartDate,
        endHours,
        endMinutes
      );
      endDateTime = formatForBackend(endDate);
    } else if (eventStartTime) {
      // If start time is set but end time isn't, default end time to 11:59 PM of the same day (or end date)
      const endDate = makeDateFromYMD(eventEndDate || eventStartDate, 23, 59);
      endDate.setSeconds(59);
      endDateTime = formatForBackend(endDate);
    } else {
      // date-only all-day: end at 23:59:59 local
      const endDate = makeDateFromYMD(eventEndDate || eventStartDate, 23, 59);
      endDate.setSeconds(59);
      endDateTime = formatForBackend(endDate);
    }

    const payload: CalendarEventRequest = {
      title: eventTitle,
      description: "",
      startTime: startDateTime,
      endTime: endDateTime,
      allDay: !eventStartTime && !eventEndTime,
      priority: eventLevel
        ? (eventLevel.toUpperCase() as EventPriority)
        : undefined,
    };

    console.log("Saving event with payload:", payload);

    const save = async () => {
      try {
        if (selectedEvent && selectedEvent.id) {
          const updated = await updateEvent(Number(selectedEvent.id), payload);

          // Convert backend response to FullCalendar format
          const priority = (updated.priority || "LOW").toUpperCase();
          const colors = priorityColors[priority] || priorityColors.LOW;

          // Apply the same conversion for all-day events
          let mappedEnd = updated.endTime;
          if (updated.allDay && updated.endTime) {
            const endDate = new Date(updated.endTime);
            const h = endDate.getHours();
            const m = endDate.getMinutes();

            if (h === 23 && m >= 59) {
              endDate.setDate(endDate.getDate() + 1);
              endDate.setHours(0, 0, 0, 0);
              mappedEnd = endDate.toISOString();
            }
          }

          // Update event in local state
          setEvents((prevEvents) =>
            prevEvents.map((event) =>
              event.id === selectedEvent.id
                ? {
                    id: updated.id.toString(),
                    title: updated.title,
                    start: updated.startTime,
                    end: mappedEnd,
                    allDay: !!updated.allDay,
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    textColor: colors.text,
                    extendedProps: {
                      calendar: priority,
                      description: updated.description,
                      createdByUsername: updated.createdByUsername,
                    },
                  }
                : event
            )
          );
        } else {
          const created = await createEvent(payload);

          // Convert backend response to FullCalendar format
          const priority = (created.priority || "LOW").toUpperCase();
          const colors = priorityColors[priority] || priorityColors.LOW;

          // Apply the same conversion for all-day events
          let mappedEnd = created.endTime;
          if (created.allDay && created.endTime) {
            const endDate = new Date(created.endTime);
            const h = endDate.getHours();
            const m = endDate.getMinutes();

            if (h === 23 && m >= 59) {
              endDate.setDate(endDate.getDate() + 1);
              endDate.setHours(0, 0, 0, 0);
              mappedEnd = endDate.toISOString();
            }
          }

          // Add new event to local state
          const newEvent: CalendarEvent = {
            id: created.id.toString(),
            title: created.title,
            start: created.startTime,
            end: mappedEnd,
            allDay: !!created.allDay,
            backgroundColor: colors.background,
            borderColor: colors.border,
            textColor: colors.text,
            extendedProps: {
              calendar: priority,
              description: created.description,
              createdByUsername: created.createdByUsername,
            },
          };
          setEvents((prevEvents) => [...prevEvents, newEvent]);
        }
      } catch (err) {
        console.error("Failed to save event", err);
        // If save fails, reload to ensure consistency
        await loadEvents();
      }
    };
    save().then(() => {
      closeModal();
      resetModalFields();
    });
  };

  const resetModalFields = () => {
    setEventTitle("");
    setEventStartDate("");
    setEventEndDate("");
    setEventStartTime("");
    setEventEndTime("");
    setEventLevel("");
    setSelectedEvent(null);
    setIsDeleting(false);
  };

  // Handle event mouse enter to show tooltip
  const handleEventMouseEnter = (info: any) => {
    const event = info.event;
    const tooltip = document.createElement("div");
    tooltip.className = "event-tooltip";

    // Check if dark mode is active
    const isDarkMode = document.documentElement.classList.contains("dark");

    tooltip.style.cssText = `
      position: absolute;
      z-index: 10000;
      background: ${isDarkMode ? "#1f2937" : "white"};
      border: 1px solid ${isDarkMode ? "#374151" : "#e5e7eb"};
      border-radius: 8px;
      padding: 12px 16px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      max-width: 320px;
      min-width: 250px;
      font-size: 14px;
      pointer-events: none;
      animation: fadeIn 0.2s ease-in-out;
    `;

    // Format dates
    const formatDateTime = (date: Date | null, allDay: boolean) => {
      if (!date) return "";
      if (allDay) {
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      }
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    const priority = event.extendedProps.calendar || "LOW";
    const priorityColor = priorityColors[priority]?.background || "#34D399";
    const textColor = isDarkMode ? "#f9fafb" : "#1f2937";
    const secondaryTextColor = isDarkMode ? "#9ca3af" : "#6b7280";
    const borderColor = isDarkMode ? "#374151" : "#e5e7eb";

    tooltip.innerHTML = `
      <div style="color: ${textColor};">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
          <div style="width: 10px; height: 10px; border-radius: 50%; background: ${priorityColor}; flex-shrink: 0;"></div>
          <strong style="font-size: 16px; line-height: 1.3;">${
            event.title
          }</strong>
        </div>
        ${
          event.extendedProps.description
            ? `
          <div style="margin-bottom: 10px; color: ${secondaryTextColor}; line-height: 1.5;">
            ${event.extendedProps.description}
          </div>
        `
            : ""
        }
        <div style="display: flex; flex-direction: column; gap: 6px;">
          <div style="display: flex; align-items: flex-start; gap: 8px;">
            <span style="color: ${secondaryTextColor}; min-width: 45px;">Start:</span>
            <span style="color: ${textColor}; font-weight: 500;">${formatDateTime(
      event.start,
      event.allDay
    )}</span>
          </div>
          ${
            event.end
              ? `
            <div style="display: flex; align-items: flex-start; gap: 8px;">
              <span style="color: ${secondaryTextColor}; min-width: 45px;">End:</span>
              <span style="color: ${textColor}; font-weight: 500;">${formatDateTime(
                  event.end,
                  event.allDay
                )}</span>
            </div>
          `
              : ""
          }
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="color: ${secondaryTextColor}; min-width: 45px;">Priority:</span>
            <span style="display: inline-block; padding: 2px 8px; border-radius: 4px; background: ${priorityColor}20; color: ${priorityColor}; font-weight: 600; font-size: 12px;">${priority}</span>
          </div>
        </div>
        ${
          event.extendedProps.createdByUsername
            ? `
          <div style="color: ${secondaryTextColor}; font-size: 12px; margin-top: 10px; padding-top: 10px; border-top: 1px solid ${borderColor};">
            👤 ${event.extendedProps.createdByUsername}
          </div>
        `
            : ""
        }
      </div>
    `;

    document.body.appendChild(tooltip);

    // Position tooltip
    const rect = info.el.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    // Default position: below the event
    let left = rect.left + window.scrollX;
    let top = rect.bottom + window.scrollY + 8;

    // Adjust if tooltip goes off screen horizontally
    if (left + tooltipRect.width > window.innerWidth) {
      left = rect.right + window.scrollX - tooltipRect.width;
    }

    // Adjust if tooltip goes off screen vertically (show above instead)
    if (top + tooltipRect.height > window.innerHeight + window.scrollY) {
      top = rect.top + window.scrollY - tooltipRect.height - 8;
    }

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;

    // Store tooltip reference
    info.el.tooltip = tooltip;
  };

  // Handle event mouse leave to hide tooltip
  const handleEventMouseLeave = (info: any) => {
    if (info.el.tooltip) {
      info.el.tooltip.remove();
      info.el.tooltip = null;
    }
  };

  return (
    <>
      <PageMeta
        title="React.js Calendar Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Calendar Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="rounded-2xl border  border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        {/* Filter Section */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Calendar Events
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              View:
            </span>
            <div className="inline-flex rounded-lg border border-gray-300 dark:border-gray-700 p-1">
              <button
                onClick={() => setViewFilter("my")}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  viewFilter === "my"
                    ? "bg-brand-500 text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                My Events
              </button>
              <button
                onClick={() => setViewFilter("all")}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  viewFilter === "all"
                    ? "bg-brand-500 text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                All Events
              </button>
            </div>
          </div>
        </div>

        <div className="custom-calendar">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next addEventButton",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={events}
            selectable={true}
            select={handleDateSelect}
            eventClick={handleEventClick}
            eventContent={renderEventContent}
            eventMouseEnter={handleEventMouseEnter}
            eventMouseLeave={handleEventMouseLeave}
            customButtons={{
              addEventButton: {
                text: "Add Event +",
                click: openModal,
              },
            }}
          />
        </div>
        <Modal
          isOpen={isOpen}
          onClose={closeModal}
          className="max-w-[700px] p-6 lg:p-10"
        >
          <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
            <div>
              <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
                {selectedEvent ? (isEventOwner() ? "Edit Event" : "View Event") : "Add Event"}
              </h5>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {selectedEvent && !isEventOwner() 
                  ? "You can only view this event. Only the creator can edit or delete it."
                  : "Plan your next big moment: schedule or edit an event to stay on track"
                }
              </p>
              {selectedEvent && !isEventOwner() && (
                <div className="mt-3 px-3 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    🔒 Read-only mode: This event was created by {selectedEvent.extendedProps.createdByUsername || 'another user'}
                  </p>
                </div>
              )}
            </div>
            <div className="mt-8">
              <div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Event Title
                  </label>
                  <input
                    id="event-title"
                    type="text"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    disabled={!!selectedEvent && !isEventOwner()}
                    className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
              <div className="mt-6">
                <label className="block mb-4 text-sm font-medium text-gray-700 dark:text-gray-400">
                  Event Color
                </label>
                <div className="flex flex-wrap items-center gap-4 sm:gap-5">
                  {Object.entries(calendarsEvents).map(([key, value]) => (
                    <div key={key} className="n-chk">
                      <div
                        className={`form-check form-check-${value} form-check-inline`}
                      >
                        <label
                          className="flex items-center text-sm text-gray-700 form-check-label dark:text-gray-400"
                          htmlFor={`modal${key}`}
                        >
                          <span className="relative">
                            <input
                              className="sr-only form-check-input"
                              type="radio"
                              name="event-level"
                              value={key}
                              id={`modal${key}`}
                              checked={eventLevel === key}
                              onChange={() => setEventLevel(key)}
                              disabled={!!selectedEvent && !isEventOwner()}
                            />
                            <span className="flex items-center justify-center w-5 h-5 mr-2 border border-gray-300 rounded-full box dark:border-gray-700">
                              <span
                                className={`h-2 w-2 rounded-full bg-white ${
                                  eventLevel === key ? "block" : "hidden"
                                }`}
                              ></span>
                            </span>
                          </span>
                          {key}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Start Date and Time */}
              <div className="mt-6">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Start Date & Time
                </label>
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <input
                      id="event-start-date"
                      type="date"
                      value={eventStartDate}
                      onChange={(e) => setEventStartDate(e.target.value)}
                      disabled={!!selectedEvent && !isEventOwner()}
                      className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div className="flex gap-2 items-center">
                    {/* Hour Select */}
                    <select
                      id="start-time-hour"
                      value={
                        eventStartTime ? parseTime(eventStartTime).hour : ""
                      }
                      onChange={(e) => {
                        const hour = parseInt(e.target.value);
                        if (hour) {
                          handleStartTimeChange(
                            hour,
                            eventStartTime
                              ? parseTime(eventStartTime).minute
                              : 0,
                            eventStartTime
                              ? parseTime(eventStartTime).ampm
                              : "AM"
                          );
                        } else {
                          setEventStartTime("");
                        }
                      }}
                      disabled={!!selectedEvent && !isEventOwner()}
                      className="h-11 w-16 rounded-lg border border-gray-300 bg-transparent px-2 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">--</option>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>

                    <span className="text-gray-500">:</span>

                    {/* Minute Select */}
                    <select
                      id="start-time-minute"
                      value={
                        eventStartTime ? parseTime(eventStartTime).minute : 0
                      }
                      onChange={(e) =>
                        handleStartTimeChange(
                          eventStartTime ? parseTime(eventStartTime).hour : 12,
                          parseInt(e.target.value),
                          eventStartTime ? parseTime(eventStartTime).ampm : "AM"
                        )
                      }
                      disabled={!!selectedEvent && !isEventOwner()}
                      className="h-11 w-16 rounded-lg border border-gray-300 bg-transparent px-2 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {Array.from({ length: 60 }, (_, i) => i).map((m) => (
                        <option key={m} value={m}>
                          {m.toString().padStart(2, "0")}
                        </option>
                      ))}
                    </select>

                    {/* AM/PM Select */}
                    <select
                      id="start-time-ampm"
                      value={
                        eventStartTime ? parseTime(eventStartTime).ampm : "AM"
                      }
                      onChange={(e) =>
                        handleStartTimeChange(
                          eventStartTime ? parseTime(eventStartTime).hour : 12,
                          eventStartTime ? parseTime(eventStartTime).minute : 0,
                          e.target.value
                        )
                      }
                      disabled={!!selectedEvent && !isEventOwner()}
                      className="h-11 w-16 rounded-lg border border-gray-300 bg-transparent px-2 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* End Date and Time */}
              <div className="mt-6">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  End Date & Time
                </label>
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <input
                      id="event-end-date"
                      type="date"
                      value={eventEndDate}
                      onChange={(e) => setEventEndDate(e.target.value)}
                      disabled={!!selectedEvent && !isEventOwner()}
                      className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div className="flex gap-2 items-center">
                    {/* Hour Select */}
                    <select
                      id="end-time-hour"
                      value={eventEndTime ? parseTime(eventEndTime).hour : ""}
                      onChange={(e) => {
                        const hour = parseInt(e.target.value);
                        if (hour) {
                          handleEndTimeChange(
                            hour,
                            eventEndTime ? parseTime(eventEndTime).minute : 0,
                            eventEndTime ? parseTime(eventEndTime).ampm : "AM"
                          );
                        } else {
                          setEventEndTime("");
                        }
                      }}
                      disabled={!!selectedEvent && !isEventOwner()}
                      className="h-11 w-16 rounded-lg border border-gray-300 bg-transparent px-2 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">--</option>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>

                    <span className="text-gray-500">:</span>

                    {/* Minute Select */}
                    <select
                      id="end-time-minute"
                      value={eventEndTime ? parseTime(eventEndTime).minute : 0}
                      onChange={(e) =>
                        handleEndTimeChange(
                          eventEndTime ? parseTime(eventEndTime).hour : 12,
                          parseInt(e.target.value),
                          eventEndTime ? parseTime(eventEndTime).ampm : "AM"
                        )
                      }
                      disabled={!!selectedEvent && !isEventOwner()}
                      className="h-11 w-16 rounded-lg border border-gray-300 bg-transparent px-2 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {Array.from({ length: 60 }, (_, i) => i).map((m) => (
                        <option key={m} value={m}>
                          {m.toString().padStart(2, "0")}
                        </option>
                      ))}
                    </select>

                    {/* AM/PM Select */}
                    <select
                      id="end-time-ampm"
                      value={eventEndTime ? parseTime(eventEndTime).ampm : "AM"}
                      onChange={(e) =>
                        handleEndTimeChange(
                          eventEndTime ? parseTime(eventEndTime).hour : 12,
                          eventEndTime ? parseTime(eventEndTime).minute : 0,
                          e.target.value
                        )
                      }
                      disabled={!!selectedEvent && !isEventOwner()}
                      className="h-11 w-16 rounded-lg border border-gray-300 bg-transparent px-2 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
              <button
                onClick={closeModal}
                type="button"
                className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
              >
                Close
              </button>
              {selectedEvent && isEventOwner() ? (
                <button
                  onClick={async () => {
                    if (isDeleting) return; // Prevent double click

                    try {
                      setIsDeleting(true);
                      await deleteEvent(Number(selectedEvent.id));
                      // Remove event from local state immediately for better UX
                      setEvents((prevEvents) =>
                        prevEvents.filter((e) => e.id !== selectedEvent.id)
                      );
                      closeModal();
                      resetModalFields();
                    } catch (err) {
                      console.error("Failed to delete event", err);
                      // If delete fails, reload to ensure consistency
                      await loadEvents();
                    } finally {
                      setIsDeleting(false);
                    }
                  }}
                  type="button"
                  disabled={isDeleting}
                  className={`btn btn-danger flex w-full justify-center rounded-lg border border-red-600 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 sm:w-auto ${
                    isDeleting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              ) : null}
              {(!selectedEvent || isEventOwner()) && (
                <button
                  onClick={handleAddOrUpdateEvent}
                  type="button"
                  className="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
                >
                  {selectedEvent ? "Update Changes" : "Add Event"}
                </button>
              )}
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

const renderEventContent = (eventInfo: any) => {
  const ev = eventInfo.event;
  // prefer explicit color fields set on the event, otherwise fallback to priority class
  const bg = ev.backgroundColor || undefined;
  const border = ev.borderColor || undefined;
  const color = ev.textColor || undefined;

  // Render only dot and title to keep the event bar compact
  return (
    <div
      className={`event-fc-color flex fc-event-main items-center p-1 rounded-sm relative cursor-pointer`}
      style={{ backgroundColor: bg, borderColor: border, color: color }}
    >
      {/* dot positioned left */}
      <div className="fc-daygrid-event-dot absolute left-2" />
      {/* title centered */}
      <div className="fc-event-title w-full text-center truncate">
        {ev.title}
      </div>
    </div>
  );
};

export default Calendar;
