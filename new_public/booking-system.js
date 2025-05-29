// Booking system for Sunny Beach Rental
// This file handles the booking calendar and form submission

// Check for pending booking on page load (after form submission redirect)
document.addEventListener('DOMContentLoaded', function() {
    // Check if we have a pending booking in localStorage
    const pendingBookingJson = localStorage.getItem('pendingBooking');
    if (pendingBookingJson) {
        try {
            // Parse the pending booking
            const pendingBooking = JSON.parse(pendingBookingJson);
            
            // Add the booking to our bookings array
            bookings.push({
                startDate: new Date(pendingBooking.startDate),
                endDate: new Date(pendingBooking.endDate),
                userName: pendingBooking.userName,
                userEmail: pendingBooking.userEmail,
                userPhone: pendingBooking.userPhone,
                status: 'confirmed'
            });
            
            // Clear the pending booking
            localStorage.removeItem('pendingBooking');
            
            // Update the UI
            setTimeout(() => {
                renderCalendar();
                renderBookedDatesList();
                
                // Show success message
                showModal("Booking request sent successfully! The owner will contact you to confirm.", true);
                
                // Reset form fields
                if (userNameInput) userNameInput.value = '';
                if (userEmailInput) userEmailInput.value = '';
                if (userPhoneInput) userPhoneInput.value = '';
                selectedStartDate = null;
                selectedEndDate = null;
                updateSelectedDateDisplays();
                showApartmentView();
            }, 500);
        } catch (error) {
            console.error('Error processing pending booking:', error);
        }
    }
});

// Global variables
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let selectedStartDate = null;
let selectedEndDate = null;

// Initialize bookings array
let bookings = [];

// DOM elements
const bookingView = document.getElementById('bookingView');
const apartmentView = document.getElementById('apartmentView');
const calendarGrid = document.getElementById('calendarGrid');
const currentMonthYearDisplay = document.getElementById('currentMonthYear');
const prevMonthBtn = document.getElementById('prevMonthBtn');
const nextMonthBtn = document.getElementById('nextMonthBtn');
const selectedStartDateDisplay = document.getElementById('selectedStartDateDisplay');
const selectedEndDateDisplay = document.getElementById('selectedEndDateDisplay');
const userNameInput = document.getElementById('userName');
const userEmailInput = document.getElementById('userEmail');
const userPhoneInput = document.getElementById('userPhone');
const submitBookingBtn = document.getElementById('submitBookingBtn');
const clearSelectionBtn = document.getElementById('clearSelectionBtn');
const bookedDatesList = document.getElementById('bookedDatesList');
const backToDetailsBtn = document.getElementById('backToDetailsBtn');
const goToBookingBtnHero = document.getElementById('goToBookingBtnHero');
const aboutSectionBookBtn = document.getElementById('aboutSectionBookBtn');

// Helper functions
function formatDate(date) {
    if (!date) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function isSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
}

function isDateBooked(date) {
    // Create a clean date with time set to midnight for comparison
    const cleanDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    for (const booking of bookings) {
        // Create clean dates for booking start and end
        const bookingStartRaw = booking.startDate instanceof Date ? booking.startDate : new Date(booking.startDate);
        const bookingEndRaw = booking.endDate instanceof Date ? booking.endDate : new Date(booking.endDate);
        
        const bookingStart = new Date(bookingStartRaw.getFullYear(), bookingStartRaw.getMonth(), bookingStartRaw.getDate());
        const bookingEnd = new Date(bookingEndRaw.getFullYear(), bookingEndRaw.getMonth(), bookingEndRaw.getDate());
        
        // Check if the date falls within a booking range
        if (cleanDate >= bookingStart && cleanDate <= bookingEnd) {
            return true;
        }
    }
    return false;
}

function isRangeConflicting(start, end) {
    // Create clean dates with time set to midnight for comparison
    const cleanStart = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const cleanEnd = new Date(end.getFullYear(), end.getMonth(), end.getDate());
    
    for (const booking of bookings) {
        // Create clean dates for booking start and end
        const bookingStartRaw = booking.startDate instanceof Date ? booking.startDate : new Date(booking.startDate);
        const bookingEndRaw = booking.endDate instanceof Date ? booking.endDate : new Date(booking.endDate);
        
        const bookingStart = new Date(bookingStartRaw.getFullYear(), bookingStartRaw.getMonth(), bookingStartRaw.getDate());
        const bookingEnd = new Date(bookingEndRaw.getFullYear(), bookingEndRaw.getMonth(), bookingEndRaw.getDate());
        
        // Check if there's any overlap between the ranges
        if (cleanStart <= bookingEnd && cleanEnd >= bookingStart) {
            return true;
        }
    }
    return false;
}

// UI functions - use the existing modal in index.html
function showModal(message, isSuccess = false, callback = null) {
    const messageModal = document.getElementById('messageModal');
    const modalMessageText = document.getElementById('modalMessageText');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const ownerContactInfoModal = document.getElementById('ownerContactInfo');
    
    // Replace newlines with <br> tags for better formatting
    modalMessageText.innerHTML = message.replace(/\n/g, '<br>');
    
    // Show owner contact info if success is true
    if (isSuccess) {
        ownerContactInfoModal.style.display = 'block';
    } else {
        ownerContactInfoModal.style.display = 'none';
    }
    
    // Show the modal
    messageModal.style.display = 'block';
    
    // Remove any previous event listeners
    const newModalCloseBtn = modalCloseBtn.cloneNode(true);
    modalCloseBtn.parentNode.replaceChild(newModalCloseBtn, modalCloseBtn);
    
    // Add new event listener with callback support
    newModalCloseBtn.addEventListener('click', function() {
        messageModal.style.display = 'none';
        if (callback && typeof callback === 'function') {
            callback();
        }
    });
    
    // Close modal when clicking outside
    window.onclick = (event) => { 
        if (event.target == messageModal) {
            messageModal.style.display = 'none';
            if (callback && typeof callback === 'function') {
                callback();
            }
        }
    };
}

function showApartmentView() {
    apartmentView.classList.add('active');
    bookingView.classList.remove('active');
}

function showBookingView() {
    bookingView.classList.add('active');
    apartmentView.classList.remove('active');
    renderCalendar();
}

function updateSelectedDateDisplays() {
    selectedStartDateDisplay.textContent = selectedStartDate ? formatDate(selectedStartDate) : 'Not selected';
    selectedEndDateDisplay.textContent = selectedEndDate ? formatDate(selectedEndDate) : 'Not selected';
    updateBookingButtonState();
}

function updateBookingButtonState() {
    const name = userNameInput.value.trim();
    const email = userEmailInput.value.trim();
    const phone = userPhoneInput.value.trim();
    submitBookingBtn.disabled = !selectedStartDate || !selectedEndDate || !name || !email || !phone;
}

// Calendar functions
function renderCalendar() {
    // Update month/year display
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    currentMonthYearDisplay.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    
    // Clear previous days
    const dayHeaders = calendarGrid.querySelectorAll('.font-semibold');
    while (calendarGrid.children.length > dayHeaders.length) {
        calendarGrid.removeChild(calendarGrid.lastChild);
    }
    
    // Get first day of month and total days
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Add empty cells for days before the 1st
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'calendar-day opacity-0';
        calendarGrid.appendChild(emptyCell);
    }
    
    // Add days of the month
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentYear, currentMonth, day);
        const dayCell = document.createElement('div');
        dayCell.textContent = day;
        dayCell.className = 'calendar-day p-2 text-center cursor-pointer transition-colors';
        
        // Check if date is in the past
        if (date < today) {
            dayCell.classList.add('opacity-50', 'bg-gray-100', 'text-gray-400', 'cursor-not-allowed');
            dayCell.classList.add('disabled');
        } 
        // Check if date is booked
        else if (isDateBooked(date)) {
            dayCell.classList.add('booked', 'bg-red-200', 'text-red-800');
        } 
        // Check if date is selected
        else if ((selectedStartDate && isSameDay(date, selectedStartDate)) || 
                 (selectedEndDate && isSameDay(date, selectedEndDate))) {
            dayCell.classList.add('selected', 'bg-blue-600', 'text-white');
        }
        // Date is available
        else {
            dayCell.classList.add('hover:bg-gray-200');
            dayCell.addEventListener('click', () => {
                if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
                    // Start new selection
                    selectedStartDate = date;
                    selectedEndDate = null;
                } else {
                    // Complete selection
                    if (date < selectedStartDate) {
                        selectedEndDate = selectedStartDate;
                        selectedStartDate = date;
                    } else {
                        selectedEndDate = date;
                    }
                }
                updateSelectedDateDisplays();
                renderCalendar();
            });
        }
        
        calendarGrid.appendChild(dayCell);
    }
}

function renderBookedDatesList() {
    if (!bookedDatesList) return;
    
    if (bookings.length === 0) {
        bookedDatesList.innerHTML = '<p class="text-gray-500 text-center">No current bookings.</p>';
        return;
    }
    
    bookedDatesList.innerHTML = bookings.map(booking => {
        const startDateObj = booking.startDate instanceof Date ? booking.startDate : new Date(booking.startDate);
        const endDateObj = booking.endDate instanceof Date ? booking.endDate : new Date(booking.endDate);
        const startDateStr = formatDate(startDateObj);
        const endDateStr = formatDate(endDateObj);
        
        return `
            <div class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <p class="font-medium text-gray-800">
                    Booked: <span class="text-blue-600">${startDateStr}</span> to <span class="text-blue-600">${endDateStr}</span>
                </p>
                <p class="text-sm text-gray-600">
                    By: ${booking.userName || 'Reserved'} 
                    ${booking.userEmail ? `(${booking.userEmail})` : ''} 
                    ${booking.userPhone ? ` Ph: ${booking.userPhone}` : ''}
                </p>
                <p class="text-xs text-gray-500 mt-1">
                    Status: <span class="font-semibold text-green-600">Confirmed</span>
                </p>
            </div>
        `;
    }).join('');
}

// Function to save bookings to localStorage
function saveBookings() {
    try {
        // Convert Date objects to strings for storage
        localStorage.setItem('sunnybeach_bookings', JSON.stringify(bookings));
        console.log('Bookings saved successfully');
    } catch (error) {
        console.error('Error saving bookings to localStorage:', error);
    }
}

// Function to clear all bookings and reset the calendar
function clearAllBookings() {
    // Clear the bookings array
    bookings = [];
    
    // Remove from localStorage
    localStorage.removeItem('sunnybeach_bookings');
    localStorage.removeItem('pendingBooking');
    
    console.log('All bookings have been cleared');
    
    // Update the UI
    renderCalendar();
    renderBookedDatesList();
    
    // Show confirmation
    showModal('All bookings have been cleared. The calendar has been reset.', true);
}

// Function to load bookings from localStorage
function loadBookings() {
    try {
        const savedBookings = localStorage.getItem('sunnybeach_bookings');
        if (savedBookings) {
            // Convert string dates back to Date objects
            bookings = JSON.parse(savedBookings).map(booking => ({
                ...booking,
                startDate: new Date(booking.startDate),
                endDate: new Date(booking.endDate)
            }));
            console.log('Bookings loaded successfully:', bookings.length, 'bookings');
        } else {
            // Fallback to JSON file if no bookings in localStorage
            fetchBookingsFromJSON();
        }
    } catch (error) {
        console.error('Error loading bookings from localStorage:', error);
        // Fallback to JSON file
        fetchBookingsFromJSON();
    }
}

// Fetch bookings from the JSON file as fallback
function fetchBookingsFromJSON() {
    fetch('bookings.json')
        .then(response => response.json())
        .then(data => {
            if (data && data.bookings && Array.isArray(data.bookings)) {
                // Convert string dates back to Date objects
                bookings = data.bookings.map(booking => ({
                    ...booking,
                    startDate: new Date(booking.startDate),
                    endDate: new Date(booking.endDate)
                }));
                console.log('Bookings loaded from JSON:', bookings.length, 'bookings');
                renderCalendar();
                renderBookedDatesList();
                // Save to localStorage for future use
                saveBookings();
            }
        })
        .catch(error => {
            console.error('Error loading bookings from JSON:', error);
        });
}

// Load bookings on initialization
loadBookings();
renderCalendar();
renderBookedDatesList();

// This function is now replaced by loadBookings() and fetchBookingsFromJSON() above

// Booking submission
async function submitBooking() {
    // Basic validation
    if (!selectedStartDate || !selectedEndDate) {
        showModal("Please select both a start and end date.");
        return;
    }
    
    if (selectedEndDate < selectedStartDate) {
        showModal("End date cannot be before start date.");
        return;
    }
    
    const name = userNameInput.value.trim();
    const email = userEmailInput.value.trim();
    const phone = userPhoneInput.value.trim();
    
    if (!name || !email || !phone) {
        showModal("Please enter your name, email, and phone number.");
        return;
    }
    
    if (!/^\S+@\S+\.\S+$/.test(email)) {
        showModal("Please enter a valid email address.");
        return;
    }
    
    if (!/^\+?[0-9\s\-()]{7,20}$/.test(phone)) {
        showModal("Please enter a valid phone number.");
        return;
    }
    
    // Check if the dates are already booked
    if (isRangeConflicting(selectedStartDate, selectedEndDate)) {
        showModal("The selected dates are already booked. Please choose different dates.");
        return;
    }
    
    // Disable button and show processing state
    submitBookingBtn.disabled = true;
    submitBookingBtn.textContent = "Processing...";
    
    try {
        // Create a simple booking message
        const bookingMessage = `
            Booking Request Details:

            Name: ${name}
            Email: ${email}
            Phone: ${phone}
            Check-in: ${formatDate(selectedStartDate)}
            Check-out: ${formatDate(selectedEndDate)}
            Submitted: ${new Date().toLocaleString()}
        `;
        
        // Save booking info to localStorage
        const bookingInfo = {
            startDate: selectedStartDate.toISOString(),
            endDate: selectedEndDate.toISOString(),
            userName: name,
            userEmail: email,
            userPhone: phone,
            status: 'confirmed'
        };
        localStorage.setItem('pendingBooking', JSON.stringify(bookingInfo));
        
        // Show processing message
        showModal("Sending your booking request... Please wait.");
        
        // Show processing message
        showModal("Processing your booking request... Please wait.");
        
        // First, add the booking to our local array and save it
        // This ensures the dates are marked as booked even if email fails
        const newBooking = {
            startDate: new Date(selectedStartDate),
            endDate: new Date(selectedEndDate),
            userName: name,
            userEmail: email,
            userPhone: phone,
            status: 'confirmed',
            bookingDate: new Date().toISOString()
        };
        
        // Add to bookings array
        bookings.push(newBooking);
        
        // Save to localStorage
        saveBookings();
        
        // Update the UI immediately
        renderCalendar();
        renderBookedDatesList();
        
        // Prepare a simple fallback method - direct mailto link
        const mailtoSubject = encodeURIComponent("New Booking Request - Sunny Beach Rental");
        const mailtoBody = encodeURIComponent(
            `Booking Request Details:\n\n` +
            `Name: ${name}\n` +
            `Email: ${email}\n` +
            `Phone: ${phone}\n` +
            `Check-in: ${formatDate(selectedStartDate)}\n` +
            `Check-out: ${formatDate(selectedEndDate)}\n` +
            `Submitted: ${new Date().toLocaleString()}`
        );
        
        // Prepare EmailJS data
        const emailData = {
            to_name: "Nikolai", // Owner's name
            from_name: name,
            reply_to: email,
            guest_email: email,
            guest_phone: phone,
            check_in: formatDate(selectedStartDate),
            check_out: formatDate(selectedEndDate),
            message: bookingMessage
        };
        
        // Try to send via EmailJS with correct service and template IDs
        console.log('Attempting to send email via EmailJS with service_9cf2eh2 and template_rv33izg');
        console.log('Email data:', emailData);
        emailjs.send('service_9cf2eh2', 'template_rv33izg', emailData)
            .then(function(response) {
                console.log('Email sent successfully!', response);
                
                // Show success message and reset form
                showModal(
                    "Booking request sent successfully! The owner will contact you to confirm.\n\n" +
                    "Your booking dates have been reserved.", 
                    true
                );
                
                // Reset form
                userNameInput.value = '';
                userEmailInput.value = '';
                userPhoneInput.value = '';
                selectedStartDate = null;
                selectedEndDate = null;
                updateSelectedDateDisplays();
                showApartmentView();
                
                // Re-enable the submit button
                submitBookingBtn.disabled = false;
                submitBookingBtn.textContent = "Book Now";
            })
            .catch(function(error) {
                console.error('Email sending failed:', error);
                console.error('EmailJS error details:', JSON.stringify(error));
                
                // Show a more helpful error message with fallback option
                showModal(
                    "Your booking dates have been reserved, but there was a problem sending the email notification.\n\n" +
                    "Please contact the owner directly at tonevnikolai13@gmail.com to confirm your booking.\n\n" +
                    "Click 'OK' to send an email manually.",
                    true,
                    function() {
                        // Open mailto link as fallback
                        window.location.href = `mailto:tonevnikolai13@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;
                        
                        // Reset form
                        userNameInput.value = '';
                        userEmailInput.value = '';
                        userPhoneInput.value = '';
                        selectedStartDate = null;
                        selectedEndDate = null;
                        updateSelectedDateDisplays();
                        showApartmentView();
                    }
                );
                
                // Re-enable the submit button
                submitBookingBtn.disabled = false;
                submitBookingBtn.textContent = "Book Now";
            });
        
    } catch (error) {
        console.error("Error sending booking: ", error);
        showModal("There was a problem sending your booking request. Please try again or contact us directly.");
    } finally {
        // Always reset button state
        submitBookingBtn.disabled = false;
        submitBookingBtn.textContent = "Request to Book";
        updateBookingButtonState();
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    console.log('Booking system initialized');
    // Initialize the booking system
    loadBookings();
    updateSelectedDateDisplays();
    
    // Add event listeners - with direct function call to ensure it works
    if (submitBookingBtn) {
        console.log('Submit booking button found, adding event listener');
        submitBookingBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Submit booking button clicked');
            
            console.log('Using standard submitBooking function');
            submitBooking();
        });
    } else {
        console.error('Submit booking button not found!');
    }
    if (clearSelectionBtn) clearSelectionBtn.addEventListener('click', () => {
        selectedStartDate = null;
        selectedEndDate = null;
        updateSelectedDateDisplays();
        renderCalendar();
    });
    
    if (prevMonthBtn) prevMonthBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
    });
    
    if (nextMonthBtn) nextMonthBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    });
    
    if (userNameInput) userNameInput.addEventListener('input', updateBookingButtonState);
    if (userEmailInput) userEmailInput.addEventListener('input', updateBookingButtonState);
    if (userPhoneInput) userPhoneInput.addEventListener('input', updateBookingButtonState);
    
    if (backToDetailsBtn) backToDetailsBtn.addEventListener('click', showApartmentView);
    if (goToBookingBtnHero) goToBookingBtnHero.addEventListener('click', showBookingView);
    if (aboutSectionBookBtn) aboutSectionBookBtn.addEventListener('click', showBookingView);
    
    // Add event listener for the Clear All Bookings button
    const clearAllBookingsBtn = document.getElementById('clearAllBookingsBtn');
    if (clearAllBookingsBtn) {
        clearAllBookingsBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to clear all bookings? This cannot be undone.')) {
                clearAllBookings();
            }
        });
    }
    
    // Close modal when clicking the OK button
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', () => {
            document.getElementById('modal').classList.remove('active');
        });
    }
});
