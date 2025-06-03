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
    const closeModalButton = document.querySelector("#event-modal .close-modal");
    // Elementos DOM - Modal somente leitura
    const viewEventModal = document.getElementById("view-event-modal");
    const viewEventIdInput = document.getElementById("view-event-id");
    const viewTitleInput = document.getElementById("view-event-title");
    const viewDescriptionInput = document.getElementById("view-event-description");
    const viewStartInput = document.getElementById("view-event-start");
    const viewEndInput = document.getElementById("view-event-end");
    const viewColorSelect = document.getElementById("view-event-color");
    const viewAllDayCheckbox = document.getElementById("view-event-all-day");
    const viewCloseButton = document.getElementById("view-close-button");
    const viewCloseModalButton = document.querySelector("#view-event-modal .close-modal");
    
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
    
    // Variáveis canAddEvent, canChangeEvent e canDeleteEvent são definidas no template
    
    // Configuração do FullCalendar
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "timeGridWeek",
        locale: "pt-br",
        slotMinTime: "00:00:00",
        slotMaxTime: "23:59:59",
        slotDuration: "00:15:00",
        nowIndicator: true,
        allDaySlot: true,
        editable: canChangeEvent, // Somente usuários com permissão podem arrastar/redimensionar eventos
        selectable: canAddEvent, // Somente usuários com permissão podem selecionar áreas para criar eventos
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
        
        eventContent: function(arg) {
            const event = arg.event;
            const description = event.extendedProps.description || '';
            
            // Criar o HTML customizado para o evento
            const eventEl = document.createElement('div');
            eventEl.className = 'fc-event-main';
            
            // Se não for evento de dia inteiro, mostrar o horário de início e fim
            let timeText = '';
            if (!event.allDay && event.start) {
                const startTime = event.start.toLocaleTimeString('pt-BR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                });
                
                let endTime = '';
                if (event.end) {
                    endTime = event.end.toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                    });
                    timeText = `${startTime} - ${endTime}`;
                } else {
                    timeText = startTime;
                }
            }
            
            eventEl.innerHTML = `
                <div style="padding: 2px 4px; font-size: 16px;">
                    ${timeText ? `<div style="font-size: 12px; opacity: 0.7;">${timeText}</div>` : ''}
                    <div style="font-weight: bold;">${event.title}</div>
                    ${description ? `<div style="opacity: 0.8; margin-top: 2px; font-size: 14px;">${description}</div>` : ''}
                </div>
            `;
            
            return { domNodes: [eventEl] };
        },

        // Carregar eventos do servidor
        events: '/calendario/api/events/',
        
        // Clicar em um evento existente
        eventClick: function (info) {
            const event = info.event;
            
            if (canChangeEvent) {
                // Para usuários com permissão de edição: Modal de edição
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
                // Mostrar botão de exclusão apenas se o usuário tiver permissão
                deleteButton.style.display = canDeleteEvent ? "block" : "none";
                
                // Exibir o modal
                eventModal.style.display = "block";
            } else {
                // Para usuários sem permissão de edição: Modal de visualização
                // Preencher o formulário somente leitura com os dados do evento
                viewEventIdInput.value = event.id;
                viewTitleInput.value = event.title;
                viewDescriptionInput.value = event.extendedProps.description || '';
                viewStartInput.value = formatDateTimeLocal(event.start);
                viewEndInput.value = formatDateTimeLocal(event.end || new Date(event.start.getTime() + 60*60*1000));
                viewColorSelect.value = event.backgroundColor;
                viewAllDayCheckbox.checked = event.allDay;
                
                // Exibir o modal de visualização
                viewEventModal.style.display = "block";
            }
        },
        
        // Selecionar um intervalo de tempo para criar novo evento
        select: function (info) {
            if (!canAddEvent) return; // Somente usuários com permissão podem criar eventos
            
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
            if (canChangeEvent) {
                updateEvent(info.event);
            } else {
                info.revert(); // Desfazer a alteração para usuários sem permissão
            }
        },
        
        // Redimensionar evento (atualizar horário de término)
        eventResize: function (info) {
            if (canChangeEvent) {
                updateEvent(info.event);
            } else {
                info.revert(); // Desfazer a alteração para usuários sem permissão
            }
        }
    });
    
    // Renderizar o calendário
    calendar.render();
    
    // Fechar os modais
    function closeEditModal() {
        eventModal.style.display = "none";
    }
    
    function closeViewModal() {
        viewEventModal.style.display = "none";
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
                
                closeEditModal();
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
                
                closeEditModal();
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
        
        if (!eventId || !canDeleteEvent) return;
        
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
                
                closeEditModal();
            })
            .catch(error => {
                console.error('Erro ao excluir evento:', error);
                alert('Erro ao excluir evento: ' + (error.error || 'Erro desconhecido'));
            });
        }
    });
    
    // Event listeners para o modal de edição
    cancelButton.addEventListener('click', closeEditModal);
    closeModalButton.addEventListener('click', closeEditModal);
    
    // Event listeners para o modal de visualização
    viewCloseButton.addEventListener('click', closeViewModal);
    viewCloseModalButton.addEventListener('click', closeViewModal);
    
    // Fechar modais ao clicar fora deles
    window.addEventListener('click', function (e) {
        if (e.target === eventModal) {
            closeEditModal();
        }
        if (e.target === viewEventModal) {
            closeViewModal();
        }
    });
});