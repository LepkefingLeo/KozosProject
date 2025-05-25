document.addEventListener("DOMContentLoaded", () => {
  function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
  }

  window.onclick = function (e) {
    if (!e.target.matches('.dropbtn')) {
      const myDropdown = document.getElementById("myDropdown");
      if (myDropdown && myDropdown.classList.contains('show')) {
        myDropdown.classList.remove('show');
      }
    }
  }

  const dropdown = document.getElementById('nameDropdown');
  const priceInput = document.getElementById('priceInput');
  const satisfactionInput = document.getElementById('satisfactionInput');
  const bookingButton = document.getElementById("bookingButton");

  let eventData = [];

  async function loadEventData() {
    try {
      const response = await fetch('https://retoolapi.dev/UC5Gj6/data');
      const data = await response.json();
      eventData = data;

      dropdown.innerHTML = '<option value="">Select an event place</option>';

      data.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.name;
        dropdown.appendChild(option);
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      dropdown.innerHTML = '<option>Error loading data</option>';
    }
  }

  dropdown.addEventListener('change', () => {
    const selectedId = parseInt(dropdown.value);
    const selectedItem = eventData.find(item => item.id === selectedId);
    if (selectedItem) {
      priceInput.value = `${selectedItem.pay}$ / day` || '';
      satisfactionInput.value = selectedItem.rate || '';
    } else {
      priceInput.value = '';
      satisfactionInput.value = '';
    }
  });

  if (bookingButton) {
    bookingButton.addEventListener("click", () => {
      const selectedPlace = dropdown.options[dropdown.selectedIndex].text;
      const placeId = dropdown.value;
      const price = priceInput.value;
      const satisfaction = satisfactionInput.value;
      const booker = document.getElementById("placeholderNameInput").value;
      const dateFrom = document.getElementById("datefrom").value;
      const dateTo = document.getElementById("dateto").value;
      const purpose = document.getElementById("purpose").value;

      if (!selectedPlace || !booker || !dateFrom || !dateTo || !purpose || selectedPlace === "Select an event place") {
        alert("Please fill in all fields!");
        return;
      }

      const now = new Date();
      const fromDate = new Date(dateFrom);
      const toDate = new Date(dateTo);

      if (fromDate < now.setHours(0, 0, 0, 0)) {
        alert("You cannot book a date in the past.");
        return;
      }

      if (fromDate > toDate) {
        alert("End date must be after start date.");
        return;
      }

      const existingBookings = JSON.parse(localStorage.getItem("bookings") || "[]");

      const conflict = existingBookings.some(booking => {
        return booking.selectedPlace === selectedPlace &&
          !(new Date(booking.dateTo) < fromDate || new Date(booking.dateFrom) > toDate);
      });

      if (conflict) {
        alert("This event place is already booked during the selected dates.");
        return;
      }

      const booking = {
        selectedPlace,
        price,
        satisfaction,
        booker,
        dateFrom,
        dateTo,
        purpose
      };

      existingBookings.push(booking);
      localStorage.setItem("bookings", JSON.stringify(existingBookings));
      alert("Booking saved!");
    });
  }

  const pageDropdownBtn = document.querySelector('.dropbtn');
  if (pageDropdownBtn) {
    pageDropdownBtn.addEventListener('click', myFunction);
  }

  loadEventData();
});