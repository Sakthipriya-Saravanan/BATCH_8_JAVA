package com.campus.service;

import com.campus.dto.BookingRequest;
import com.campus.dto.BookingResponse;
import com.campus.entity.Booking;
import com.campus.entity.Resource;
import com.campus.entity.User;
import com.campus.exception.DuplicateResourceException;
import com.campus.exception.ResourceNotFoundException;
import com.campus.repository.BookingRepository;
import com.campus.repository.ResourceRepository;
import com.campus.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ResourceRepository resourceRepository;

    public BookingService(BookingRepository bookingRepository,
            UserRepository userRepository,
            ResourceRepository resourceRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.resourceRepository = resourceRepository;
    }

    public BookingResponse createBooking(BookingRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));

        Resource resource = resourceRepository.findById(request.getResourceId())
                .orElseThrow(
                        () -> new ResourceNotFoundException("Resource not found with id: " + request.getResourceId()));

        LocalDate bookingDate = LocalDate.parse(request.getBookingDate());

        // Service-level conflict check
        bookingRepository.findByResourceIdAndBookingDateAndTimeSlot(
                request.getResourceId(), bookingDate, request.getTimeSlot()).ifPresent(b -> {
                    throw new DuplicateResourceException("Resource already booked for this date and time slot.");
                });

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setResource(resource);
        booking.setBookingDate(bookingDate);
        booking.setTimeSlot(request.getTimeSlot());
        booking.setStatus(Booking.BookingStatus.PENDING);

        return new BookingResponse(bookingRepository.save(booking));
    }

    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(BookingResponse::new)
                .collect(Collectors.toList());
    }

    public List<BookingResponse> getBookingsByUserId(Long userId) {
        return bookingRepository.findByUserId(userId).stream()
                .map(BookingResponse::new)
                .collect(Collectors.toList());
    }

    public BookingResponse updateBookingStatus(Long id, String status) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        booking.setStatus(Booking.BookingStatus.valueOf(status));
        return new BookingResponse(bookingRepository.save(booking));
    }

    public List<BookingResponse> getRecentBookings() {
        return bookingRepository.findTop5ByOrderByIdDesc().stream()
                .map(BookingResponse::new)
                .collect(Collectors.toList());
    }

    public long count() {
        return bookingRepository.count();
    }

    public long countPending() {
        return bookingRepository.countByStatus(Booking.BookingStatus.PENDING);
    }

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalResources", resourceRepository.count());
        stats.put("totalBookings", bookingRepository.count());
        stats.put("pendingBookings", bookingRepository.countByStatus(Booking.BookingStatus.PENDING));
        stats.put("recentBookings", getRecentBookings());
        return stats;
    }
}
