import { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput, DateSelectArg, EventClickArg } from "@fullcalendar/core";
import { Modal } from "../components/ui/modal";
import { useModal } from "../hooks/useModal";
import PageMeta from "../components/common/PageMeta";
import axiosInstance from "../services/api";
import esLocale from "@fullcalendar/core/locales/es";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

export interface CalendarEvent extends EventInput {
  id: string;
  title: string;
  start: string;
  end?: string;
  allDay?: boolean;
  calendar: string;
  extendedProps: {
    calendar: string;
  };
}

const Calendar: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [eventTitle, setEventTitle] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [eventLevel, setEventLevel] = useState("");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();

  const calendarsEvents = {
    Aviso: "Aviso",
    Exito: "Exito",
    Primario: "Primario",
    Advertencia: "Advertencia",
  };

  const isValidFutureDate = (date: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const inputDate = new Date(date);
    inputDate.setHours(0, 0, 0, 0);
    return inputDate >= today;
  };

  const fetchEvents = async (): Promise<CalendarEvent[]> => {
    const res = await axiosInstance.get<CalendarEvent[]>("/calendar-events");
    return res.data;
  };


  const createEvent = async (data: Partial<CalendarEvent>): Promise<CalendarEvent> => {
    const res = await axiosInstance.post<CalendarEvent>("/calendar-events", data);
    return res.data;
  };

  const updateEvent = async (
    id: number,
    data: Partial<CalendarEvent>
  ): Promise<CalendarEvent> => {
    const res = await axiosInstance.patch<CalendarEvent>(`/calendar-events/${id}`, data);
    return res.data;
  };

  const deleteEvent = async (id: number) => {
    await axiosInstance.delete(`/calendar-events/${id}`);
  };

  useEffect(() => {
    const loadEvents = async () => {
      const data = await fetchEvents();
      const formatted = data.map((ev) => ({
        ...ev,
        id: ev.id?.toString(),
        extendedProps: { calendar: ev.calendar },
      }));
      setEvents(formatted);
    };
    loadEvents();
  }, []);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    const selectedDate = new Date(selectInfo.startStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    const isPast = selectedDate < today;
if (isPast) {
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'error',
    title: 'No puedes crear eventos en fechas pasadas.',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toastEl) => {
      toastEl.addEventListener('mouseenter', Swal.stopTimer)
      toastEl.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });
  return;
}

    resetModalFields();
    setEventStartDate(selectInfo.startStr);
    setEventEndDate(selectInfo.endStr || selectInfo.startStr);
    openModal();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    setSelectedEvent(event as unknown as CalendarEvent);
    setEventTitle(event.title);
    setEventStartDate(event.start?.toISOString().split("T")[0] || "");
    setEventEndDate(event.end?.toISOString().split("T")[0] || "");
    setEventLevel(event.extendedProps.calendar);
    openModal();
  };

  const handleAddOrUpdateEvent = async () => {
    if (!isValidFutureDate(eventStartDate)) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'error',
      title: 'No puedes agregar eventos en días pasados.',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toastEl) => {
        toastEl.addEventListener('mouseenter', Swal.stopTimer)
        toastEl.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });
  return;
}

    const newEvent = {
      title: eventTitle,
      start: eventStartDate,
      end: eventEndDate || undefined, 
      allDay: true,
      calendar: eventLevel || "Primario",
    };

    try {
      if (selectedEvent) {
        const updated = await updateEvent(parseInt(selectedEvent.id!), newEvent);
        setEvents((prev) =>
          prev.map((ev) =>
            ev.id === selectedEvent.id
              ? { ...updated, extendedProps: { calendar: updated.calendar } }
              : ev
          )
        );
      } else {
        const created = await createEvent(newEvent);
        setEvents((prev) => [
          ...prev,
          { ...created, extendedProps: { calendar: created.calendar } },
        ]);
      }
      closeModal();
      resetModalFields();
    } catch (error) {
      console.error("Error al guardar evento:", error);
    }
  };

  const resetModalFields = () => {
    setEventTitle("");
    setEventStartDate("");
    setEventEndDate("");
    setEventLevel("");
    setSelectedEvent(null);
  };

  return (
    <>
      <PageMeta title="Calendario de eventos importantes" description="Administra tus eventos futuros" />
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="custom-calendar">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale={esLocale}
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
            customButtons={{
              addEventButton: {
                text: "Añadir Evento +",
                click: openModal,
              },
            }}
          />
        </div>
        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] p-6 lg:p-10">
          <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
            <div>
              <h5 className="mb-2 font-semibold text-gray-800 text-xl dark:text-white">
                {selectedEvent ? "Editar Evento" : "Agregar Evento"}
              </h5>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium dark:text-white">Título</label>
                <input
                type="text"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder="Ingresa el título del evento aquí"
                className="w-full rounded border px-3 py-2 dark:text-white"/>
              </div>
              <div>
                <label className="block text-sm font-medium dark:text-white">Tipo</label>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(calendarsEvents).map(([key, value]) => (
                    <label key={key} className="flex items-center gap-2 dark:text-white">
                      <input
                        type="radio"
                        name="calendar-color"
                        value={key}
                        checked={eventLevel === key}
                        onChange={() => setEventLevel(key)}
                      />
                      {key}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium dark:text-white">Fecha de inicio</label>
                <input
                  type="date"
                  value={eventStartDate}
                  onChange={(e) => setEventStartDate(e.target.value)}
                  className="w-full rounded border px-3 py-2 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium dark:text-white">Fecha de fin</label>
                <input
                  type="date"
                  value={eventEndDate}
                  onChange={(e) => setEventEndDate(e.target.value)}
                  className="w-full rounded border px-3 py-2 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                {selectedEvent && (
                  <button
                    onClick={async () => {
                      if (confirm("¿Eliminar este evento?")) {
                        await deleteEvent(parseInt(selectedEvent.id!));
                        setEvents((prev) => prev.filter((ev) => ev.id !== selectedEvent.id));
                        closeModal();
                        resetModalFields();
                      }
                    }}
                    className="px-4 py-2 text-sm bg-red-100 text-red-800 rounded"
                  >
                    Eliminar
                  </button>
                )}
                <button onClick={closeModal} className="px-4 py-2 text-sm border rounded dark:text-white">
                  Cancelar
                </button>
                <button
                  onClick={handleAddOrUpdateEvent}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded"
                >
                  {selectedEvent ? "Actualizar" : "Agregar"}
                </button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

const renderEventContent = (eventInfo: any) => {
  const colorClass = `fc-bg-${eventInfo.event.extendedProps.calendar?.toLowerCase()}`;
  return (
    <div className={`event-fc-color flex fc-event-main ${colorClass} p-1 rounded-sm`}>
      <div className="fc-daygrid-event-dot"></div>
      <div className="fc-event-time">{eventInfo.timeText}</div>
      <div className="fc-event-title">{eventInfo.event.title}</div>
    </div>
  );
};

export default Calendar;