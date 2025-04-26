package repository

import (
	"bytes"
	"encoding/json"
	"fmt"

	"github.com/DAF-Bridge/Talent-Atmos-Backend/errs"
	"github.com/DAF-Bridge/Talent-Atmos-Backend/internal/domain/dto"
	"github.com/DAF-Bridge/Talent-Atmos-Backend/logs"
	"github.com/opensearch-project/opensearch-go"
)

type openSearchRepository struct {
	es *opensearch.Client
}

func NewOpenSearchRepository(es *opensearch.Client) OpenSearchRepository {
	return &openSearchRepository{
		es: es,
	}
}

func (os *openSearchRepository) CreateOrUpdateEvent(event *dto.EventDocument) error {
	// Convert event data to JSON
	data, err := json.Marshal(event)
	if err != nil {
		return errs.NewCannotBeProcessedError("error marshalling event data")
	}

	// Index the document
	res, err := os.es.Index("events", bytes.NewReader(data), os.es.Index.WithDocumentID(fmt.Sprintf("%d", event.ID)))
	if err != nil {
		return errs.NewCannotBeProcessedError("error indexing document")
	}
	defer res.Body.Close()

	logs.Info(fmt.Sprintf("Event document indexed: %v", event))

	return nil
}

func (os *openSearchRepository) DeleteEvent(event dto.EventDocument) error {
	// Delete the document from OpenSearch
	res, err := os.es.Delete("events", fmt.Sprintf("%d", event.ID))
	if err != nil {
		return errs.NewCannotBeProcessedError(fmt.Sprintf("error deleting document: %v", err))
	}
	defer res.Body.Close()

	logs.Info(fmt.Sprintf("Event document deleted: %v", event))

	return nil
}

func (os *openSearchRepository) CreateOrUpdateJob(job *dto.JobDocument) error {
	// Convert job data to JSON
	data, err := json.Marshal(job)
	if err != nil {
		return errs.NewCannotBeProcessedError("error marshalling job data")
	}

	// Index the document
	res, err := os.es.Index("jobs", bytes.NewReader(data), os.es.Index.WithDocumentID(fmt.Sprintf("%d", job.ID)))
	if err != nil {
		return errs.NewCannotBeProcessedError("error indexing document")
	}
	defer res.Body.Close()

	logs.Info(fmt.Sprintf("Job document indexed: %v", job))

	return nil
}

func (os *openSearchRepository) DeleteJob(job dto.JobDocument) error {
	// Delete the document from OpenSearch
	res, err := os.es.Delete("jobs", fmt.Sprintf("%d", job.ID))
	if err != nil {
		return errs.NewCannotBeProcessedError(fmt.Sprintf("error deleting document: %v", err))
	}
	defer res.Body.Close()

	logs.Info(fmt.Sprintf("Job document deleted: %v", job))

	return nil
}
