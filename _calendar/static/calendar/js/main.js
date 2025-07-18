document.addEventListener("DOMContentLoaded", function () {
    const calendarEl = document.getElementById("calendar");
        
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "timeGridDay",
        locale: "pt-br",
        slotMinTime: "06:00:00",
        slotMaxTime: "22:00:00",
        slotDuration: "00:30:00",
        nowIndicator: true,
        allDaySlot: false,
        selectable: true,
        editable: canChange,
        eventResizableFromStart: true,
        height: 'auto',
        headerToolbar: {
            left: "prev,next today",
            center: "title",
            right: "timeGridDay,timeGridWeek,dayGridMonth,listYear",
        },
        buttonText: {
            today: "Hoje",
            year: "Ano",
            month: "Mês",
            week: "Semana",
            day: "Dia",
            list: "Ano",
        },
        events: '/agenda/api/get/',
        eventDrop: function(info) {
            updateEventDateTime(info.event);
        },
        eventResize: function(info) {
            updateEventDateTime(info.event);
        }
    });
    
    function updateEventDateTime(event) {
        const eventData = {
            titulo: event.title,
            descricao: event.extendedProps.description || '',
            tipo: event.extendedProps.type,
            data_inicio: event.start.toISOString(),
            data_fim: event.end.toISOString(),
            privada: event.extendedProps.private || false
        };
    
        fetch(`/agenda/api/update/${event.id}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCsrfToken(),
            },
            body: JSON.stringify(eventData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                console.log('Evento atualizado com sucesso');
            } else {
                console.error('Erro ao atualizar evento:', data.errors || data.message);
                // Reverter mudança em caso de erro
                calendar.refetchEvents();
            }
        })
        .catch(error => {
            console.error('Erro na requisição:', error);
            // Reverter mudança em caso de erro
            calendar.refetchEvents();
        });
    }
    
    function getCsrfToken() {
        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]');
        if (csrfToken) {
            return csrfToken.value;
        }
        
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'csrftoken') {
                return value;
            }
        }
        
        return '';
    }
    
    calendar.render();
});