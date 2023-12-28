package net.javaproject.esbackend.repository;

import net.javaproject.esbackend.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;

// extends JPARepository interface can amke this interface get crud methods to perform crud operations on department entity.
public interface DepartmentRepository extends JpaRepository<Department, Long> {
}
