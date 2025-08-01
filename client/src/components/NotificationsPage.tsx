import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Bell, Smartphone, Mail, Clock } from "lucide-react";

export default function NotificationsPage() {
  const [, setLocation] = useLocation();
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: false,
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    soundEnabled: true,
    vibration: true
  });

  const updateNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary px-4 pt-12 pb-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="text-white" onClick={() => setLocation('/home')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-white">Notifications</h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Order Notifications */}
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Order Updates</h3>
                <p className="text-sm text-muted-foreground">Get notified about your order status</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Order Status Updates</p>
                  <p className="text-sm text-muted-foreground">When your order is being prepared, ready, etc.</p>
                </div>
                <Switch 
                  checked={notifications.orderUpdates}
                  onCheckedChange={() => updateNotification('orderUpdates')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Promotional Notifications */}
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-warning" />
              </div>
              <div>
                <h3 className="font-semibold">Promotions & Offers</h3>
                <p className="text-sm text-muted-foreground">Special deals and discounts</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Special Offers</p>
                  <p className="text-sm text-muted-foreground">Get notified about new deals and discounts</p>
                </div>
                <Switch 
                  checked={notifications.promotions}
                  onCheckedChange={() => updateNotification('promotions')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Methods */}
        <Card className="shadow-card">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-4">Delivery Methods</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Smartphone className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-muted-foreground">Instant notifications on your device</p>
                  </div>
                </div>
                <Switch 
                  checked={notifications.pushNotifications}
                  onCheckedChange={() => updateNotification('pushNotifications')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive updates via email</p>
                  </div>
                </div>
                <Switch 
                  checked={notifications.emailNotifications}
                  onCheckedChange={() => updateNotification('emailNotifications')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Smartphone className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">SMS Notifications</p>
                    <p className="text-sm text-muted-foreground">Get text messages for important updates</p>
                  </div>
                </div>
                <Switch 
                  checked={notifications.smsNotifications}
                  onCheckedChange={() => updateNotification('smsNotifications')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* App Settings */}
        <Card className="shadow-card">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-4">App Settings</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Sound</p>
                  <p className="text-sm text-muted-foreground">Play sound for notifications</p>
                </div>
                <Switch 
                  checked={notifications.soundEnabled}
                  onCheckedChange={() => updateNotification('soundEnabled')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Vibration</p>
                  <p className="text-sm text-muted-foreground">Vibrate for notifications</p>
                </div>
                <Switch 
                  checked={notifications.vibration}
                  onCheckedChange={() => updateNotification('vibration')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Notification */}
        <Card className="shadow-card">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Test Notifications</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Send a test notification to make sure everything is working properly
            </p>
            <Button variant="outline" className="w-full">
              Send Test Notification
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}