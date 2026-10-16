<?php

declare(strict_types=1);

namespace Verdula\Example;

use InvalidArgumentException;

final class Nursery
{
    public const CAPACITY = 50;

    /** @var array<int, string> */
    private array $seedlings = [];

    public function __construct(private readonly string $name)
    {
    }

    public function plant(string $species, int $quantity = 1): self
    {
        if ($quantity <= 0 || count($this->seedlings) + $quantity > self::CAPACITY) {
            throw new InvalidArgumentException("Invalid quantity: {$quantity}");
        }

        for ($i = 0; $i < $quantity; $i++) {
            $this->seedlings[] = strtolower($species);
        }

        return $this;
    }

    public function summary(): string
    {
        $counts = array_count_values($this->seedlings);
        $lines = array_map(
            fn (string $species, int $total): string => sprintf('%s: %d', $species, $total),
            array_keys($counts),
            $counts,
        );

        return "Nursery {$this->name}\n" . implode(PHP_EOL, $lines);
    }
}

echo (new Nursery('Central'))->plant('Jacaranda', 3)->plant('Palm')->summary();
