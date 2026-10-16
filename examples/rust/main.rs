use std::collections::HashMap;
use std::fmt;

/// Seasons of the year that affect growth.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
enum Season {
    Spring,
    Summer,
    Autumn,
    Winter,
}

#[derive(Debug)]
struct Tree<'a> {
    species: &'a str,
    height_m: f32,
    age: u32,
}

trait Grow {
    fn grow(&mut self, season: Season);
}

impl<'a> Grow for Tree<'a> {
    fn grow(&mut self, season: Season) {
        let rate = match season {
            Season::Spring => 0.30,
            Season::Summer => 0.20,
            Season::Autumn | Season::Winter => 0.05,
        };
        self.height_m += rate;
        self.age += 1;
    }
}

impl fmt::Display for Tree<'_> {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{} ({:.2} m, {} years)", self.species, self.height_m, self.age)
    }
}

fn main() {
    const YEARS: u32 = 3;
    let mut forest = vec![
        Tree { species: "Jacaranda", height_m: 1.5, age: 0 },
        Tree { species: "Oak", height_m: 2.0, age: 1 },
    ];

    let mut counts: HashMap<Season, usize> = HashMap::new();

    for _ in 0..YEARS {
        for season in [Season::Spring, Season::Summer, Season::Autumn, Season::Winter] {
            forest.iter_mut().for_each(|t| t.grow(season));
            *counts.entry(season).or_insert(0) += 1;
        }
    }

    for tree in &forest {
        println!("🌳 {tree}");
    }

    if let Some(tallest) = forest.iter().max_by(|a, b| a.height_m.total_cmp(&b.height_m)) {
        println!("Tallest tree: {}", tallest.species);
    }
}
