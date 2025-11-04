package iuh.fit.se.repositories.specs;

import iuh.fit.se.dtos.requests.OrderFilterRequest;
import iuh.fit.se.entities.Order;
import iuh.fit.se.entities.OrderDetail;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;

public class OrderSpecification {
  public static Specification<Order> filter(OrderFilterRequest filter) {
    return (root, query, cb) -> {
      List<Predicate> predicates = new ArrayList<>();
      if (filter.getId() != null) {
        predicates.add(cb.equal(root.get("id"), filter.getId()));
      }

      if (filter.getStatus() != null && !filter.getStatus().isEmpty()) {
        predicates.add(root.get("status").in(filter.getStatus()));
      }

      if (filter.getFullName() != null && !filter.getFullName().isBlank()) {
        predicates.add(
            cb.like(
                cb.lower(root.get("fullName")), "%" + filter.getFullName().toLowerCase() + "%"));
      }

      if (filter.getPhoneNumber() != null && !filter.getPhoneNumber().isBlank()) {
        predicates.add(cb.like(root.get("phoneNumber"), "%" + filter.getPhoneNumber() + "%"));
      }

      if (filter.getShippingMethod() != null && filter.getShippingMethod().isEmpty()) {
        predicates.add(root.get("shippingMethod").in(filter.getShippingMethod()));
      }

      if (filter.getShippedDate() != null) {
        predicates.add(cb.greaterThanOrEqualTo(root.get("orderDate"), filter.getShippedDate()));
      }

      if (filter.getDeliveredDate() != null) {
        predicates.add(cb.lessThanOrEqualTo(root.get("orderDate"), filter.getDeliveredDate()));
      }

      if (filter.getProductName() != null && !filter.getProductName().isEmpty()) {
        Join<Order, OrderDetail> details = root.join("orderDetails");
        predicates.add(
            cb.like(
                cb.lower(details.get("product").get("productName")),
                "%" + filter.getProductName().toLowerCase() + "%"));
        assert query != null;
        query.distinct(true);
      }

      return cb.and(predicates.toArray(new Predicate[0]));
    };
  }
}
