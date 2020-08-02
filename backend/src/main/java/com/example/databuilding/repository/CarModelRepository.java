package com.example.databuilding.repository;

import com.example.databuilding.entity.CarModel;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CarModelRepository extends CrudRepository<CarModel, Long> {}
