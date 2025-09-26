package iuh.fit.se.entities;

import iuh.fit.se.enums.NotificationType;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;

/**
 * Entity representing a notification in the system. Notifications can be sent to users for various
 * events like calendar reminders, order status changes, promotions, etc.
 */
@Entity
@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "notifications")
public class Notification {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  Long id;

  @Column(name = "title", nullable = false)
  String title;

  @Column(name = "message", columnDefinition = "TEXT")
  String message;

  @Enumerated(EnumType.STRING)
  @Column(name = "type", nullable = false)
  NotificationType type;

  @ManyToOne
  @JoinColumn(name = "user_id", nullable = false)
  User user;

  @Column(name = "is_read", nullable = false)
  Boolean isRead;

  @Column(name = "created_at", nullable = false)
  LocalDateTime createdAt;

  @Column(name = "read_at")
  LocalDateTime readAt;

  // Optional reference to related entities
  @Column(name = "reference_id")
  Long referenceId;

  @Column(name = "reference_type")
  String referenceType;

  @PrePersist
  protected void onCreate() {
    createdAt = LocalDateTime.now();
    if (isRead == null) {
      isRead = false;
    }
  }

  /** Mark the notification as read */
  public void markAsRead() {
    this.isRead = true;
    this.readAt = LocalDateTime.now();
  }
}
