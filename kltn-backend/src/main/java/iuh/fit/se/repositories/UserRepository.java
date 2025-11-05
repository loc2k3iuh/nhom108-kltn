package iuh.fit.se.repositories;

import iuh.fit.se.entities.User;
import iuh.fit.se.enums.UserStatus;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
  boolean existsByPhoneNumber(String phoneNumber);

  boolean existsByEmail(String email);

  boolean existsByUsername(String username);

  Optional<User> findByUsername(String username);

  Optional<User> findByEmail(String email);

  List<User> findByStatus(UserStatus status);

  Optional<User> findByPhoneNumber(String phoneNumber);

  @Query(
      value =
          "SELECT DISTINCT u FROM User u LEFT JOIN FETCH u.roles r "
              + "WHERE r.name = 'CUSTOMER' "
              + "AND u.enabled = true "
              + "AND (:fullName IS NULL OR u.fullName LIKE CONCAT('%', :fullName, '%')) "
              + "AND (:isActive IS NULL OR u.isActive = :isActive)",
      countQuery =
          "SELECT COUNT(DISTINCT u) FROM User u JOIN u.roles r "
              + "WHERE r.name = 'CUSTOMER' "
              + "AND u.enabled = true "
              + "AND (:fullName IS NULL OR u.fullName LIKE CONCAT('%', :fullName, '%')) "
              + "AND (:isActive IS NULL OR u.isActive = :isActive)")
  Page<User> searchCustomer(
      @Param("fullName") String fullName, @Param("isActive") Boolean isActive, Pageable pageable);

  // Count users with CUSTOMER role
  @Query("SELECT COUNT(u) FROM User u JOIN u.roles r WHERE r.name = 'CUSTOMER'")
  Long countCustomers();

  // Count new customers (users with CUSTOMER role) created in date range
  @Query(
      "SELECT COUNT(u) FROM User u JOIN u.roles r "
          + "WHERE r.name = 'CUSTOMER' "
          + "AND u.createdDate BETWEEN :startDate AND :endDate")
  Long countNewCustomers(@Param("startDate") Date startDate, @Param("endDate") Date endDate);
}
