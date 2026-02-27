import { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { updateProfile } from '@/db/api';
import { toast } from 'sonner';
import type { RelationshipType } from '@/types/database';
import { User, Save } from 'lucide-react';

export default function ProfilePage() {
  const { profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    phone_number: profile?.phone_number || '',
    backup_contact: profile?.backup_contact || '',
    relationship: (profile?.relationship || '') as string,
    employment_status: profile?.employment_status || '',
    emergency_contact: profile?.emergency_contact || '',
    notification_forwarding_number: profile?.notification_forwarding_number || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.id) return;

    setLoading(true);
    try {
      await updateProfile(String(profile.id), {
        full_name: formData.full_name,
        phone_number: formData.phone_number || '',
        backup_contact: formData.backup_contact || '',
        relationship: (formData.relationship || '') as RelationshipType,
        employment_status: formData.employment_status || '',
        emergency_contact: formData.emergency_contact || '',
        notification_forwarding_number: formData.notification_forwarding_number || '',
      });

      await refreshProfile();
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
            <p className="text-muted-foreground mt-1">
              Manage your caregiver profile information
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your profile details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={String(profile?.username || '')}
                  disabled
                />
                <p className="text-xs text-muted-foreground">
                  Username cannot be changed
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                  id="phone_number"
                  type="tel"
                  placeholder="+254..."
                  value={String(formData.phone_number)}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="relationship">Relationship to Elderly</Label>
                <Select
                  value={String(formData.relationship)}
                  onValueChange={(value) => setFormData({ ...formData, relationship: value })}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employed_caregiver">Employed Caregiver</SelectItem>
                    <SelectItem value="relative">Relative</SelectItem>
                    <SelectItem value="next_of_kin">Next of Kin</SelectItem>
                    <SelectItem value="family_member">Family Member</SelectItem>
                    <SelectItem value="friend">Friend</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="employment_status">Employment Status</Label>
                <Input
                  id="employment_status"
                  placeholder="e.g., Full-time caregiver"
                  value={String(formData.employment_status)}
                  onChange={(e) => setFormData({ ...formData, employment_status: e.target.value })}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="backup_contact">Backup Contact</Label>
                <Input
                  id="backup_contact"
                  type="tel"
                  placeholder="+254..."
                  value={String(formData.backup_contact)}
                  onChange={(e) => setFormData({ ...formData, backup_contact: e.target.value })}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergency_contact">Emergency Contact</Label>
                <Input
                  id="emergency_contact"
                  type="tel"
                  placeholder="+254..."
                  value={String(formData.emergency_contact)}
                  onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notification_forwarding_number">Notification Forwarding Number</Label>
                <Input
                  id="notification_forwarding_number"
                  type="tel"
                  placeholder="+254..."
                  value={String(formData.notification_forwarding_number)}
                  onChange={(e) => setFormData({ ...formData, notification_forwarding_number: e.target.value })}
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">
                  Receive escalation notifications at this number
                </p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={loading}>
                  <Save className="mr-2 h-4 w-4" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  );
}
