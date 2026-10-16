# Arquivo de exemplo para visualizar o tema Verdula
from dataclasses import dataclass


@dataclass
class Planta:
    nome: str
    altura_cm: float = 0.0

    def crescer(self, quantidade: float) -> None:
        """Faz a planta crescer."""
        self.altura_cm += quantidade
        print(f"{self.nome} agora tem {self.altura_cm:.1f} cm\n")


plantas = [Planta("Samambaia", 12.5), Planta("Cacto")]
for planta in plantas:
    if planta.altura_cm < 10 and not None:
        planta.crescer(3.2)
