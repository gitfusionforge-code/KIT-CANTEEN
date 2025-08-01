import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Mail, Send, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SendEmailPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [emailData, setEmailData] = useState({
    subject: "",
    message: "",
    userGroup: "all"
  });

  const userGroups = [
    { value: "all", label: "All Users" },
    { value: "students", label: "Students Only" },
    { value: "faculty", label: "Faculty Only" },
    { value: "staff", label: "Staff Only" },
    { value: "active", label: "Active Users" },
    { value: "inactive", label: "Inactive Users" }
  ];

  const handleSendEmail = () => {
    toast({
      title: "Email Sent Successfully",
      description: `Email sent to ${emailData.userGroup} group`,
    });
    setLocation("/admin/user-management");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setLocation("/admin/user-management")}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Send Bulk Email</h1>
              <p className="text-sm text-muted-foreground">Send notifications to users</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="w-5 h-5" />
                <span>Email Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="userGroup">Select User Group</Label>
                <Select value={emailData.userGroup} onValueChange={(value) => setEmailData(prev => ({ ...prev, userGroup: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose user group" />
                  </SelectTrigger>
                  <SelectContent>
                    {userGroups.map((group) => (
                      <SelectItem key={group.value} value={group.value}>
                        {group.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="subject">Email Subject</Label>
                <Input
                  id="subject"
                  placeholder="Enter email subject"
                  value={emailData.subject}
                  onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="message">Email Message</Label>
                <Textarea
                  id="message"
                  placeholder="Enter your message here..."
                  className="min-h-32"
                  value={emailData.message}
                  onChange={(e) => setEmailData(prev => ({ ...prev, message: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Email Preview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 bg-muted/20">
                <div className="mb-4">
                  <strong>To:</strong> {userGroups.find(g => g.value === emailData.userGroup)?.label}
                </div>
                <div className="mb-4">
                  <strong>Subject:</strong> {emailData.subject || "No subject"}
                </div>
                <div>
                  <strong>Message:</strong>
                  <div className="mt-2 whitespace-pre-wrap">
                    {emailData.message || "No message content"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex space-x-4">
            <Button variant="outline" onClick={() => navigate("/admin/user-management")}>
              Cancel
            </Button>
            <Button 
              variant="default" 
              onClick={handleSendEmail}
              disabled={!emailData.subject || !emailData.message}
              className="flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Send Email</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}