package types

import (
	"time"

	"github.com/uptrace/bun"
)

type AuditableModel struct {
	CreatedAt time.Time `bun:"created_at,notnull" json:"createdAt"`
	CreatedBy string    `bun:"created_by,notnull" json:"createdBy"`
	UpdatedAt time.Time `bun:"updated_at,notnull" json:"updatedAt"`
	UpdatedBy string    `bun:"updated_by,notnull" json:"updatedBy"`
}

// TODO: check constraints are not working
type Organization struct {
	bun.BaseModel `bun:"table:organizations"`

	AuditableModel
	ID              string `bun:"id,pk,type:text" json:"id"`
	Name            string `bun:"name,type:text,notnull" json:"name"`
	IsAnonymous     bool   `bun:"is_anonymous,notnull,default:0,CHECK(is_anonymous IN (0,1))" json:"isAnonymous"`
	HasOptedUpdates bool   `bun:"has_opted_updates,notnull,default:1,CHECK(has_opted_updates IN (0,1))" json:"hasOptedUpdates"`
}

type Invite struct {
	bun.BaseModel `bun:"table:invites"`

	OrgID     string    `bun:"org_id,type:text,notnull"`
	ID        int       `bun:"id,pk,autoincrement"`
	Name      string    `bun:"name,type:text,notnull"`
	Email     string    `bun:"email,type:text,notnull,unique"`
	Token     string    `bun:"token,type:text,notnull"`
	CreatedAt time.Time `bun:"created_at,notnull"`
	Role      string    `bun:"role,type:text,notnull"`
}

type Group struct {
	bun.BaseModel `bun:"table:groups"`

	OrgID string `bun:"org_id,type:text,notnull"`
	ID    string `bun:"id,pk,type:text" json:"id"`
	Name  string `bun:"name,type:text,notnull,unique" json:"name"`
}

type GettableUser struct {
	User
	Role         string    `json:"role"`
	Organization string    `json:"organization"`
	Flags        UserFlags `json:"flags,omitempty"`
}

type User struct {
	bun.BaseModel     `bun:"table:users"`
	ID                string `bun:"id,pk,type:text" json:"id"`
	Name              string `bun:"name,type:text,notnull" json:"name"`
	Email             string `bun:"email,type:text,notnull,unique" json:"email"`
	Password          string `bun:"password,type:text,notnull" json:"-"`
	CreatedAt         int    `bun:"created_at,notnull" json:"createdAt"`
	ProfilePictureURL string `bun:"profile_picture_url,type:text" json:"profilePictureURL"`
	GroupID           string `bun:"group_id,type:text,notnull" json:"groupId"`
	OrgID             string `bun:"org_id,type:text,notnull" json:"orgId"`
}

type ResetPasswordRequest struct {
	bun.BaseModel `bun:"table:reset_password_request"`
	ID            int    `bun:"id,pk,autoincrement"`
	Token         string `bun:"token,type:text,notnull"`
	UserID        string `bun:"user_id,type:text,notnull"`
}

type UserFlags struct {
	bun.BaseModel `bun:"table:user_flags"`
	UserID        *string `bun:"user_id,pk,type:text,notnull" json:"userId,omitempty"`
	Flags         *string `bun:"flags,type:text" json:"flags,omitempty"`
}

type ApdexSettings struct {
	bun.BaseModel      `bun:"table:apdex_settings"`
	ServiceName        string  `bun:"service_name,pk,type:text"`
	Threshold          float64 `bun:"threshold,type:float,notnull"`
	ExcludeStatusCodes string  `bun:"exclude_status_codes,type:text,notnull"`
}

type IngestionKey struct {
	bun.BaseModel `bun:"table:ingestion_keys"`

	AuditableModel
	OrgID        string `bun:"org_id,type:text,notnull"`
	KeyId        string `bun:"key_id,pk,type:text"`
	Name         string `bun:"name,type:text"`
	IngestionKey string `bun:"ingestion_key,type:text,notnull"`
	IngestionURL string `bun:"ingestion_url,type:text,notnull"`
	DataRegion   string `bun:"data_region,type:text,notnull"`
}
