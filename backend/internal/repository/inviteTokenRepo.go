package repository

import (
	"github.com/DAF-Bridge/Talent-Atmos-Backend/internal/domain/models"
	"github.com/DAF-Bridge/Talent-Atmos-Backend/utils"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type inviteTokenRepository struct {
	db *gorm.DB
}

func (i inviteTokenRepository) GetAll() ([]models.InviteToken, error) {
	var inviteTokens []models.InviteToken
	err := i.db.Find(&inviteTokens).Error
	if err != nil {
		return nil, err
	}
	return inviteTokens, nil
}

func (i inviteTokenRepository) GetByToken(token uuid.UUID) (*models.InviteToken, error) {

	var inviteToken models.InviteToken
	err := i.db.
		//Preload("Organization").
		//Preload("User").
		Where("token = ?", token).
		First(&inviteToken).Error
	if err != nil {
		return nil, err
	}
	return &inviteToken, nil
}

func (i inviteTokenRepository) UpdateByToken(token uuid.UUID, inviteToken *models.InviteToken) error {
	result := i.db.
		Model(&models.InviteToken{}).
		Where("token = ?", token).
		Updates(inviteToken)
	err := utils.GormErrorAndRowsAffected(result)
	if err != nil {
		return err
	}
	return nil
}

func (i inviteTokenRepository) Create(inviteToken *models.InviteToken) (*models.InviteToken, error) {
	var createInviteToken models.InviteToken
	err := i.db.Create(inviteToken).Scan(&createInviteToken).Error
	if err != nil {
		return nil, err
	}
	return &createInviteToken, nil
}

func (i inviteTokenRepository) DeleteByToken(token uuid.UUID) error {

	result := i.db.Where("token = ?", token).Delete(&models.InviteToken{})
	return utils.GormErrorAndRowsAffected(result)

}

func (i inviteTokenRepository) IsExistToken(invitedUserID uuid.UUID, organizationID uint) (bool, error) {
	var count int64
	err := i.db.
		Model(&models.InviteToken{}).
		Where("invited_user_id = ? AND organization_id = ?", invitedUserID, organizationID).
		Count(&count).Error
	if err != nil {
		return false, err
	}
	if count > 0 {
		return true, nil
	}
	return false, nil
}

func (i inviteTokenRepository) Upsert(inviteToken *models.InviteToken) (*models.InviteToken, error) {

	//Upsert

	err := i.db.Model(&models.InviteToken{}).
		Clauses(clause.OnConflict{
			Columns: []clause.Column{
				{Name: "invited_user_id"},
				{Name: "organization_id"}}, // Conflict on these columns
			DoUpdates: clause.Assignments(map[string]interface{}{
				"token": gorm.Expr("COALESCE(EXCLUDED.token, uuid_generate_v4())"),
			}),
		}).Create(inviteToken).Error
	if err != nil {
		return nil, err
	}
	return inviteToken, nil
}

func NewInviteTokenRepository(db *gorm.DB) models.InviteTokenRepository {
	return inviteTokenRepository{db: db}
}
