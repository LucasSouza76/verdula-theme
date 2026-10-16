package main

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"sync"
	"time"
)

// Planta representa um item do viveiro.
type Planta struct {
	ID       int       `json:"id"`
	Nome     string    `json:"nome"`
	Regada   bool      `json:"regada"`
	CriadaEm time.Time `json:"criadaEm"`
}

type Viveiro struct {
	mu      sync.RWMutex
	plantas map[int]Planta
	proximo int
}

var ErrNaoEncontrada = errors.New("planta não encontrada")

func NovoViveiro() *Viveiro {
	return &Viveiro{plantas: make(map[int]Planta), proximo: 1}
}

func (v *Viveiro) Adicionar(nome string) Planta {
	v.mu.Lock()
	defer v.mu.Unlock()

	p := Planta{ID: v.proximo, Nome: nome, CriadaEm: time.Now()}
	v.plantas[p.ID] = p
	v.proximo++
	return p
}

func (v *Viveiro) Buscar(id int) (Planta, error) {
	v.mu.RLock()
	defer v.mu.RUnlock()

	if p, ok := v.plantas[id]; ok {
		return p, nil
	}
	return Planta{}, ErrNaoEncontrada
}

func main() {
	viveiro := NovoViveiro()
	viveiro.Adicionar("Samambaia")

	http.HandleFunc("/plantas", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(viveiro.plantas); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
	})

	log.Printf("Servidor ouvindo em :%d\n", 8080)
	log.Fatal(http.ListenAndServe(":8080", nil))
}
