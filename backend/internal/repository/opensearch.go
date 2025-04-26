package repository

import "github.com/DAF-Bridge/Talent-Atmos-Backend/internal/domain/dto"

type OpenSearchRepository interface {
	CreateOrUpdateEvent(event *dto.EventDocument) error
	DeleteEvent(event dto.EventDocument) error

	CreateOrUpdateJob(job *dto.JobDocument) error
	DeleteJob(job dto.JobDocument) error
}
