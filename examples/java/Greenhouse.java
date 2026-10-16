package br.com.verdula.example;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Controls the temperature and the plants of a greenhouse.
 *
 * @author Verdula
 */
public class Greenhouse implements AutoCloseable {

    private static final double IDEAL_TEMPERATURE = 24.5;
    private final List<String> plants = new ArrayList<>();
    private double temperature;

    public Greenhouse(double initialTemperature) {
        this.temperature = initialTemperature;
    }

    @Override
    public void close() {
        System.out.println("Greenhouse closed with " + plants.size() + " plants.");
    }

    public void add(String plant) {
        if (plant == null || plant.isBlank()) {
            throw new IllegalArgumentException("Plant name is required");
        }
        plants.add(plant);
    }

    public Optional<String> find(String prefix) {
        return plants.stream()
                .filter(p -> p.startsWith(prefix))
                .findFirst();
    }

    public boolean needsAdjustment() {
        return Math.abs(temperature - IDEAL_TEMPERATURE) > 2.0;
    }

    public static void main(String[] args) {
        try (var greenhouse = new Greenhouse(21.0)) {
            greenhouse.add("Orchid");
            greenhouse.add("Bromeliad");
            System.out.printf("Needs adjustment? %b%n", greenhouse.needsAdjustment());
        }
    }
}
