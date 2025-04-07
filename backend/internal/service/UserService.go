package service

import (
	"context"
	"errors"
	"fmt"
	"mime/multipart"

	"github.com/DAF-Bridge/Talent-Atmos-Backend/errs"

	"github.com/DAF-Bridge/Talent-Atmos-Backend/internal/domain/dto"

	"github.com/DAF-Bridge/Talent-Atmos-Backend/internal/domain/models"
	"github.com/DAF-Bridge/Talent-Atmos-Backend/internal/infrastructure"
	"github.com/DAF-Bridge/Talent-Atmos-Backend/internal/repository"
	"github.com/DAF-Bridge/Talent-Atmos-Backend/logs"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type userService struct {
	userRepo   repository.UserRepository
	S3Uploader *infrastructure.S3Uploader
}

func NewUserService(userRepo repository.UserRepository, s3Uploader *infrastructure.S3Uploader) UserService {
	return &userService{
		userRepo:   userRepo,
		S3Uploader: s3Uploader,
	}
}

func (s userService) UpdateUserPicture(ctx context.Context, userID uuid.UUID, file multipart.File, fileHeader *multipart.FileHeader) (string, error) {
	// Upload image to S3
	picURL, err := s.S3Uploader.UploadUserPictureFile(ctx, file, fileHeader, userID)
	if err != nil {
		logs.Error(fmt.Sprintf("Failed to upload user picture: %v", err))
		return "", err
	}

	// Update user record in database
	err = s.userRepo.UpdateUserPic(userID, picURL)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			logs.Error("User not found")
			return "", errs.NewNotFoundError("User not found")
		}
		logs.Error(fmt.Sprintf("Failed to update user picture: %v", err))
		return "", err
	}

	return picURL, nil
}

func (s userService) CreateUser(user *models.User) error {
	err := s.userRepo.Create(user)
	if err != nil {
		logs.Error(fmt.Sprintf("Failed to create user: %v", err))
		return err
	}
	return nil
}

func (s userService) ListUsers() ([]dto.UserResponses, error) {
	users, err := s.userRepo.GetAll()
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			logs.Error("Users not found")
			return nil, errs.NewNotFoundError("Users not found")
		}

		logs.Error(fmt.Sprintf("Failed to get users: %v", err))
		return nil, errs.NewUnexpectedError()
	}

	var userResponses []dto.UserResponses
	for _, user := range users {
		userResponse := convertToUserResponses(&user)
		userResponses = append(userResponses, *userResponse)
	}

	return userResponses, nil
}

func (s userService) GetCurrentUserProfile(userId uuid.UUID) (*dto.ProfileResponses, error) {
	profile, err := s.userRepo.GetProfileByUserID(userId)

	// fmt.Println("profile", profile)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			logs.Error("Profile not found")
			return nil, errs.NewNotFoundError("Profile not found")
		}

		logs.Error(fmt.Sprintf("Failed to get profile: %v", err))
		return nil, errs.NewUnexpectedError()
	}

	profileRes := convertToProfileResponse(profile)

	return profileRes, nil
}

func (s userService) FindByUserID(userId uuid.UUID) (*models.User, error) {
	return s.userRepo.FindByID(userId)
}

type userPreferenceService struct {
	userPreferenceRepo repository.UserPreferenceRepository
	userRepo           repository.UserRepository
	eventRepo          repository.EventRepository
}

func NewUserPreferenceService(userPreferenceRepo repository.UserPreferenceRepository, userRepo repository.UserRepository, eventRepo repository.EventRepository) UserPreferenceService {
	return &userPreferenceService{
		userPreferenceRepo: userPreferenceRepo,
		userRepo:           userRepo,
		eventRepo:          eventRepo,
	}
}

func (s userPreferenceService) CreateUserPreference(userID uuid.UUID, req dto.UserPreferenceRequest) error {
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			logs.Error("User not found")
			return errs.NewNotFoundError("User not found")
		}
		if errors.Is(err, gorm.ErrDuplicatedKey) {
			logs.Error("User already exists")
			return errs.NewConflictError("User already exists")
		}

		logs.Error(fmt.Sprintf("Failed to find user: %v", err))
		return errs.NewUnexpectedError()
	}

	categoryIDs := make([]uint, len(req.Categories))
	for _, category := range req.Categories {
		categoryIDs = append(categoryIDs, category.Value)
	}

	categories, err := s.userPreferenceRepo.FindCategoryByIds(categoryIDs)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errs.NewNotFoundError("categories not found")
		}
		logs.Error(err)
		return errs.NewUnexpectedError()
	}

	userPreference := &models.UserPreference{
		UserID:     user.ID,
		Categories: categories,
	}

	err = s.userPreferenceRepo.Create(userPreference)
	if err != nil {
		logs.Error(fmt.Sprintf("Failed to create user preference: %v", err))
		return errs.NewUnexpectedError()
	}

	return nil
}

func (s userPreferenceService) ListUserPreferences() (dto.UserPreferenceTrainingResponses, error) {
	userPreferences, err := s.userPreferenceRepo.GetAll()
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			logs.Error("User preferences not found")
			return dto.UserPreferenceTrainingResponses{}, errs.NewNotFoundError("User preferences not found")
		}
		logs.Error(fmt.Sprintf("Failed to get user preferences: %v", err))
		return dto.UserPreferenceTrainingResponses{}, errs.NewUnexpectedError()
	}

	var userPreferencesResp dto.UserPreferenceTrainingResponses
	for _, userPreference := range userPreferences {
		var categories []uint
		for _, category := range userPreference.Categories {
			categories = append(categories, category.ID)
		}

		userPreferencesResp.ID = append(userPreferencesResp.ID, userPreference.UserID)
		userPreferencesResp.Categories = append(userPreferencesResp.Categories, categories)
	}

	return userPreferencesResp, nil
}

func (s userPreferenceService) ListEventTrainingPreference() (dto.EventTrainingRespoonses, error) {
	events, err := s.eventRepo.GetAll()
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			logs.Error("Events not found")
			return dto.EventTrainingRespoonses{}, errs.NewNotFoundError("Events not found")
		}
		logs.Error(fmt.Sprintf("Failed to get events: %v", err))
		return dto.EventTrainingRespoonses{}, errs.NewUnexpectedError()
	}

	var eventResponses dto.EventTrainingRespoonses
	for _, event := range events {
		var categories []uint
		for _, category := range event.Categories {
			categories = append(categories, category.ID)
		}
		eventResponses.ID = append(eventResponses.ID, event.ID)
		eventResponses.Name = append(eventResponses.Name, event.Name)
		eventResponses.Categories = append(eventResponses.Categories, categories)
	}

	return eventResponses, nil
}

func (s userPreferenceService) GetUserPreference(userID uuid.UUID) (dto.UserPreferenceResponse, error) {
	userPreference, err := s.userPreferenceRepo.FindByUserID(userID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			logs.Error("User preference not found")
			return dto.UserPreferenceResponse{}, errs.NewNotFoundError("User preference not found")
		}
		logs.Error(fmt.Sprintf("Failed to get user preference: %v", err))
		return dto.UserPreferenceResponse{}, errs.NewUnexpectedError()
	}

	return dto.BuildUserPreferenceResponse(*userPreference), nil
}

func (s userPreferenceService) UpdateUserPreference(userID uuid.UUID, req dto.UserPreferenceRequest) (dto.UserPreferenceResponse, error) {
	userPreference, err := s.userPreferenceRepo.FindByUserID(userID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			logs.Error("User preference not found")
			return dto.UserPreferenceResponse{}, errs.NewNotFoundError("User preference not found")
		}
		logs.Error(fmt.Sprintf("Failed to get user preference: %v", err))
		return dto.UserPreferenceResponse{}, errs.NewUnexpectedError()
	}

	categoryIDs := make([]uint, len(req.Categories))
	for _, category := range req.Categories {
		categoryIDs = append(categoryIDs, category.Value)
	}

	categories, err := s.userPreferenceRepo.FindCategoryByIds(categoryIDs)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return dto.UserPreferenceResponse{}, errs.NewNotFoundError("categories not found")
		}
		logs.Error(err)
		return dto.UserPreferenceResponse{}, errs.NewUnexpectedError()
	}

	userPreference.Categories = categories

	err = s.userPreferenceRepo.Update(userPreference)
	if err != nil {
		logs.Error(fmt.Sprintf("Failed to update user preference: %v", err))
		return dto.UserPreferenceResponse{}, errs.NewUnexpectedError()
	}

	return dto.BuildUserPreferenceResponse(*userPreference), nil
}

func (s userPreferenceService) DeleteUserPreference(userID uuid.UUID) error {
	userPreference, err := s.userPreferenceRepo.FindByUserID(userID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			logs.Error("User preference not found")
			return errs.NewNotFoundError("User preference not found")
		}
		logs.Error(fmt.Sprintf("Failed to get user preference: %v", err))
		return errs.NewUnexpectedError()
	}

	err = s.userPreferenceRepo.Delete(userPreference)
	if err != nil {
		logs.Error(fmt.Sprintf("Failed to delete user preference: %v", err))
		return errs.NewUnexpectedError()
	}

	return nil
}

type userInteractService struct {
	userInteractRepo repository.UserInteractRepository
}

func (u userInteractService) IncrementUserInteractForEvent(userID uuid.UUID, eventID uint) error {
	if err := u.userInteractRepo.IncrementUserInteractForEvent(userID, eventID); err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errs.NewNotFoundError("event not found")
		}
		logs.Error(fmt.Sprintf("Failed to increment user interact for event: %v", err))
		return errs.NewUnexpectedError()
	}
	return nil

}

func (u userInteractService) FindByUserID(userID uuid.UUID) ([]dto.UserInteractResponse, error) {
	userInteracts, err := u.userInteractRepo.FindByUserID(userID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			logs.Error("User interacts not found")
			return nil, errs.NewNotFoundError("User interacts not found")
		}
		logs.Error(fmt.Sprintf("Failed to get user interacts: %v", err))
		return nil, errs.NewUnexpectedError()
	}

	var userInteractResponses []dto.UserInteractResponse
	for _, userInteract := range userInteracts {
		userInteractResponse := convertToUserInteractResponse(&userInteract)
		userInteractResponses = append(userInteractResponses, *userInteractResponse)
	}

	return userInteractResponses, nil
}

func (u userInteractService) GetAll() ([]dto.UserInteractResponse, error) {
	userInteracts, err := u.userInteractRepo.GetAll()
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			logs.Error("User interacts not found")
			return nil, errs.NewNotFoundError("User interacts not found")
		}
		logs.Error(fmt.Sprintf("Failed to get user interacts: %v", err))
		return nil, errs.NewUnexpectedError()
	}

	var userInteractResponses []dto.UserInteractResponse
	for _, userInteract := range userInteracts {
		userInteractResponse := convertToUserInteractResponse(&userInteract)
		userInteractResponses = append(userInteractResponses, *userInteractResponse)
	}

	return userInteractResponses, nil
}

func (u userInteractService) FindCategoryByIds(catIDs uint) ([]dto.UserInteractResponse, error) {
	userInteracts, err := u.userInteractRepo.FindCategoryByIds(catIDs)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			logs.Error("User interacts not found")
			return nil, errs.NewNotFoundError("User interacts not found")
		}
		logs.Error(fmt.Sprintf("Failed to get user interacts: %v", err))
		return nil, errs.NewUnexpectedError()
	}

	var userInteractResponses []dto.UserInteractResponse
	for _, userInteract := range userInteracts {
		userInteractResponse := convertToUserInteractResponse(&userInteract)
		userInteractResponses = append(userInteractResponses, *userInteractResponse)
	}

	return userInteractResponses, nil
}

func NewUserInteractService(userInteractRepo repository.UserInteractRepository) UserInteractService {
	return &userInteractService{
		userInteractRepo: userInteractRepo,
	}
}

type userInteractEventService struct {
	userInteractEventRepo repository.UserInteractEventRepository
}

func (u userInteractEventService) FindInteractedEventByUserID(userID uuid.UUID) (*dto.EventsAreInteractedByUserResponse, error) {
	interactEvent, user, err := u.userInteractEventRepo.FindInteractedEventByUserID(userID)

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			logs.Error("User interacts not found")
			return nil, errs.NewNotFoundError("User interacts not found")
		}
		logs.Error(fmt.Sprintf("Failed to get user interacts: %v", err))
		return nil, errs.NewUnexpectedError()
	}

	return convertToEventsAreInteractedByUserResponse(user, interactEvent), nil

}

func (u userInteractEventService) GetAll() ([]dto.UserInteractEventResponse, error) {
	interactEvents, err := u.userInteractEventRepo.GetAll()
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			logs.Error("User interacts not found")
			return nil, errs.NewNotFoundError("User interacts not found")
		}
		logs.Error(fmt.Sprintf("Failed to get user interacts: %v", err))
		return nil, errs.NewUnexpectedError()
	}

	var userInteractResponses []dto.UserInteractEventResponse
	for _, userInteract := range interactEvents {
		userInteractResponse := convertToUserInteractEventResponse(&userInteract)
		userInteractResponses = append(userInteractResponses, *userInteractResponse)
	}

	return userInteractResponses, nil
}

func (u userInteractEventService) FindUserCategoriesStatsByUserID(userID uuid.UUID) (*dto.UserInteractCategoriesResponse, error) {
	interactEvent, user, err := u.userInteractEventRepo.FindInteractedEventByUserID(userID)

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			logs.Error("User interacts not found")
			return nil, errs.NewNotFoundError("User interacts not found")
		}
		logs.Error(fmt.Sprintf("Failed to get user interacts: %v", err))
		return nil, errs.NewUnexpectedError()
	}

	events := make([]models.Event, 0)
	for _, event := range interactEvent {
		events = append(events, event.Event)
	}

	return convertToUserInteractCategoryResponse(user, events), nil

}

func (u userInteractEventService) GetAllUserCategoriesStats() ([]dto.UserInteractCategoriesResponse, error) {
	interactEvents, err := u.userInteractEventRepo.GetAll()
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			logs.Error("User interacts not found")
			return nil, errs.NewNotFoundError("User interacts not found")
		}
		logs.Error(fmt.Sprintf("Failed to get user interacts: %v", err))
		return nil, errs.NewUnexpectedError()
	}

	return convertToListUserInteractCategoryResponse(interactEvents), nil
}

func (u userInteractEventService) GetAllInteractedEventPerUser() ([]dto.EventsAreInteractedByUserResponse, error) {
	interactEvents, err := u.userInteractEventRepo.GetAll()
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			logs.Error("User interacts not found")
			return nil, errs.NewNotFoundError("User interacts not found")
		}
		logs.Error(fmt.Sprintf("Failed to get user interacts: %v", err))
		return nil, errs.NewUnexpectedError()
	}

	return convertToAllEventsAreInteractedByUserResponse(interactEvents), nil

}

func (u userInteractEventService) IncrementUserInteractForEvent(userID uuid.UUID, eventID uint) error {
	if err := u.userInteractEventRepo.IncrementUserInteractForEvent(userID, eventID); err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errs.NewNotFoundError("event not found")
		}
		logs.Error(fmt.Sprintf("Failed to increment user interact for event: %v", err))
		return errs.NewUnexpectedError()
	}
	return nil
}

func NewUserInteractEventService(userInteractEventRepo repository.UserInteractEventRepository) UserInteractEventService {
	return &userInteractEventService{
		userInteractEventRepo: userInteractEventRepo,
	}
}
