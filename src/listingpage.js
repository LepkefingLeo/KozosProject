function myFunction() {
      document.getElementById("myDropdown").classList.toggle("show");
    }

    window.onclick = function (e) {
      if (!e.target.matches('.dropbtn')) {
        const myDropdown = document.getElementById("myDropdown");
        if (myDropdown.classList.contains('show')) {
          myDropdown.classList.remove('show');
        }
      }
    };

    function renderBookings() {
      const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
      const container = document.getElementById("bookingsContainer");
      container.innerHTML = "";

      if (bookings.length === 0) {
        container.innerHTML = "<p>No bookings found.</p>";
        return;
      }

      bookings.forEach((booking, index) => {
        const div = document.createElement("div");
        div.className = "card p-3 mb-3";
        div.innerHTML = `
        <h5>${booking.selectedPlace}</h5>
        <p><strong>Booker:</strong> ${booking.booker}</p>
        <p><strong>Price:</strong> ${booking.price}</p>
        <p><strong>Satisfaction:</strong> ${booking.satisfaction}</p>
        <p><strong>Date:</strong> ${booking.dateFrom} – ${booking.dateTo}</p>
        <p><strong>Purpose:</strong> ${booking.purpose}</p>
        <button class="btn btn-danger btn-sm" onclick="deleteBooking(${index})">Delete</button>
      `;
        container.appendChild(div);
      });
    }

    function deleteBooking(index) {
      const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
      bookings.splice(index, 1);
      localStorage.setItem("bookings", JSON.stringify(bookings));
      renderBookings();
    }

    renderBookings();
