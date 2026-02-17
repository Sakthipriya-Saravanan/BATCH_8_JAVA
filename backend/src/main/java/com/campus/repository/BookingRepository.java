package com.campus.repository;

import com.campus.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    Optional<Booking> findByResourceIdAndBookingDateAndTimeSlot(Long resourceId, LocalDate bookingDate,
            String timeSlot);

    List<Booking> findByUserId(Long userId);

    List<Booking> findTop5ByOrderByIdDesc();

    long countByStatus(Booking.BookingStatus status);
}
