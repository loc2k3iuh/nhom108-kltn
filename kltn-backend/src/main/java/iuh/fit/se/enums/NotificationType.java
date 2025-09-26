package iuh.fit.se.enums;

import com.fasterxml.jackson.annotation.JsonFormat;

/**
 * Enum representing different types of notifications in the system. This helps categorize
 * notifications for easier filtering and display.
 */
@JsonFormat(shape = JsonFormat.Shape.STRING)
public enum NotificationType {
  // Calendar related notifications
  CALENDAR_REMINDER, // Reminder for upcoming calendar events
  CALENDAR_CREATED, // New calendar event created
  CALENDAR_UPDATED, // Calendar event updated
  CALENDAR_CANCELLED, // Calendar event cancelled

  // Order related notifications
  ORDER_CREATED, // New order created
  ORDER_STATUS_CHANGED, // Order status changed
  ORDER_COMPLETED, // Order completed
  ORDER_CANCELLED, // Order cancelled

  // Product related notifications
  PRODUCT_ADDED, // New product added
  PRODUCT_UPDATED, // Product updated
  PRODUCT_OUT_OF_STOCK, // Product out of stock
  PRODUCT_BACK_IN_STOCK, // Product back in stock

  // Promotion related notifications
  PROMOTION_ADDED, // New promotion added
  PROMOTION_ENDING_SOON, // Promotion ending soon

  // System notifications
  SYSTEM_ANNOUNCEMENT // General system announcements
}
