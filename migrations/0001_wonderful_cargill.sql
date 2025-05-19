CREATE TABLE "userAnswer" (
	"id" serial PRIMARY KEY NOT NULL,
	"mockId" varchar NOT NULL,
	"question" varchar NOT NULL,
	"correctAnswer" text NOT NULL,
	"userAnswer" text NOT NULL,
	"rating" varchar NOT NULL,
	"feedback" text NOT NULL,
	"createdAt" varchar NOT NULL,
	"createdBy" varchar NOT NULL
);
