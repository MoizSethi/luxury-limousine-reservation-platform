export function buildReservationPayload(form) {
  return {
    serviceType: form.serviceType,

    pickupDate: form.pickupDate,
    pickupTime: form.pickupTime,

    pickupLocation: form.pickupLocation,

    dropoffLocation:
      form.serviceType === "Hourly / As Directed"
        ? ""
        : form.dropoffLocation,

    durationHours:
      form.serviceType === "Hourly / As Directed"
        ? Number(form.durationHours || 1)
        : "",

    distanceText: form.distanceText || "",
    durationText: form.durationText || "",
    distanceMiles: Number(form.distanceMiles || 0),
    distanceKm: Number(form.distanceKm || 0),

    returnTrip: !!form.returnTrip,
    returnDate: form.returnTrip ? form.returnDate : "",
    returnTime: form.returnTrip ? form.returnTime : "",

    passengers: Number(form.passengers || 1),
    luggage: Number(form.luggage || 0),

    // ✅ IMPORTANT
    vehicleId: form.vehicleId || null,
    vehicleType: form.vehicleType || "",
    selectedPrice:
      form.selectedPrice != null
        ? Number(form.selectedPrice)
        : null,
    vehicleImage: form.vehicleImage || "",

    hourlyPrice:
      form.hourlyPrice != null
        ? Number(form.hourlyPrice)
        : null,

    dailyPrice:
      form.dailyPrice != null
        ? Number(form.dailyPrice)
        : null,

    meetGreet: !!form.meetGreet,
    childSeat: !!form.childSeat,
    boosterSeat: !!form.boosterSeat,

    isAirport: !!form.isAirport,
    airline: form.isAirport ? form.airline : "",
    flightNumber: form.isAirport ? form.flightNumber : "",
    arrivalTime: form.isAirport ? form.arrivalTime : "",

    firstName: form.firstName,
    lastName: form.lastName,
    email: form.email,
    phone: form.phone,

    notes: form.notes || "",
  };
}