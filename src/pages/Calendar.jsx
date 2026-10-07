import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { CallCourses } from "../hooks/context/course-context";

const Calendar = () => {

    const { courses } = CallCourses()

    // Función para extraer horas del horario
    const extraerHoras = (horario) => {
        const horaMatch = horario.match(/(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})/);

        if (!horaMatch) return { horaInicio: '08:00', horaFin: '09:00' };

        const hInicio = parseInt(horaMatch[1]);
        const mInicio = horaMatch[2];
        const hFin = parseInt(horaMatch[3]);
        const mFin = horaMatch[4];

        // Detectar si es AM o PM
        const esAM = horario.toLowerCase().includes('a.m') || horario.toLowerCase().includes('am');
        const esPM = horario.toLowerCase().includes('p.m') || horario.toLowerCase().includes('pm');

        // Convertir a formato 24 horas
        let hInicio24 = hInicio;
        let hFin24 = hFin;

        if (esPM && hInicio < 12) hInicio24 = hInicio + 12;
        if (esPM && hFin < 12) hFin24 = hFin + 12;
        if (esAM && hInicio === 12) hInicio24 = 0;
        if (esAM && hFin === 12) hFin24 = 0;

        return {
            horaInicio: `${hInicio24.toString().padStart(2, '0')}:${mInicio}`,
            horaFin: `${hFin24.toString().padStart(2, '0')}:${mFin}`
        };
    };

    // Función para determinar los días de la semana basándose en el horario
    const determinarDiasDeSemana = (horario) => {
        const horarioLower = horario.toLowerCase();

        if (horarioLower.includes('sábado') || horarioLower.includes('sabado')) {
            return [6]; // Sábado
        }

        if (horarioLower.includes('lunes') && horarioLower.includes('miércoles') && horarioLower.includes('viernes')) {
            return [1, 3, 5]; // Lunes, Miércoles, Viernes
        }

        if (horarioLower.includes('lunes') && horarioLower.includes('martes') && horarioLower.includes('miércoles')) {
            return [1, 2, 3]; // Lunes, Martes, Miércoles
        }

        if (horarioLower.includes('martes') && horarioLower.includes('jueves')) {
            return [2, 4]; // Martes, Jueves
        }

        // Por defecto, si no se reconoce el patrón, mostrar todos los días de la semana
        console.warn(`Patrón de horario no reconocido: ${horario}`);
        return [0, 1, 2, 3, 4, 5, 6]; // Todos los días
    };

    // Generar eventos para todos los cursos
    const generarEventos = () => {
        return courses.map((inscripcion, index) => {
            const curso = inscripcion.curso;
            const { horaInicio, horaFin } = extraerHoras(curso.horario);
            const diasDeSemana = determinarDiasDeSemana(curso.horario);

            // Generar color diferente para cada curso
            const colores = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
            const color = colores[index % colores.length];

            return {
                title: `${curso.nombre} - ${curso.programa} (${curso.modalidad})`,
                startTime: horaInicio,
                endTime: horaFin,
                daysOfWeek: diasDeSemana,
                startRecur: curso.fecha_inicio.split('T')[0],
                endRecur: curso.fecha_fin.split('T')[0],
                backgroundColor: color,
                borderColor: color,
                textColor: '#FFFFFF',
                extendedProps: {
                    modalidad: curso.modalidad,
                    descripcion: curso.descripcion
                }
            };
        });
    };

    const eventos = generarEventos();

    return (
        <div className="p-5">
            <h3 className="h3"><i className="bi bi-calendar"></i> Mi horario</h3>
            <hr />
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={eventos}
                locale="es"
                headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                eventTimeFormat={{
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                }}
                eventDisplay="block"
                eventDidMount={(info) => {
                    // Tooltip con información adicional
                    info.el.setAttribute('title',
                        `${info.event.title}\nModalidad: ${info.event.extendedProps.modalidad}\n${info.event.extendedProps.descripcion}`
                    );
                }}
            />
        </div>
    );
};

export default Calendar;