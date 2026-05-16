export function validateStep(step, form) {
  const nextErrors = {};

  // STEP 0 = Trip
  if (step === 0) {
    if (!form.serviceType) nextErrors.serviceType = "Service type is required.";
    if (!form.pickupDate) nextErrors.pickupDate = "Pickup date is required.";
    if (!form.pickupTime) nextErrors.pickupTime = "Pickup time is required.";
    if (!form.pickupLocation?.trim()) nextErrors.pickupLocation = "Pickup location is required.";

    const isHourly = form.serviceType === "Hourly / As Directed";
    if (isHourly) {
      const h = Number(form.durationHours);
      if (!form.durationHours || Number.isNaN(h) || h <= 0) {
        nextErrors.durationHours = "Enter valid hours.";
      }
    } else {
      if (!form.dropoffLocation?.trim()) {
        nextErrors.dropoffLocation = "Drop-off location is required.";
      }
    }

    const pax = Number(form.passengers);
    if (!pax || Number.isNaN(pax) || pax < 1) nextErrors.passengers = "Passengers must be 1+.";

    if (form.returnTrip) {
      if (!form.returnDate) nextErrors.returnDate = "Return date is required.";
      if (!form.returnTime) nextErrors.returnTime = "Return time is required.";
    }

    if (form.isAirport) {
      if (!form.airline?.trim()) nextErrors.airline = "Airline is required.";
      if (!form.flightNumber?.trim()) nextErrors.flightNumber = "Flight number is required.";
      if (!form.arrivalTime?.trim()) nextErrors.arrivalTime = "Arrival time is required.";
    }
  }

  // STEP 1 = Vehicle
  if (step === 1) {
    if (!form.vehicleId && !form.vehicleType) {
      nextErrors.vehicleType = "Please select a vehicle to continue.";
    }
  }

  // STEP 2 = Passenger
  if (step === 2) {
    if (!form.firstName?.trim()) nextErrors.firstName = "First name is required.";
    if (!form.lastName?.trim()) nextErrors.lastName = "Last name is required.";

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email || "");
    if (!form.email?.trim()) nextErrors.email = "Email is required.";
    else if (!emailOk) nextErrors.email = "Enter a valid email.";

    const phoneDigits = (form.phone || "").replace(/[^\d]/g, "");
    if (!form.phone?.trim()) nextErrors.phone = "Phone is required.";
    else if (phoneDigits.length < 10) nextErrors.phone = "Enter a valid phone.";
  }

  return { ok: Object.keys(nextErrors).length === 0, nextErrors };
}
