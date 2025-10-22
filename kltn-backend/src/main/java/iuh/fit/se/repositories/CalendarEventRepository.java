package iuh.fit.se.repositories;

import iuh.fit.se.entities.CalendarEvent;
import iuh.fit.se.entities.User;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CalendarEventRepository extends JpaRepository<CalendarEvent, Long> {

  List<CalendarEvent> findByCreatedByOrderByStartTimeAsc(User user);

  @Query(
      "SELECT e FROM CalendarEvent e WHERE e.createdBy = :user AND e.startTime <= :end AND e.endTime >= :start ORDER BY e.startTime ASC")
  List<CalendarEvent> findOverlappingByUser(
      @Param("user") User user,
      @Param("start") LocalDateTime start,
      @Param("end") LocalDateTime end);

  List<CalendarEvent> findAllByOrderByStartTimeAsc();

  @Query(
      "SELECT e FROM CalendarEvent e WHERE e.startTime <= :end AND e.endTime >= :start ORDER BY e.startTime ASC")
  List<CalendarEvent> findOverlappingAll(
      @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}
