const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

// Dummy movie and booking data
let movies = [
  { id: 1, title: 'Avengers', seats: 5 },
  { id: 2, title: 'Inception', seats: 3 },
  { id: 3, title: 'Interstellar', seats: 2 }
];

let bookings = [];
let bookingId = 1;

// GET /movies - List available movies
app.get('/movies', (req, res) => {
  res.json(movies);
});

// POST /book - Book a ticket
app.post('/book', (req, res) => {
  const { movieId, customerName } = req.body;
  const movie = movies.find(m => m.id === movieId);

  if (!movie) {
    return res.status(404).json({ message: 'Movie not found' });
  }

  if (movie.seats <= 0) {
    return res.status(400).json({ message: 'No seats available' });
  }

  movie.seats--;
  const newBooking = {
    id: bookingId++,
    movieTitle: movie.title,
    customerName
  };
  bookings.push(newBooking);
  res.json({ message: `Booked ${movie.title} for Customer: ${customerName}` });
});

// GET /bookings - View all booked tickets
app.get('/bookings', (req, res) => {
  res.json(bookings);
});

// DELETE /cancel/:id - Cancel a booking
app.delete('/cancel/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = bookings.findIndex(b => b.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  const booking = bookings.splice(index, 1)[0];
  const movie = movies.find(m => m.title === booking.movieTitle);
  if (movie) movie.seats++;

  res.json({ message: `Canceled booking for ${booking.customerName}` });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
