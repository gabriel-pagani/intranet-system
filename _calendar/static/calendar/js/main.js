document.addEventListener("DOMContentLoaded", function () {
    const calendarEl = document.getElementById("calendar");
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "timeGridWeek",
        locale: "pt-br",
        slotMinTime: "00:00:00",
        slotMaxTime: "23:59:59",
        slotDuration: "00:30:00",
        nowIndicator: true,
        allDaySlot: false,
        editable: true,
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
        eventClick: function (info) {},
        dateClick: function (info) {},
        eventDrop: function (info) {},
        eventResize: function (info) {},
    });

    calendar.render();
});