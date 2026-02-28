import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Search,
  Book,
  MessageCircle,
  Mail,
  Phone,
  Video,
  FileText,
  ExternalLink,
  Send,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { faqService, FAQ } from "@/services/faqService";
import { useAuthStore } from "@/store/authStore";

const resources = [
  { title: "Getting Started Guide", icon: <Book className="h-5 w-5" />, link: "#" },
  { title: "Video Tutorials", icon: <Video className="h-5 w-5" />, link: "#" },
  { title: "API Documentation", icon: <FileText className="h-5 w-5" />, link: "#" },
  { title: "Best Practices", icon: <Book className="h-5 w-5" />, link: "#" },
];

export default function Help() {
  const { tokens } = useAuthStore();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadFaqs = async () => {
      try {
        const data = await faqService.getPublicFaqs();
        setFaqs(data);
      } catch {
        toast.error("Failed to load FAQs");
      } finally {
        setLoading(false);
      }
    };
    loadFaqs();
  }, []);

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Support ticket submitted successfully!");
  };

  return (
    <AdminLayout title="Help & Support" subtitle="Get help and contact support">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* FAQ */}
        <Card variant="elevated" className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Frequently Asked Questions</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search FAQs..." 
                  className="pl-9 w-64" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <Accordion type="single" collapsible className="w-full">
                {filteredFaqs.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
                {filteredFaqs.length === 0 && !loading && (
                  <p className="text-center py-8 text-muted-foreground">No FAQs found</p>
                )}
              </Accordion>
            )}
          </CardContent>
        </Card>

        {/* Contact & Resources */}
        <div className="space-y-6">
          {/* Quick Contact */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Quick Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <a
                href="mailto:support@surveypro.com"
                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="rounded-lg bg-primary/10 p-2">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Email Support</p>
                  <p className="text-sm text-muted-foreground">support@surveypro.com</p>
                </div>
              </a>
              <a
                href="tel:+1234567890"
                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="rounded-lg bg-accent/10 p-2">
                  <Phone className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="font-medium">Phone Support</p>
                  <p className="text-sm text-muted-foreground">+1 (234) 567-890</p>
                </div>
              </a>
              <button className="w-full flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="rounded-lg bg-success/10 p-2">
                  <MessageCircle className="h-5 w-5 text-success" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Live Chat</p>
                  <p className="text-sm text-muted-foreground">Available 24/7</p>
                </div>
              </button>
            </CardContent>
          </Card>

          {/* Resources */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {resources.map((resource) => (
                  <a
                    key={resource.title}
                    href={resource.link}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-muted-foreground">{resource.icon}</div>
                      <span className="font-medium">{resource.title}</span>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Support Ticket Form */}
      <Card variant="elevated" className="mt-6">
        <CardHeader>
          <CardTitle>Submit a Support Ticket</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="Brief description of your issue" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" placeholder="e.g., Technical, Billing" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Describe your issue in detail..."
                rows={5}
              />
            </div>
            <Button type="submit">
              <Send className="h-4 w-4 mr-2" />
              Submit Ticket
            </Button>
          </form>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
