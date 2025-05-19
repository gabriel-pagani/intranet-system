document.addEventListener("DOMContentLoaded", function () {
    // Elementos DOM
    const calendarEl = document.getElementById("calendar");
    const eventModal = document.getElementById("event-modal");
    const modalTitle = document.getElementById("modal-title");
    const eventForm = document.getElementById("event-form");
    const eventIdInput = document.getElementById("event-id");
    const titleInput = document.getElementById("event-title");
    const descriptionInput = document.getElementById("event-description");
    const startInput = document.getElementById("event-start");
    const endInput = document.getElementById("event-end");
    const colorSelect = document.getElementById("event-color");
    const allDayCheckbox = document.getElementById("event-all-day");
    const deleteButton = document.getElementById("delete-button");
    const cancelButton = document.getElementById("cancel-button");
    const closeModalButton = document.querySelector(".close-modal");

    // Função para obter o token CSRF
    function getCsrfToken() {
        const cookieValue = document.cookie
            .split('; ')
            .find(row => row.startsWith('csrftoken='))
            ?.split('=')[1];
        return cookieValue || '';
    }

    // Função para formatar data para datetime-local
    function formatDateTimeLocal(date) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    // Configuração do FullCalendar
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "timeGridWeek",
        locale: "pt-br",
        slotMinTime: "00:00:00",
        slotMaxTime: "23:59:59",
        slotDuration: "00:30:00",
        nowIndicator: true,
        allDaySlot: true,
        editable: true,
        selectable: true,
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
        
        // Carregar eventos do servidor
        events: '/calendario/api/events/',
        
        // Clicar em um evento existente
        eventClick: function (info) {
            const event = info.event;
            
            // Preencher o formulário com os dados do evento
            eventIdInput.value = event.id;
            titleInput.value = event.title;
            descriptionInput.value = event.extendedProps.description || '';
            startInput.value = formatDateTimeLocal(event.start);
            endInput.value = formatDateTimeLocal(event.end || new Date(event.start.getTime() + 60*60*1000));
            colorSelect.value = event.backgroundColor;
            allDayCheckbox.checked = event.allDay;
            
            // Configurar o modal para edição
            modalTitle.textContent = "Editar Evento";
            deleteButton.style.display = "block";
            
            // Exibir o modal
            eventModal.style.display = "block";
        },
        
        // Selecionar um intervalo de tempo para criar novo evento
        select: function (info) {
            // Limpar o formulário
            eventForm.reset();
            eventIdInput.value = '';
            
            // Preencher datas do intervalo selecionado
            startInput.value = formatDateTimeLocal(info.start);
            endInput.value = formatDateTimeLocal(info.end);
            allDayCheckbox.checked = info.allDay;
            
            // Configurar o modal para criação
            modalTitle.textContent = "Adicionar Evento";
            deleteButton.style.display = "none";
            
            // Exibir o modal
            eventModal.style.display = "block";
        },
        
        // Arrastar e soltar evento (atualizar datas)
        eventDrop: function (info) {
            updateEvent(info.event);
        },
        
        // Redimensionar evento (atualizar horário de término)
        eventResize: function (info) {
            updateEvent(info.event);
        }
    });

    // Renderizar o calendário
    calendar.render();

    // Fechar o modal
    function closeModal() {
        eventModal.style.display = "none";
    }

    // Atualizar evento existente
    function updateEvent(event) {
        const csrfToken = getCsrfToken();
        
        fetch(`/calendario/api/events/${event.id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify({
                title: event.title,
                description: event.extendedProps.description,
                start: event.start.toISOString(),
                end: (event.end || new Date(event.start.getTime() + 60*60*1000)).toISOString(),
                allDay: event.allDay,
                color: event.backgroundColor
            })
        })
        .then(response => {
            if (!response.ok) {
                // Se houver erro, reverter a mudança
                event.revert();
                return response.json().then(err => Promise.reject(err));
            }
            return response.json();
        })
        .catch(error => {
            console.error('Erro ao atualizar evento:', error);
            alert('Erro ao atualizar evento: ' + (error.error || 'Erro desconhecido'));
        });
    }

    // Submeter o formulário (criar ou atualizar evento)
    eventForm.addEventListener('submit', function (e) {
        e.preventDefault();
        
        const eventId = eventIdInput.value;
        const csrfToken = getCsrfToken();
        
        const eventData = {
            title: titleInput.value,
            description: descriptionInput.value,
            start: new Date(startInput.value).toISOString(),
            end: new Date(endInput.value).toISOString(),
            allDay: allDayCheckbox.checked,
            color: colorSelect.value
        };
        
        if (eventId) {
            // Atualizar evento existente
            fetch(`/calendario/api/events/${eventId}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                },
                body: JSON.stringify(eventData)
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => Promise.reject(err));
                }
                return response.json();
            })
            .then(data => {
                // Atualizar o evento no calendário
                const event = calendar.getEventById(eventId);
                event.setProp('title', data.title);
                event.setProp('backgroundColor', data.backgroundColor);
                event.setProp('borderColor', data.borderColor);
                event.setStart(data.start);
                event.setEnd(data.end);
                event.setAllDay(data.allDay);
                event.setExtendedProp('description', data.extendedProps.description);
                
                closeModal();
            })
            .catch(error => {
                console.error('Erro ao atualizar evento:', error);
                alert('Erro ao atualizar evento: ' + (error.error || 'Erro desconhecido'));
            });
        } else {
            // Criar novo evento
            fetch('/calendario/api/events/create/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                },
                body: JSON.stringify(eventData)
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => Promise.reject(err));
                }
                return response.json();
            })
            .then(data => {
                // Adicionar o evento ao calendário
                calendar.addEvent({
                    id: data.id,
                    title: data.title,
                    start: data.start,
                    end: data.end,
                    allDay: data.allDay,
                    backgroundColor: data.backgroundColor,
                    borderColor: data.borderColor,
                    extendedProps: {
                        description: data.extendedProps.description
                    }
                });
                
                closeModal();
            })
            .catch(error => {
                console.error('Erro ao criar evento:', error);
                alert('Erro ao criar evento: ' + (error.error || 'Erro desconhecido'));
            });
        }
    });

    // Excluir evento
    deleteButton.addEventListener('click', function () {
        const eventId = eventIdInput.value;
        const csrfToken = getCsrfToken();
        
        if (!eventId) return;
        
        if (confirm('Tem certeza que deseja excluir este evento?')) {
            fetch(`/calendario/api/events/${eventId}/`, {
                method: 'DELETE',
                headers: {
                    'X-CSRFToken': csrfToken
                }
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => Promise.reject(err));
                }
                return response.json();
            })
            .then(() => {
                // Remover o evento do calendário
                const event = calendar.getEventById(eventId);
                event.remove();
                
                closeModal();
            })
            .catch(error => {
                console.error('Erro ao excluir evento:', error);
                alert('Erro ao excluir evento: ' + (error.error || 'Erro desconhecido'));
            });
        }
    });

    // Botões para fechar o modal
    cancelButton.addEventListener('click', closeModal);
    closeModalButton.addEventListener('click', closeModal);
    
    // Fechar modal ao clicar fora dele
    window.addEventListener('click', function (e) {
        if (e.target === eventModal) {
            closeModal();
        }
    });
});