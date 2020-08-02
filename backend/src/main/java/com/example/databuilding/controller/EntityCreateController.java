package com.example.databuilding.controller;

import com.example.databuilding.entity.CarModel;
import com.example.databuilding.repository.CarModelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Arrays;

@Component
@RestController
@RequestMapping(value = "/create-entity")
public class EntityCreateController {
    @Autowired
    private CarModelRepository repositoryCar;

    @RequestMapping(value = "/car-model")
    public String createCarModel() {
        String[] carNames = {"Mercedes", "Audi", "BMW", "Honda", "Ford", "Lamborghini", "Ferrari", "Tesla", "Toyota", "Bentley"};

        CarModel cm = new CarModel();
        cm.setName(carNames[(int)(Math.random()*9)]);
        cm.setYear((int)(Math.random()*50) + 1970);
        cm.setSku(cm.getName().substring(0,3) + (cm.getYear() % 100));
        repositoryCar.save(cm);

        ArrayList<CarModel> cars = (ArrayList<CarModel>) repositoryCar.findAll();

        return Arrays.toString(cars.toArray());
    }

}
