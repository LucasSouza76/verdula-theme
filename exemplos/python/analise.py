"""Análise de crescimento de plantas — exemplo para o tema Verdula."""
from __future__ import annotations

import asyncio
import statistics
from dataclasses import dataclass, field
from enum import Enum
from typing import Iterable


class Clima(Enum):
    SECO = "seco"
    UMIDO = "úmido"


@dataclass(frozen=True)
class Medicao:
    planta: str
    altura_cm: float
    clima: Clima = Clima.UMIDO
    tags: list[str] = field(default_factory=list)


class Analisador:
    LIMITE_ALERTA = 5.0

    def __init__(self, medicoes: Iterable[Medicao]) -> None:
        self._medicoes = list(medicoes)

    @property
    def media(self) -> float:
        return statistics.mean(m.altura_cm for m in self._medicoes)

    def alertas(self) -> list[str]:
        return [
            f"⚠️ {m.planta}: {m.altura_cm:.1f} cm"
            for m in self._medicoes
            if m.altura_cm < self.LIMITE_ALERTA and m.clima is Clima.SECO
        ]

    async def sincronizar(self, atraso: float = 0.5) -> dict[str, int]:
        await asyncio.sleep(atraso)
        return {"enviadas": len(self._medicoes), "falhas": 0}


if __name__ == "__main__":
    dados = [
        Medicao("Hortelã", 12.3),
        Medicao("Cacto", 3.1, Clima.SECO, ["deserto"]),
        Medicao("Manjericão", 8.7),
    ]
    analisador = Analisador(dados)
    print(f"Média: {analisador.media:.2f} cm", *analisador.alertas(), sep="\n")
    print(asyncio.run(analisador.sincronizar()))
