package initializers

import (
	"html/template"
	"log"
	"os"
	"strconv"

	"github.com/DAF-Bridge/Talent-Atmos-Backend/logs"
	"gopkg.in/gomail.v2"
)

var (
	DialerMail            *gomail.Dialer
	InviteBodyTemplate    *template.Template
	BaseCallbackInviteURL string
)

func SetupInviteMail() {
	inviteBodyTemplate, err := template.ParseFiles("./Invite_email_template.html")
	if err != nil {
		log.Fatalf("Error loading template: %v", err)
	}
	InviteBodyTemplate = inviteBodyTemplate
	baseUrl := os.Getenv("ADMIN_EXTERNAL_URL")
	if baseUrl == "" {
		log.Fatal("ADMIN_EXTERNAL_URL is not set")
	}
	BaseCallbackInviteURL = baseUrl + "/invite-callback?token="
	logs.Info("Successfully Setup Invite Mail")

}

func SetupMail() {
	//SMTP_PASSWORD
	//SMTP_MAIL
	//SMTP_HOST
	//SMTP_PORT
	smtpHost := os.Getenv("SMTP_HOST")

	smtpPort, err := strconv.Atoi(os.Getenv("SMTP_PORT"))
	if err != nil {
		log.Fatal("SMTP_PORT is not set")
	}
	smtpMail := os.Getenv("SMTP_MAIL")
	smtpPassword := os.Getenv("SMTP_PASSWORD")
	//check if the smtp variables are set
	if smtpHost == "" || smtpMail == "" || smtpPassword == "" {
		log.Fatal("SMTP variables are not set")
	}

	DialerMail = gomail.NewDialer(smtpHost, smtpPort, smtpMail, smtpPassword)
	logs.Info("Successfully SMTP client initialized.")

}
