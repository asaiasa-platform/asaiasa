//go:build unit

package unit_test

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http/httptest"
	"testing"

	"github.com/DAF-Bridge/Talent-Atmos-Backend/internal/domain/dto"
	"github.com/DAF-Bridge/Talent-Atmos-Backend/internal/domain/models"
	"github.com/DAF-Bridge/Talent-Atmos-Backend/internal/handler"
	"github.com/DAF-Bridge/Talent-Atmos-Backend/internal/service"
	"github.com/DAF-Bridge/Talent-Atmos-Backend/utils"
	"github.com/gofiber/fiber/v2"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func TestEventHandler(t *testing.T) {
	t.Run("TestGetEventByItsIDandOrgID", func(t *testing.T) {
		//ARRANGE
		eventID := 1
		organizationID := 1
		expected := models.Event{
			Model:          gorm.Model{ID: 1},
			OrganizationID: 1,
			Categories:     []models.Category{{Model: gorm.Model{ID: 1}, Name: "default"}},
			Name:           "Builds Renewable Energy Summit",
			PicUrl:         "https://drive.google.com/uc?export=view&id=1-wqxOT_uo1pE_mEPHbJVoirMMH2Be3Ks",
			StartDate:      utils.DateOnly{Time: utils.DateParser("2025-01-15")},
			EndDate:        utils.DateOnly{Time: utils.DateParser("2025-01-16")},
			StartTime:      utils.TimeOnly{Time: utils.TimeParser("09:00:00")},
			EndTime:        utils.TimeOnly{Time: utils.TimeParser("17:00:00")},
			Content:        "Explore advancements in renewable energy technologies.",
			LocationName:   "Conference Hall A",
			Latitude:       13.7563,
			Longitude:      100.5018,
			Province:       "Bangkok",
			LocationType:   "onsite",
			Audience:       "students",
			PriceType:      "free",
		}

		expectedResponse := service.ConvertToEventResponse(expected)

		eventService := service.NewEventServiceMock()
		eventService.On("GetEventByIDwithOrgID", uint(organizationID), uint(eventID)).Return(&expectedResponse, nil)
		eventHandler := handler.NewEventHandler(eventService)

		app := fiber.New()
		app.Get("/orgs/:orgID/events/:id", eventHandler.GetEventByIDwithOrgID)

		req := httptest.NewRequest("GET", fmt.Sprintf("/orgs/%v/events/%v", organizationID, eventID), nil)

		//ACT
		res, _ := app.Test(req)
		defer res.Body.Close()

		//ASSERT
		if assert.Equal(t, fiber.StatusOK, res.StatusCode) {
			body, _ := io.ReadAll(res.Body)

			var actual dto.EventResponses
			expectedResponse := service.ConvertToEventResponse(expected)

			err := json.Unmarshal(body, &actual)
			assert.NoError(t, err)
			assert.Equal(t, expectedResponse, actual)
		}
	})
}
