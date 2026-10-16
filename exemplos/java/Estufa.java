package br.com.verdula.exemplo;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Controla a temperatura e as plantas de uma estufa.
 *
 * @author Verdula
 */
public class Estufa implements AutoCloseable {

    private static final double TEMPERATURA_IDEAL = 24.5;
    private final List<String> plantas = new ArrayList<>();
    private double temperatura;

    public Estufa(double temperaturaInicial) {
        this.temperatura = temperaturaInicial;
    }

    @Override
    public void close() {
        System.out.println("Estufa fechada com " + plantas.size() + " plantas.");
    }

    public void adicionar(String planta) {
        if (planta == null || planta.isBlank()) {
            throw new IllegalArgumentException("Nome da planta é obrigatório");
        }
        plantas.add(planta);
    }

    public Optional<String> buscar(String prefixo) {
        return plantas.stream()
                .filter(p -> p.startsWith(prefixo))
                .findFirst();
    }

    public boolean precisaAjustar() {
        return Math.abs(temperatura - TEMPERATURA_IDEAL) > 2.0;
    }

    public static void main(String[] args) {
        try (var estufa = new Estufa(21.0)) {
            estufa.adicionar("Orquídea");
            estufa.adicionar("Bromélia");
            System.out.printf("Precisa ajustar? %b%n", estufa.precisaAjustar());
        }
    }
}
