"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
  botcheck: string;
};

export default function ContactForm() {
  const t = useTranslations("contactUs.form");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    subject: "",
    message: "",
    botcheck: "",
  });

  const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

  const handleChange = (
    field: keyof FormState,
    value: string,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!accessKey) {
      toast.error(t("missingKey"));
      return;
    }

    if (form.botcheck) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: form.name,
          email: form.email,
          subject: form.subject,
          message: form.message,
          botcheck: form.botcheck,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result?.success) {
        throw new Error(result?.message || "Request failed");
      }

      toast.success(t("success"));
      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
        botcheck: "",
      });
    } catch (error) {
      console.error(error);
      toast.error(t("error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl">{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">{t("nameLabel")}</Label>
              <Input
                id="name"
                name="name"
                autoComplete="name"
                required
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder={t("namePlaceholder")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t("emailLabel")}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder={t("emailPlaceholder")}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">{t("subjectLabel")}</Label>
            <Input
              id="subject"
              name="subject"
              required
              value={form.subject}
              onChange={(e) => handleChange("subject", e.target.value)}
              placeholder={t("subjectPlaceholder")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">{t("messageLabel")}</Label>
            <Textarea
              id="message"
              name="message"
              required
              value={form.message}
              onChange={(e) => handleChange("message", e.target.value)}
              placeholder={t("messagePlaceholder")}
            />
          </div>
          <div className="hidden">
            <Label htmlFor="botcheck">{t("honeypot")}</Label>
            <input
              id="botcheck"
              name="botcheck"
              type="text"
              value={form.botcheck}
              onChange={(e) => handleChange("botcheck", e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>
          <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
            {isSubmitting ? t("submitting") : t("submit")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}



