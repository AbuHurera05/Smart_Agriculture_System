export const workshopTypeToBackend = {
  online: 'ONLINE',
  'in-person': 'IN_PERSON',
  hybrid: 'HYBRID',
}

export const workshopTypeFromBackend = {
  ONLINE: 'online',
  IN_PERSON: 'in-person',
  HYBRID: 'hybrid',
}

export const workshopStatusToBackend = {
  upcoming: 'UPCOMING',
  ongoing: 'ONGOING',
  completed: 'COMPLETED',
  cancelled: 'CANCELLED',
}

export const workshopStatusFromBackend = {
  UPCOMING: 'upcoming',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
}

// Backend LocalTime comes back as "HH:mm:ss" - <input type="time"> wants "HH:mm".
export const timeFromBackend = (time) => (time ? time.slice(0, 5) : '')

// Backend WorkshopResponse 
export const workshopFromResponse = (w) => ({
  id: w.id,
  title: w.title,
  date: w.date,
  time: timeFromBackend(w.time),
  venue: w.venue,
  type: workshopTypeFromBackend[w.type] || 'online',
  capacity: w.capacity,
  price: w.price != null ? Number(w.price) : 0,
  topics: w.topics || [],
  description: w.description,
  image: w.image || '📘',
  status: workshopStatusFromBackend[w.status] || 'upcoming',
  instructorId: w.instructorId,
  instructor: w.instructorName,
  enrolled: w.enrolled ?? 0,
  spotsLeft: w.spotsLeft,
  full: w.full,
  rating: 0, // not tracked by expert-service yet
  createdAt: w.createdAt,
  updatedAt: w.updatedAt,
})

// UI form state -> WorkshopRequest body for POST/PUT /experts/workshops.
export const workshopToRequest = (form) => {
  const topics = Array.isArray(form.topics)
    ? form.topics
    : (form.topics || '').split(',').map((t) => t.trim()).filter(Boolean)

  const payload = {
    title: form.title,
    date: form.date,
    time: form.time?.length === 5 ? `${form.time}:00` : form.time,
    venue: form.venue,
    type: workshopTypeToBackend[form.type] || 'ONLINE',
    capacity: Number(form.capacity) || 1,
    price: Number(form.price) || 0,
    topics,
    description: form.description,
    image: form.image || '📘',
  }

  // status is only honored on update, and only by ADMIN or the owning EXPERT
  if (form.status) {
    payload.status = workshopStatusToBackend[form.status] || undefined
  }

  return payload
}