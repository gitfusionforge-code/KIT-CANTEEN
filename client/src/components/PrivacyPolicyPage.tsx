import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Shield, Eye, Database, Lock } from "lucide-react";

export default function PrivacyPolicyPage() {
  const navigate = useNavigate();

  const sections = [
    {
      icon: Database,
      title: "Information We Collect",
      content: [
        "Personal information you provide when creating an account (name, email, phone number, student ID)",
        "Order history and preferences to improve your experience",
        "Payment information (processed securely through encrypted channels)",
        "Device information and app usage data for analytics and improvements"
      ]
    },
    {
      icon: Eye,
      title: "How We Use Your Information",
      content: [
        "Process and fulfill your food orders",
        "Send order updates and notifications",
        "Improve our services and app functionality",
        "Provide customer support and resolve issues",
        "Analyze usage patterns to enhance user experience"
      ]
    },
    {
      icon: Shield,
      title: "Information Sharing",
      content: [
        "We DO NOT sell your personal information to third parties",
        "Order details are shared with canteen staff only to fulfill your orders",
        "Anonymous usage data may be used for app improvements",
        "Information may be shared if required by law or to protect our rights"
      ]
    },
    {
      icon: Lock,
      title: "Data Security",
      content: [
        "All data is encrypted in transit and at rest",
        "Payment information is processed through secure, PCI-compliant systems",
        "Regular security audits and updates to protect your information",
        "Access to your data is limited to authorized personnel only"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary px-4 pt-12 pb-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="text-white" onClick={() => navigate('/profile')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-white">Privacy Policy</h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Introduction */}
        <Card className="shadow-card">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">Your Privacy Matters</h2>
            <p className="text-muted-foreground leading-relaxed">
              At KIT-Canteen, we are committed to protecting your privacy and personal information. 
              This Privacy Policy explains how we collect, use, and safeguard your data when you use our application.
            </p>
            <div className="mt-4 p-3 bg-accent/50 rounded-lg">
              <p className="text-sm font-medium">Last Updated: January 2024</p>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Sections */}
        {sections.map((section, index) => (
          <Card key={index} className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <section.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">{section.title}</h3>
              </div>
              <ul className="space-y-2">
                {section.content.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}

        {/* Your Rights */}
        <Card className="shadow-card">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Your Rights</h3>
            <div className="space-y-4">
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium mb-1">Access Your Data</h4>
                <p className="text-sm text-muted-foreground">
                  You can request a copy of all personal data we have about you.
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium mb-1">Correct Information</h4>
                <p className="text-sm text-muted-foreground">
                  Update or correct any inaccurate personal information.
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium mb-1">Delete Your Account</h4>
                <p className="text-sm text-muted-foreground">
                  Request deletion of your account and associated data.
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium mb-1">Data Portability</h4>
                <p className="text-sm text-muted-foreground">
                  Export your data in a machine-readable format.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="shadow-card">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p className="text-muted-foreground mb-4">
              If you have any questions about this Privacy Policy or how we handle your data, please contact us:
            </p>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Email:</span> privacy@kit.edu</p>
              <p><span className="font-medium">Phone:</span> +91 80 1234 5678</p>
              <p><span className="font-medium">Address:</span> KIT College, Tiptur, Karnataka, India</p>
            </div>
          </CardContent>
        </Card>

        {/* Updates */}
        <Card className="shadow-card border-warning">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-warning mb-2">Policy Updates</h3>
            <p className="text-sm text-muted-foreground">
              We may update this Privacy Policy from time to time. We will notify you of any significant changes 
              through the app or via email. Your continued use of the app after such modifications will constitute 
              your acknowledgment of the modified Privacy Policy.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}