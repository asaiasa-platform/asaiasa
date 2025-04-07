package initializers

import (
	"log"
	
	"gorm.io/gorm"
)

func InitEnums(db *gorm.DB) error {
	enums := []string{
		`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`,
		`CREATE TYPE "role" AS ENUM ('User', 'Admin')`,
		`CREATE TYPE "provider" AS ENUM ('google', 'facebook', 'local')`,
		// `SELECT * FROM pg_extension WHERE extname = 'uuid-ossp')`,
		// `SELECT uuid_generate_v4()`,
		// `CREATE TYPE "media" AS ENUM ('website', 'facebook', 'instagram', 'tiktok', 'youtube', 'linkedin', 'line')`,
		// `DROP TYPE IF EXISTS "Media"`,
		`CREATE TYPE "work_type" AS ENUM ('fulltime', 'parttime', 'internship', 'volunteer')`,
		`CREATE TYPE "workplace" AS ENUM ('onsite', 'remote', 'hybrid')`,
		`CREATE TYPE "career_stage" AS ENUM ('entrylevel', 'midlevel', 'senior')`,
		// `ALTER TYPE "career_stage" ADD VALUE 'midlevel'`,
	}
	for _, e := range enums {
		if err := db.Exec(e).Error; err != nil {
			// Log the error but continue with other enum creations
			log.Printf("Warning: Error executing SQL: %s. Error: %v", e, err)
			continue
		}
	}
	return nil
}

// const (
// 	WorkTypeFullTime 	WorkType = "fulltime"
// 	WorkTypePartTime 	WorkType = "parttime"
// 	WorkTypeInternship 	WorkType = "internship"
// 	WorkTypeVolunteer 	WorkType = "volunteer"
// )

// const (
// 	WorkplaceOnsite Workplace = "onsite"
// 	WorkplaceRemote Workplace = "remote"
// 	WorkplaceHybrid Workplace = "hybrid"
// )

// const (
// 	CareerStageEntryLevel 	CareerStage = "entrylevel"
// 	CareerStageSenior 		CareerStage = "senior"
// )
