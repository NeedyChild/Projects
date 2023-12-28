package net.javaproject.esbackend.mapper;

import net.javaproject.esbackend.dto.DepartmentDto;
import net.javaproject.esbackend.entity.Department;

public class DepartmentMapper {

    // convert department jpa entity into department object
    public static DepartmentDto mapToDepartmentDto(Department department) {
        return new DepartmentDto(
                department.getId(),
                department.getDepartmentName(),
                department.getDepartmentDescription()
        );
    }

    // convert department object into department jpa entity
    public static Department mapToDepartment(DepartmentDto departmentDto) {
        return new Department(
                departmentDto.getId(),
                departmentDto.getDepartmentName(),
                departmentDto.getDepartmentDescription()
        );
    }
}
