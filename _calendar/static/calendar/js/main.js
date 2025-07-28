document.addEventListener("DOMContentLoaded", function () {
    const calendarEl = document.getElementById("calendar");
    const eventModal = document.getElementById('event-modal');
    const confirmDeleteModal = document.getElementById('confirm-delete-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const saveEventBtn = document.getElementById('save-event-btn');
    const deleteEventBtn = document.getElementById('delete-event-btn');
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    const form = document.getElementById('event-form');
    const formErrors = document.getElementById('form-errors');
    const filterLinks = document.querySelectorAll('.filter-link');

    let currentFilterUrl = '/agenda/api/get/';
    let currentEventId = null;

    // Carrega os tipos de reunião para o select
    function loadMeetingTypes() {
        fetch('/agenda/api/types-meetings/')
            .then(response => response.json())
            .then(data => {
                const select = document.getElementById('event-type');
                select.innerHTML = '<option value="">Nenhum</option>';
                data.forEach(type => {
                    select.innerHTML += `<option value="${type.id}">${type.tipo}</option>`;
                });
            })
            .catch(error => console.error("Erro ao carregar tipos de reunião:", error));
    }

    filterLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const typeId = this.dataset.typeId;

            filterLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            if (typeId) {
                currentFilterUrl = `/agenda/api/get/?tipo_id=${typeId}`;
            } else {
                currentFilterUrl = '/agenda/api/get/';
            }
            calendar.setOption('events', currentFilterUrl);
            calendar.refetchEvents();
        });
    });

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "timeGridWeek",
        locale: "pt-br",
        slotMinTime: "06:00:00",
        slotMaxTime: "22:00:00",
        slotDuration: "00:30:00",
        nowIndicator: true,
        allDaySlot: false,
        selectable: canAdd,
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
        events: currentFilterUrl,
        eventDrop: function(info) {
            updateEventDateTime(info.event);
        },
        eventResize: function(info) {
            updateEventDateTime(info.event);
        },
        eventClick: function(info) {
            openModal({
                id: info.event.id,
                title: info.event.title,
                description: info.event.extendedProps.description,
                type: info.event.extendedProps.type,
                start: info.event.startStr,
                end: info.event.endStr,
                private: info.event.extendedProps.private
            });
        },
        select: function(info) {
            if (!canAdd) return;
            openModal({
                start: info.startStr,
                end: info.endStr
            });
        }
    });

    function openModal(data = {}) {
        form.reset();
        formErrors.innerHTML = '';
        formErrors.style.display = 'none';
        currentEventId = data.id || null;

        document.getElementById('modal-title').textContent = data.id ? 'Visualizar Evento' : 'Criar Evento';
        document.getElementById('event-id').value = data.id || '';
        document.getElementById('event-title').value = data.title || '';
        document.getElementById('event-description').value = data.description || '';
        document.getElementById('event-type').value = data.type || '';
        
        // Formata a data para o input datetime-local
        const formatDateTime = (dateStr) => dateStr ? dateStr.substring(0, 16) : '';
        document.getElementById('event-start').value = formatDateTime(data.start);
        document.getElementById('event-end').value = formatDateTime(data.end);
        
        document.getElementById('event-private').checked = data.private || false;

        const isReadOnly = !!data.id && !canChange;
        Array.from(form.elements).forEach(el => {
            if (el.tagName === 'BUTTON') return;
            el.disabled = isReadOnly;
        });
        
        saveEventBtn.style.display = isReadOnly ? 'none' : 'block';
        deleteEventBtn.style.display = data.id && canDelete && !isReadOnly ? 'block' : 'none';

        eventModal.style.display = 'flex';
    }

    function closeModal() {
        eventModal.style.display = 'none';
    }

    function saveEvent() {
        const url = currentEventId ? `/agenda/api/update/${currentEventId}/` : '/agenda/api/add/';
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        data.privada = document.getElementById('event-private').checked;
        if (data.tipo === "") {
            data.tipo = null;
        }

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCsrfToken(),
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json().then(resData => ({ status: response.status, body: resData })))
        .then(({ status, body }) => {
            if (status < 400) {
                closeModal();
                calendar.refetchEvents();
            } else {
                const fieldNames = {
                    titulo: 'Título',
                    descricao: 'Descrição',
                    tipo: 'Tipo de Reunião',
                    data_inicio: 'Data e Hora de Início',
                    data_fim: 'Data e Hora de Fim',
                };
                let errorHtml = '<ul>';
                if (body.errors) {
                    for (const field in body.errors) {
                        const fieldName = fieldNames[field] || field;
                        body.errors[field].forEach(error => {
                            let cleanError = error.message || error;
                            errorHtml += `<li><strong>${fieldName}:</strong> ${cleanError}</li>`;
                        });
                    }
                } else if (body.message) {
                    errorHtml += `<li>${body.message}</li>`;
                } else {
                    errorHtml += '<li>Ocorreu um erro desconhecido.</li>';
                }
                errorHtml += '</ul>';
                formErrors.innerHTML = errorHtml;
                formErrors.style.display = 'block';
            }
        })
        .catch(error => {
            formErrors.innerHTML = 'Ocorreu um erro de comunicação. Tente novamente.';
            formErrors.style.display = 'block';
            console.error('Erro na requisição:', error);
        });
    }

    function showDeleteConfirmation() {
        confirmDeleteModal.style.display = 'flex';
    }

    function hideDeleteConfirmation() {
        confirmDeleteModal.style.display = 'none';
    }

    function deleteEvent() {
        if (!currentEventId) return;

        fetch(`/agenda/api/delete/${currentEventId}/`, {
            method: 'DELETE',
            headers: {
                'X-CSRFToken': getCsrfToken(),
            },
        })
        .then(response => response.json())
        .then(result => {
            if (result.status === 'success') {
                hideDeleteConfirmation();
                closeModal();
                calendar.refetchEvents();
            } else {
                alert('Erro ao excluir o evento: ' + result.message);
                hideDeleteConfirmation();
            }
        })
        .catch(error => {
            alert('Ocorreu um erro de comunicação. Tente novamente.');
            console.error('Erro na requisição:', error);
            hideDeleteConfirmation();
        });
    }

    // Event Listeners
    closeModalBtn.addEventListener('click', closeModal);
    saveEventBtn.addEventListener('click', saveEvent);
    deleteEventBtn.addEventListener('click', showDeleteConfirmation);
    cancelDeleteBtn.addEventListener('click', hideDeleteConfirmation);
    confirmDeleteBtn.addEventListener('click', deleteEvent);

    // Fechar modal ao clicar fora ou pressionar ESC
    window.addEventListener('click', (e) => {
        if (e.target === eventModal) closeModal();
        if (e.target === confirmDeleteModal) hideDeleteConfirmation();
    });
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            hideDeleteConfirmation();
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
        .then(response => response.json().then(resData => ({ status: response.status, body: resData })))
        .then(({ status, body }) => {
            if (status >= 400) {
                console.error('Erro ao atualizar evento:', body.errors || body.message);
                alert("Não foi possível atualizar o evento. Verifique se o novo horário não conflita com outra reunião.");
                event.revert();
            }
        })
        .catch(error => {
            console.error('Erro na requisição:', error);
            alert("Ocorreu um erro de comunicação ao tentar atualizar o evento.");
            event.revert();
        });
    }
    
    function getCsrfToken() {
        const csrfToken = document.cookie.match(/csrftoken=([^;]+)/);
        return csrfToken ? csrfToken[1] : '';
    }
    
    loadMeetingTypes();
    calendar.render();
});