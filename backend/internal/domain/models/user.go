package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

//---------------------------------------------------------------------------
// ENUMS
//---------------------------------------------------------------------------

type Role string
type Provider string

const (
	//Enum Role
	RoleUser  Role = "User"
	RoleAdmin Role = "Admin"
)

const (
	// Enum Provider
	ProviderGoogle   Provider = "google"
	ProviderFacebook Provider = "facebook"
	ProviderLocal    Provider = "local"
)

//---------------------------------------------------------------------------
// Models
//---------------------------------------------------------------------------

type User struct {
	ID          uuid.UUID      `gorm:"type:uuid;default:uuid_generate_v4();primaryKey" db:"id"`
	Name        string         `gorm:"type:varchar(255);not null" db:"name"`
	PicUrl      string         `gorm:"type:text;" db:"pic_url"`
	Email       string         `gorm:"type:varchar(255);not null" db:"email"`
	Password    *string        `gorm:"type:varchar(255)" db:"-"` // Hashed password for traditional login
	Role        Role           `gorm:"type:Role;default:'User'" db:"role"`
	Provider    Provider       `gorm:"type:Provider;not null" db:"provider"` // e.g., "google"
	ProviderID  string         `gorm:"type:varchar(255);not null" db:"provider_id"`
	Preferences UserPreference `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE;"`
	CreatedAt   time.Time      `gorm:"autoCreateTime" db:"created_at"`
	UpdatedAt   time.Time      `gorm:"autoUpdateTime" db:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" db:"deleted_at"`
}

type UserPreference struct {
	gorm.Model
	UserID     uuid.UUID  `gorm:"type:uuid;not null;unique" db:"user_id"`
	Categories []Category `gorm:"many2many:user_category;"`
}

type UserInteract struct {
	gorm.Model
	UserID     uuid.UUID `gorm:"type:uuid;not null" db:"user_id"`
	User       User      `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE;"`
	CategoryID uint      `gorm:"type:uint;not null" db:"category_id"`
	Category   Category  `gorm:"foreignKey:CategoryID;constraint:OnDelete:CASCADE;"`
	Count      uint      `gorm:"type:uint;not null;default:0" db:"count"`
}

type UserInteractEvent struct {
	gorm.Model
	UserID  uuid.UUID `gorm:"type:uuid;not null" db:"user_id"`
	User    User      `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE;"`
	EventID uint      `gorm:"type:uint;not null" db:"category_id"`
	Event   Event     `gorm:"foreignKey:EventID;constraint:OnDelete:CASCADE;"`
	Count   uint      `gorm:"type:uint;not null;default:0" db:"count"`
}
