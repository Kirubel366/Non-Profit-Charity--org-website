import { useState, type ChangeEvent, type FormEvent } from "react";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import {
  HandHeart,
  Stethoscope,
  CalendarHeart,
  UploadCloud,
  FileText,
  Loader2,
  Check,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { submitVolunteerApplication } from "@/lib/public.functions";
import { uploadPrivateFile, FileUploadError } from "@/utils/fileUpload";
import { RESUMES_BUCKET } from "@/lib/storageBuckets";
import type { VolunteerData } from "@/types/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PhoneNumberInput, isValidPhone } from "@/components/reusable/PhoneNumberInput";
import { cn } from "@/lib/utils";
import { orgContent } from "@/data/orgContent";
import useSiteProfile from "@/hooks/useSiteProfile";

interface Props {
  data: VolunteerData;
}

interface VolunteerFormValues {
  fullName: string;
  email: string;
  phone: string;
  pillar: string;
  skills: string[];
  availability: string[];
  motivation: string;
  cvFile: File | null;
}

const pillarIcons = [HandHeart, Stethoscope, CalendarHeart];

const pillarBlurbs = [
  "Caregiving, meal distribution, elder and child care.",
  "Tech, medical, legal, photography and accounting pro-bono work.",
  "Blood donation drives, holiday campaigns and fundraiser logistics.",
];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function VolunteerPortal({ data }: Props) {
  const [pillar, setPillar] = useState(data.servicePillars[0]?.title ?? "");
  const [skills, setSkills] = useState<string[]>([]);
  const [availability, setAvailability] = useState<string[]>([]);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [motivation, setMotivation] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const { email: dbEmail } = useSiteProfile();

  const mutation = useMutation({
    mutationFn: async (values: VolunteerFormValues) => {
      // CV is optional — only upload if one was attached. If the upload
      // fails, stop here rather than submitting the application with a
      // missing/broken file reference.
      let cvPath: string | null = null;
      if (values.cvFile) {
        const upload = await uploadPrivateFile(values.cvFile, RESUMES_BUCKET, {
          allowHeicConversion: false,
        });
        cvPath = upload.path;
      }

      // Debug: log the upload path being sent to the server
      console.debug("Submitting volunteer application, cvPath:", cvPath);
      return submitVolunteerApplication({
        data: {
          full_name: values.fullName,
          email: values.email,
          phone: values.phone,
          pillar: values.pillar,
          skills: values.skills,
          availability: values.availability,
          motivation: values.motivation || null,
          cv_url: cvPath,
        },
      });
    },
    onSuccess: () => {
      toast.success("Application submitted — our volunteer desk will call you for an interview.");
      setFullName("");
      setEmail("");
      setPhone("");
      setMotivation("");
      setSkills([]);
      setAvailability([]);
      setCvFile(null);
    },
    onError: (error: unknown) => {
      if (error instanceof FileUploadError) {
        toast.error(error.message);
        return;
      }
      const fallbackEmail = dbEmail ?? orgContent.admin.supportEmail;
      const message =
        error instanceof Error
          ? error.message
          : `We couldn't submit right now. Please try again or email ${fallbackEmail}.`;
      toast.error(message);
    },
  });

  const toggle = (
    value: string,
    list: string[],
    setter: (next: string[]) => void,
  ) =>
    setter(
      list.includes(value) ? list.filter((v) => v !== value) : [...list, value],
    );

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Please attach a file under 5 MB.");
      return;
    }
    setCvFile(file);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const name = fullName.trim();
    const mail = email.trim();

    if (name.length < 2 || name.length > 100) {
      toast.error("Please enter your full name (2–100 characters).");
      return;
    }
    if (!emailPattern.test(mail) || mail.length > 255) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!isValidPhone(phone)) {
      toast.error("Please enter a valid phone number.");
      return;
    }
    if (!pillar) {
      toast.error("Please choose a service pillar.");
      return;
    }
    if (availability.length === 0) {
      toast.error("Please select at least one availability window.");
      return;
    }
    if (skills.length === 0) {
      toast.error("Please select at least one skill you can offer.");
      return;
    }
    if (motivation.trim().length === 0) {
      toast.error("Please provide a short motivation message.");
      return;
    }
    if (!cvFile) {
      toast.error("Please attach your CV or resume (PDF/DOCX). ");
      return;
    }

    mutation.mutate({
      fullName: name,
      email: mail,
      phone: phone.trim().slice(0, 40),
      pillar,
      skills,
      availability,
      motivation: motivation.trim().slice(0, 1000),
      cvFile,
    });
  };

  return (
    <section id="volunteer" className="bg-surface-muted py-20 sm:py-28">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-badge bg-impact/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-impact">
            <HandHeart className="size-3.5" aria-hidden />
            Volunteer portal
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            {data.sectionTitle}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            {data.sectionSubtitle}
          </p>
        </div>

        {/* Pillar selector */}
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {data.servicePillars.map((item, index) => {
            const Icon = pillarIcons[index] ?? HandHeart;
            const active = pillar === item.title;
            return (
              <motion.button
                key={item.id}
                type="button"
                onClick={() => setPillar(item.title)}
                aria-pressed={active}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "rounded-card border p-5 text-left transition-all",
                  active
                    ? "border-brand bg-card shadow-elevation ring-2 ring-brand/25"
                    : "border-border bg-card/70 hover:border-brand/40 hover:shadow-glass",
                )}
              >
                <span
                  className={cn(
                    "flex size-10 items-center justify-center rounded-xl transition-colors",
                    active ? "bg-brand text-brand-foreground" : "bg-brand-muted text-brand",
                  )}
                >
                  <Icon className="size-5" aria-hidden />
                </span>
                <p className="mt-4 text-base font-semibold">{item.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {pillarBlurbs[index] ?? item.description}
                </p>
              </motion.button>
            );
          })}
        </div>

        {/* Application form */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-card border border-border bg-card p-6 shadow-glass sm:p-8"
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="vol-name">Full name *</Label>
              <Input
                id="vol-name"
                value={fullName}
                maxLength={100}
                required
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Dawit Alemu"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="vol-email">Email *</Label>
              <Input
                id="vol-email"
                type="email"
                value={email}
                maxLength={255}
                required
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="vol-phone">Phone number *</Label>
              <PhoneNumberInput
                id="vol-phone"
                value={phone}
                onChange={setPhone}
                required
              />
            </div>
          </div>

          <fieldset className="mt-6">
            <legend className="text-sm font-semibold">Availability *</legend>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {data.availabilityOptions.map((option) => {
                const active = availability.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggle(option, availability, setAvailability)}
                    aria-pressed={active}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-badge border px-3 py-1.5 text-sm transition-colors",
                      active
                        ? "border-impact bg-impact text-impact-foreground"
                        : "border-border bg-background hover:border-impact/50",
                    )}
                  >
                    {active ? <Check className="size-3.5" aria-hidden /> : null}
                    {option}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="mt-6">
            <legend className="text-sm font-semibold">Skills you can offer</legend>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {data.skillOptions.map((option) => {
                const active = skills.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggle(option, skills, setSkills)}
                    aria-pressed={active}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-badge border px-3 py-1.5 text-sm transition-colors",
                      active
                        ? "border-brand bg-brand text-brand-foreground"
                        : "border-border bg-background hover:border-brand/50",
                    )}
                  >
                    {active ? <Check className="size-3.5" aria-hidden /> : null}
                    {option}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="vol-motivation">Why do you want to volunteer?</Label>
              <Textarea
                id="vol-motivation"
                value={motivation}
                maxLength={1000}
                rows={5}
                onChange={(e) => setMotivation(e.target.value)}
                placeholder="Tell us briefly about your experience and motivation…"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="vol-cv">CV / Resume (PDF or DOCX, max 5 MB)</Label>
              {cvFile ? (
                <div className="flex items-center justify-between gap-3 rounded-card border border-impact/40 bg-impact/10 p-4">
                  <span className="flex min-w-0 items-center gap-2 text-sm">
                    <FileText className="size-4 shrink-0 text-impact" aria-hidden />
                    <span className="truncate">{cvFile.name}</span>
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Remove attached CV"
                    onClick={() => setCvFile(null)}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              ) : (
                <label
                  htmlFor="vol-cv"
                  className="flex h-[8.6rem] cursor-pointer flex-col items-center justify-center gap-2 rounded-card border border-dashed border-border bg-surface-muted text-center transition-colors hover:border-brand hover:bg-brand-muted/40"
                >
                  <UploadCloud className="size-6 text-brand" aria-hidden />
                  <span className="text-sm font-medium">Click to attach your CV</span>
                  <span className="text-xs text-muted-foreground">
                    Stored with your application record
                  </span>
                </label>
              )}
              <input
                id="vol-cv"
                type="file"
                accept=".pdf,.doc,.docx"
                className="sr-only"
                onChange={handleFile}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              Selected pillar: <strong className="text-foreground">{pillar || "None"}</strong>
              {" · "}Every applicant is personally interviewed and safeguarding-screened.
            </p>
            <Button type="submit" size="lg" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
                  {cvFile ? "Uploading & submitting…" : "Submitting…"}
                </>
              ) : (
                "Submit application"
              )}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default VolunteerPortal;
