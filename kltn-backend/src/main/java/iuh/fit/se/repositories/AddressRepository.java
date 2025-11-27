package iuh.fit.se.repositories;

import iuh.fit.se.entities.Address;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
  List<Address> findByUserId(Long userId);

  Page<Address> findByUserId(Long userId, Pageable pageable);

  @Query(
      "SELECT a FROM Address a WHERE a.user.id = :userId "
          + "AND LOWER(a.city) LIKE LOWER(CONCAT('%', :city, '%'))")
  Page<Address> findByUserIdAndCityContainingIgnoreCase(
      @Param("userId") Long userId, @Param("city") String city, Pageable pageable);

  boolean existsByPhoneNumber(String phoneNumber);

  boolean existsByPhoneNumberAndIdNot(String phoneNumber, Long id);
}
