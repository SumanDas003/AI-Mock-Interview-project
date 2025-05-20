"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { chatSession } from "@/utils/GeminiAIModel";
import { MockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { db } from "@/utils/db";
import { Button } from "@/components/ui/button";
import { Ghost, LoaderCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState(null);
  const [jsonResponse, setJsonResponse] = useState([]);
  const { user } = useUser();
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log("Submitted values:", jobPosition, jobDesc, jobExperience);

    const InputPrompt = `You are an AI interview assistant.
Job Position: ${jobPosition}
Job Description: ${jobDesc}
Years of Experience: ${jobExperience}

Please generate ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} interview questions with concise answers (max 3-4 sentences each).
Respond ONLY with valid JSON (no markdown, no extra text).
Format example:
{
  "questions": ["Question 1", "Question 2"],
  "answers": ["Answer 1", "Answer 2"]
}`;

    try {
      const result = await chatSession.sendMessage(InputPrompt);
      const responseText = await result.response.text();

      console.log("Raw AI response:", responseText);

      let cleanedJson;
      const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);

      if (jsonMatch && jsonMatch[1]) {
        cleanedJson = jsonMatch[1].trim();
      } else {
        const jsonStart = responseText.indexOf("{");
        const jsonEnd = responseText.lastIndexOf("}");
        if (jsonStart !== -1 && jsonEnd !== -1) {
          cleanedJson = responseText.slice(jsonStart, jsonEnd + 1);
        } else {
          throw new Error("AI response did not contain recognizable JSON.");
        }
      }

      // Check if JSON looks complete (basic check)
      if (!cleanedJson.endsWith("}")) {
        throw new Error("AI response JSON appears incomplete or truncated.");
      }

      const parsedJson = JSON.parse(cleanedJson);
      console.log("Parsed JSON Response:", parsedJson);
      setJsonResponse(parsedJson);

      const resp = await db.insert(MockInterview).values({
        mockId: uuidv4(),
        jsonMockResp: JSON.stringify(parsedJson),
        jobPosition: jobPosition,
        jobDesc: jobDesc,
        jobExperience: jobExperience,
        createdBy: user.primaryEmailAddress.emailAddress,
        createdAt: moment().format("DD-MM-YYYY"),
      }).returning({ mockId: MockInterview.mockId });

      console.log("Inserted record ID:", resp);

      setQuestions(parsedJson);
      setOpenDialog(false);
      router.push(`/dashboard/interview/${resp[0].mockId}/start`);

    } catch (error) {
      console.error("Error fetching or parsing AI response:", error);
      alert("❌ There was an error generating or saving the interview. Please check the console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="text-lg text-center">+ Add New</h2>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Tell us more about your job interview
            </DialogTitle>
            <DialogDescription>
              <form onSubmit={onSubmit}>
                <div>
                  <h2>
                    Provide details about the job role, description, and experience level.
                  </h2>

                  <div className="mt-7 my-3">
                    <label>Job Role/Position</label>
                    <Input
                      placeholder="Ex. Full Stack Developer"
                      required
                      value={jobPosition}
                      onChange={(e) => setJobPosition(e.target.value)}
                    />
                  </div>

                  <div className="mt-7 my-3">
                    <label>Job Description</label>
                    <Textarea
                      placeholder="Ex. React, Angular, Node.js, MySQL, etc."
                      required
                      value={jobDesc}
                      onChange={(e) => setJobDesc(e.target.value)}
                    />
                  </div>

                  <div className="mt-7 my-3">
                    <label>Years of Experience</label>
                    <Input
                      placeholder="e.g. 5"
                      type="number"
                      max="50"
                      required
                      value={jobExperience}
                      onChange={(e) => setJobExperience(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-5 justify-end mt-5">
                  <Button
                    type="button"
                    variant={Ghost}
                    onClick={() => setOpenDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <LoaderCircle className="animate-spin" />
                        &nbsp;Generating from AI...
                      </>
                    ) : (
                      "Start Interview"
                    )}
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;
