<?php

declare(strict_types=1);

namespace Verdula\Exemplo;

use InvalidArgumentException;

final class Viveiro
{
    public const CAPACIDADE = 50;

    /** @var array<int, string> */
    private array $mudas = [];

    public function __construct(private readonly string $nome)
    {
    }

    public function plantar(string $especie, int $quantidade = 1): self
    {
        if ($quantidade <= 0 || count($this->mudas) + $quantidade > self::CAPACIDADE) {
            throw new InvalidArgumentException("Quantidade inválida: {$quantidade}");
        }

        for ($i = 0; $i < $quantidade; $i++) {
            $this->mudas[] = strtolower($especie);
        }

        return $this;
    }

    public function resumo(): string
    {
        $contagem = array_count_values($this->mudas);
        $linhas = array_map(
            fn (string $especie, int $total): string => sprintf('%s: %d', $especie, $total),
            array_keys($contagem),
            $contagem,
        );

        return "Viveiro {$this->nome}\n" . implode(PHP_EOL, $linhas);
    }
}

echo (new Viveiro('Central'))->plantar('Ipê', 3)->plantar('Palmeira')->resumo();
