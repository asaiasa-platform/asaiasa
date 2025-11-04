package initializers

import (
	"log"

	"github.com/DAF-Bridge/asaiasa-Backend/internal/domain/models"
)

func SyncDB() {

	err := DB.AutoMigrate(&models.User{})
	if err != nil {
		log.Fatal(err)
	}

}
