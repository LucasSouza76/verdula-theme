# Sample file to preview the Verdula theme
from dataclasses import dataclass


@dataclass
class Plant:
    name: str
    height_cm: float = 0.0

    def grow(self, amount: float) -> None:
        """Makes the plant grow."""
        self.height_cm += amount
        print(f"{self.name} is now {self.height_cm:.1f} cm tall\n")


plants = [Plant("Fern", 12.5), Plant("Cactus")]
for plant in plants:
    if plant.height_cm < 10 and not None:
        plant.grow(3.2)
