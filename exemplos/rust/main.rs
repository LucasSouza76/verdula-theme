use std::collections::HashMap;
use std::fmt;

/// Estações do ano que afetam o crescimento.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
enum Estacao {
    Primavera,
    Verao,
    Outono,
    Inverno,
}

#[derive(Debug)]
struct Arvore<'a> {
    especie: &'a str,
    altura_m: f32,
    idade: u32,
}

trait Crescer {
    fn crescer(&mut self, estacao: Estacao);
}

impl<'a> Crescer for Arvore<'a> {
    fn crescer(&mut self, estacao: Estacao) {
        let taxa = match estacao {
            Estacao::Primavera => 0.30,
            Estacao::Verao => 0.20,
            Estacao::Outono | Estacao::Inverno => 0.05,
        };
        self.altura_m += taxa;
        self.idade += 1;
    }
}

impl fmt::Display for Arvore<'_> {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{} ({:.2} m, {} anos)", self.especie, self.altura_m, self.idade)
    }
}

fn main() {
    const ANOS: u32 = 3;
    let mut floresta = vec![
        Arvore { especie: "Ipê", altura_m: 1.5, idade: 0 },
        Arvore { especie: "Jatobá", altura_m: 2.0, idade: 1 },
    ];

    let mut contagem: HashMap<Estacao, usize> = HashMap::new();

    for _ in 0..ANOS {
        for estacao in [Estacao::Primavera, Estacao::Verao, Estacao::Outono, Estacao::Inverno] {
            floresta.iter_mut().for_each(|a| a.crescer(estacao));
            *contagem.entry(estacao).or_insert(0) += 1;
        }
    }

    for arvore in &floresta {
        println!("🌳 {arvore}");
    }

    if let Some(maior) = floresta.iter().max_by(|a, b| a.altura_m.total_cmp(&b.altura_m)) {
        println!("Maior árvore: {}", maior.especie);
    }
}
