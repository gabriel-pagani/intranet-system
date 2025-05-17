document.addEventListener("DOMContentLoaded", function () {
  // Toggle sidebar collapse
  document.getElementById("toggle").addEventListener("click", function () {
    document.getElementById("sidebar").classList.toggle("collapsed");
  });

  // Toggle sector submenus
  const sectorHeaders = document.querySelectorAll(".sector-header");
  sectorHeaders.forEach((header) => {
    header.addEventListener("click", function () {
      // Toggle active class on header
      this.classList.toggle("active");

      // Toggle submenu visibility
      const submenu = this.nextElementSibling;
      submenu.classList.toggle("active");
    });
  });

  // Handle dashboard link clicks to update iframe
  const dashboardLinks = document.querySelectorAll(".dashboard-link");
  dashboardLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      // Remove active class from all dashboard links
      dashboardLinks.forEach((l) => l.classList.remove("active"));

      // Add active class to clicked link
      this.classList.add("active");

      // Update iframe source with dashboard URL
      const dashboardUrl = this.getAttribute("data-url");
      document.getElementById("dashboard-frame").src = dashboardUrl;
    });
  });
});
