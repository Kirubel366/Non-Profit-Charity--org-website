import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { Mail, MapPin, Phone, Clock, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { submitContactMessage } from "@/lib/public.functions";
import useSiteProfile from "@/hooks/useSiteProfile";
import type { ContactData } from "@/types/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  data: ContactData;
}

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const emptyForm: FormState = {
  fullName: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactSection({ data }: Props) {
  const [form, setForm] = useState<FormState>(emptyForm);

  const { phones: dbPhones, email: dbEmail } = useSiteProfile();

  const mergedData: ContactData = {
    ...data,
    email: dbEmail ?? data.email,
    phones: dbPhones && dbPhones.length > 0 ? dbPhones : data.phones ?? [],
  };

  const mutation = useMutation({
    mutationFn: submitContactMessage,
    onSuccess: () => {
      toast.success("Message received — our team replies within 2 working days.");
      setForm(emptyForm);
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : "We couldn't send your message. Please try again or call the office line.";
      toast.error(message);
    },
  });

  const update = (key: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const fullName = form.fullName.trim();
    const email = form.email.trim();
    const message = form.message.trim();

    if (fullName.length < 2 || fullName.length > 100) {
      toast.error("Please enter your full name (2–100 characters).");
      return;
    }
    if (!emailPattern.test(email) || email.length > 255) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (message.length < 10 || message.length > 1000) {
      toast.error("Your message should be between 10 and 1000 characters.");
      return;
    }

    mutation.mutate({
      data: {
        full_name: fullName,
        email,
        phone: form.phone.trim().slice(0, 40) || null,
        subject: form.subject.trim().slice(0, 150) || null,
        message,
      },
    });
  };

  return (
    <section id="contact" className="bg-background py-20 sm:py-28">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-badge bg-brand-muted px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand">
            <Mail className="size-3.5" aria-hidden />
            Contact hub
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            {mergedData.sectionTitle}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            Visit the headquarters, call the duty line, or send a message — every
            inquiry is logged and answered by a named staff member.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-5">
          {/* Details + map */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-2 space-y-4"
          >
            <ul className="space-y-4 rounded-card border border-border bg-card p-6 shadow-glass">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
                <div>
                  <p className="text-sm font-semibold">Headquarters</p>
                  <p className="text-sm text-muted-foreground">{mergedData.address}</p>
                </div>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
                <div>
                  <p className="text-sm font-semibold">Phone</p>
                  {mergedData.phones.map((phone) => (
                    <a
                      key={phone}
                      href={`tel:${phone.replace(/\s/g, "")}`}
                      className="block text-sm text-muted-foreground transition-colors hover:text-brand"
                    >
                      {phone}
                    </a>
                  ))}
                </div>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
                <div>
                  <p className="text-sm font-semibold">Email</p>
                  <a
                    href={`mailto:${mergedData.email}`}
                    className="text-sm text-muted-foreground transition-colors hover:text-brand"
                  >
                    {mergedData.email}
                  </a>
                </div>
              </li>
              {mergedData.officeHours ? (
                <li className="flex gap-3">
                  <Clock className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
                  <div>
                    <p className="text-sm font-semibold">Office hours</p>
                    <p className="text-sm text-muted-foreground">{mergedData.officeHours}</p>
                  </div>
                </li>
              ) : null}
            </ul>

            <div className="overflow-hidden rounded-card border border-border shadow-glass">
              <iframe
                title="Link4Good headquarters location map"
                src={mergedData.mapEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-64 w-full border-0"
              />
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: 0.1 }}
            onSubmit={handleSubmit}
            className="lg:col-span-3 rounded-card border border-border bg-card p-6 shadow-glass sm:p-8"
          >
            <h3 className="text-lg font-semibold">Send a direct message</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              For partnerships, media requests, safeguarding concerns or general questions.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="contact-name">Full name *</Label>
                <Input
                  id="contact-name"
                  value={form.fullName}
                  maxLength={100}
                  required
                  onChange={(e) => update("fullName", e.target.value)}
                  placeholder="Hanna Tesfaye"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="contact-email">Email *</Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={form.email}
                  maxLength={255}
                  required
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="contact-phone">Phone</Label>
                <Input
                  id="contact-phone"
                  value={form.phone}
                  maxLength={40}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="+251 ..."
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="contact-subject">Subject</Label>
                <Input
                  id="contact-subject"
                  value={form.subject}
                  maxLength={150}
                  onChange={(e) => update("subject", e.target.value)}
                  placeholder="Partnership inquiry"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="contact-message">Message *</Label>
                <Textarea
                  id="contact-message"
                  value={form.message}
                  maxLength={1000}
                  required
                  rows={5}
                  onChange={(e) => update("message", e.target.value)}
                  placeholder="Tell us how we can help…"
                />
                <p className="text-right text-xs text-muted-foreground">
                  {form.message.length}/1000
                </p>
              </div>
            </div>

            <Button type="submit" size="lg" className="mt-6 w-full sm:w-auto" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" aria-hidden /> Sending…
                </>
              ) : (
                <>
                  <Send className="mr-2 size-4" aria-hidden /> Send message
                </>
              )}
            </Button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
