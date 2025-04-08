# Start from the official Golang base image
FROM golang:1.23.4-alpine AS builder

#RUN apk add --no-cache git

# Set the Current Working Directory inside the container
WORKDIR /app
RUN apk add vim git

RUN apk --no-cache add ca-certificates

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download all dependencies. Dependencies will be cached if the go.mod and go.sum files are not changed
RUN go mod download && go mod verify

# Copy the source from the current directory to the Working Directory inside the container
COPY . .

# Run tests before building the Go app
# RUN go test -tags=unit ./internal/test/unit/

# Run integration tests
# RUN go test -tags=integration ./internal/test/integration/

ENV CGO_ENABLED=0 

ENV ENVIRONMENT=production

# Build the Go app
# RUN go build -ldflags="-s -w" -v -o /usr/local/bin/app ./
RUN go build -o /app/bin/gofiber-server main.go
# RUN go build -o /app/bin/migrate-postgres ./migrate/migratePostgres.go


EXPOSE 8080

# Command to run the executable
CMD ["/app/bin/gofiber-server"]