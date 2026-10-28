"use client";

import * as React from "react";
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  Lock,
  Trash2,
  Edit3,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ResumeCenterPage() {
  const [isUploading, setIsUploading] = React.useState(false);

  const sampleExtractedData = {
    fileName: "resume_john_doe_2026.pdf",
    fileSize: "245 KB",
    uploadedAt: "Oct 27, 2026, 14:20 UTC",
    headline: "Junior Full-Stack Developer",
    approxExperienceYears: "1.5 years",
    skills: [
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "Tailwind CSS",
      "REST APIs",
      "Git",
    ],
    education: "B.S. in Computer Science (Expected 2026)",
    locations: "Remote, United States, Europe",
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--foreground)]">
          Resume Center & Profile Extractor
        </h1>
        <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
          Upload your resume (PDF/DOCX) to automatically seed your matching preferences with transparent review
        </p>
      </div>

      {/* Privacy Pledge Banner (Mandatory PRD Principle) */}
      <div className="p-4 rounded-xl border border-teal-500/20 bg-teal-500/5 text-xs text-teal-800 dark:text-teal-300 flex items-start gap-3">
        <Lock className="w-5 h-5 shrink-0 text-[var(--accent)] mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-sm">Privacy by Design Guarantee</p>
          <p className="leading-relaxed opacity-90">
            Your resume is stored in private, unguessable storage. It is never made public, never used for training models without consent, and never indexed by third parties. You can permanently delete your resume and extracted data anytime.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Box */}
        <div className="space-y-4">
          <Card className="border-dashed border-2 hover:border-[var(--primary)]/60 transition-all text-center p-6 bg-[var(--card)]">
            <CardContent className="space-y-4 p-0">
              <div className="mx-auto w-12 h-12 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-[var(--foreground)]">
                  Upload Latest Resume
                </h4>
                <p className="text-xs text-[var(--muted-foreground)]">
                  PDF or DOCX up to 5 MB
                </p>
              </div>

              <div className="pt-2">
                <Button variant="default" size="sm" className="w-full">
                  Select Document
                </Button>
              </div>

              <p className="text-[10px] text-[var(--muted-foreground)]">
                Scanned images or password-protected files are not supported in MVP.
              </p>
            </CardContent>
          </Card>

          {/* Current Stored File Card */}
          <Card className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-[var(--secondary)] text-[var(--foreground)]">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[var(--foreground)] truncate max-w-[160px]">
                    {sampleExtractedData.fileName}
                  </p>
                  <p className="text-[10px] text-[var(--muted-foreground)]">
                    {sampleExtractedData.fileSize} • {sampleExtractedData.uploadedAt}
                  </p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 h-8 w-8"
                title="Delete stored file"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Extracted Profile Review Screen (Principle: Human in the loop) */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-[var(--border)]">
              <div>
                <CardTitle className="text-base font-bold">
                  Verified Extracted Profile
                </CardTitle>
                <CardDescription className="text-xs">
                  Review extracted fields before they affect matching algorithms
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <Edit3 className="w-3.5 h-3.5" />
                Edit Profile
              </Button>
            </CardHeader>

            <CardContent className="space-y-5 pt-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-[var(--muted-foreground)] uppercase">
                    Headline / Target Role
                  </label>
                  <p className="mt-1 font-medium text-sm text-[var(--foreground)]">
                    {sampleExtractedData.headline}
                  </p>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[var(--muted-foreground)] uppercase">
                    Approximate Experience
                  </label>
                  <p className="mt-1 font-medium text-sm text-[var(--foreground)]">
                    {sampleExtractedData.approxExperienceYears}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[var(--muted-foreground)] uppercase">
                  Education
                </label>
                <p className="mt-1 font-medium text-sm text-[var(--foreground)]">
                  {sampleExtractedData.education}
                </p>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[var(--muted-foreground)] uppercase block mb-2">
                  Extracted & Confirmed Skills
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {sampleExtractedData.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="px-2.5 py-1 text-xs bg-[var(--secondary)] text-[var(--foreground)]"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400 mr-1" />
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[var(--muted-foreground)] uppercase">
                  Eligible Locations & Remote Preferences
                </label>
                <p className="mt-1 font-medium text-sm text-[var(--foreground)]">
                  {sampleExtractedData.locations}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
