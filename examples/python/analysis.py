"""Plant growth analysis — sample for the Verdula theme."""
from __future__ import annotations

import asyncio
import statistics
from dataclasses import dataclass, field
from enum import Enum
from typing import Iterable


class Climate(Enum):
    DRY = "dry"
    HUMID = "humid"


@dataclass(frozen=True)
class Measurement:
    plant: str
    height_cm: float
    climate: Climate = Climate.HUMID
    tags: list[str] = field(default_factory=list)


class Analyzer:
    ALERT_THRESHOLD = 5.0

    def __init__(self, measurements: Iterable[Measurement]) -> None:
        self._measurements = list(measurements)

    @property
    def average(self) -> float:
        return statistics.mean(m.height_cm for m in self._measurements)

    def alerts(self) -> list[str]:
        return [
            f"⚠️ {m.plant}: {m.height_cm:.1f} cm"
            for m in self._measurements
            if m.height_cm < self.ALERT_THRESHOLD and m.climate is Climate.DRY
        ]

    async def sync(self, delay: float = 0.5) -> dict[str, int]:
        await asyncio.sleep(delay)
        return {"sent": len(self._measurements), "failed": 0}


if __name__ == "__main__":
    data = [
        Measurement("Mint", 12.3),
        Measurement("Cactus", 3.1, Climate.DRY, ["desert"]),
        Measurement("Basil", 8.7),
    ]
    analyzer = Analyzer(data)
    print(f"Average: {analyzer.average:.2f} cm", *analyzer.alerts(), sep="\n")
    print(asyncio.run(analyzer.sync()))
