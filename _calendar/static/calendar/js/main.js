document.addEventListener("DOMContentLoaded", function () {
    const calendarEl = document.getElementById("calendar");
        
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "timeGridWeek",
        locale: "pt-br",
        slotMinTime: "06:00:00",
        slotMaxTime: "21:30:00",
        slotDuration: "00:30:00",
        nowIndicator: true,
        allDaySlot: false,
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
    });
    
    calendar.render();
});