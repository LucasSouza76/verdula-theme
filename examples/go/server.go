package main

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"sync"
	"time"
)

// Plant represents an item in the nursery.
type Plant struct {
	ID        int       `json:"id"`
	Name      string    `json:"name"`
	Watered   bool      `json:"watered"`
	CreatedAt time.Time `json:"createdAt"`
}

type Nursery struct {
	mu     sync.RWMutex
	plants map[int]Plant
	nextID int
}

var ErrNotFound = errors.New("plant not found")

func NewNursery() *Nursery {
	return &Nursery{plants: make(map[int]Plant), nextID: 1}
}

func (n *Nursery) Add(name string) Plant {
	n.mu.Lock()
	defer n.mu.Unlock()

	p := Plant{ID: n.nextID, Name: name, CreatedAt: time.Now()}
	n.plants[p.ID] = p
	n.nextID++
	return p
}

func (n *Nursery) Find(id int) (Plant, error) {
	n.mu.RLock()
	defer n.mu.RUnlock()

	if p, ok := n.plants[id]; ok {
		return p, nil
	}
	return Plant{}, ErrNotFound
}

func main() {
	nursery := NewNursery()
	nursery.Add("Fern")

	http.HandleFunc("/plants", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(nursery.plants); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
	})

	log.Printf("Server listening on :%d\n", 8080)
	log.Fatal(http.ListenAndServe(":8080", nil))
}
