"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { PostEventSurvey } from "@/features/experience/types";
import { useTranslations } from "next-intl";

export function PostEventSurveyCard({ survey }: { survey: PostEventSurvey }) {
  const t = useTranslations("experience");

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base">{survey.title}</CardTitle>
          <Badge variant="default">
            {t("postEvent.responses", { count: survey.totalResponses })}
          </Badge>
        </div>
        <p className="text-xs text-stone-500">
          {t("postEvent.avgSatisfaction", { value: survey.averageSatisfaction.toFixed(1) })}
        </p>
      </CardHeader>
      <CardContent className="space-y-2">
        {survey.questions.map((q) => (
          <div key={q.id} className="rounded-lg border border-stone-200 p-3 text-sm">
            <p className="font-medium text-stone-900">{q.question}</p>
            <div className="mt-1 flex items-center gap-2 text-xs text-stone-500">
              <Badge variant="secondary">{t(`postEvent.questionTypes.${q.type}`)}</Badge>
              {q.options && <span>{q.options.length} {t("postEvent.options")}</span>}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function PostEventSurveyForm() {
  const t = useTranslations("experience");
  const [questions, setQuestions] = useState<Array<{ question: string; type: string }>>([
    { question: "", type: "rating" },
  ]);

  const addQuestion = () => {
    setQuestions((prev) => [...prev, { question: "", type: "rating" }]);
  };

  const updateQuestion = (idx: number, field: "question" | "type", value: string) => {
    setQuestions((prev) => prev.map((q, i) => (i === idx ? { ...q, [field]: value } : q)));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("postEvent.createSurvey")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <Label>{t("postEvent.surveyTitle")}</Label>
          <Input placeholder={t("postEvent.surveyTitlePlaceholder")} />
        </div>

        {questions.map((q, idx) => (
          <div key={idx} className="grid grid-cols-1 gap-2 rounded-lg border border-stone-200 p-3 md:grid-cols-3">
            <div className="space-y-1 md:col-span-2">
              <Label>{t("postEvent.question")} {idx + 1}</Label>
              <Input
                value={q.question}
                onChange={(e) => updateQuestion(idx, "question", e.target.value)}
                placeholder={t("postEvent.questionPlaceholder")}
              />
            </div>
            <div className="space-y-1">
              <Label>{t("postEvent.questionType")}</Label>
              <select
                className="h-10 w-full rounded-lg border border-stone-200 px-3 text-sm"
                value={q.type}
                onChange={(e) => updateQuestion(idx, "type", e.target.value)}
              >
                <option value="rating">{t("postEvent.questionTypes.rating")}</option>
                <option value="text">{t("postEvent.questionTypes.text")}</option>
                <option value="multiple_choice">{t("postEvent.questionTypes.multiple_choice")}</option>
              </select>
            </div>
          </div>
        ))}

        <div className="flex justify-between">
          <Button variant="outline" size="sm" onClick={addQuestion}>
            {t("postEvent.addQuestion")}
          </Button>
          <Button>{t("postEvent.publishSurvey")}</Button>
        </div>
      </CardContent>
    </Card>
  );
}
