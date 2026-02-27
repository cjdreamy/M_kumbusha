import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { createElderly } from '@/db/api';
import { toast } from 'sonner';
import { ArrowLeft, Plus, X } from 'lucide-react';

export default function AddElderlyPage() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    age: '',
    primary_contact: '',
    secondary_contact: '',
    notes: '',
  });
  const [medicalConditions, setMedicalConditions] = useState<string[]>([]);
  const [newCondition, setNewCondition] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.id) return;

    setLoading(true);
    try {
      await createElderly({
        caregiver_id: profile.id,
        full_name: formData.full_name,
        age: formData.age ? Number.parseInt(formData.age) : null,
        primary_contact: formData.primary_contact || '',
        secondary_contact: formData.secondary_contact || '',
        medical_conditions: medicalConditions.length > 0 ? medicalConditions : [],
        notes: formData.notes || '',
      });

      toast.success('Elderly person added successfully');
      navigate('/elderly');
    } catch (error) {
      console.error('Failed to create elderly:', error);
      toast.error('Failed to add elderly person');
    } finally {
      setLoading(false);
    }
  };

  const addCondition = () => {
    if (newCondition.trim() && !medicalConditions.includes(newCondition.trim())) {
      setMedicalConditions([...medicalConditions, newCondition.trim()]);
      setNewCondition('');
    }
  };

  const removeCondition = (condition: string) => {
    setMedicalConditions(medicalConditions.filter(c => c !== condition));
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/elderly')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Add Elderly Person</h1>
            <p className="text-muted-foreground mt-1">
              Add a new elderly person to manage their care
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Enter the details of the elderly person
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  min="0"
                  max="150"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="primary_contact">Primary Contact Number</Label>
                <Input
                  id="primary_contact"
                  type="tel"
                  placeholder="+254..."
                  value={formData.primary_contact}
                  onChange={(e) => setFormData({ ...formData, primary_contact: e.target.value })}
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">
                  Phone number for SMS and voice reminders
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondary_contact">Secondary Contact Number</Label>
                <Input
                  id="secondary_contact"
                  type="tel"
                  placeholder="+254..."
                  value={formData.secondary_contact}
                  onChange={(e) => setFormData({ ...formData, secondary_contact: e.target.value })}
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">
                  Backup contact for escalation
                </p>
              </div>

              <div className="space-y-2">
                <Label>Medical Conditions</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter a medical condition"
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCondition();
                      }
                    }}
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addCondition}
                    disabled={loading}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {medicalConditions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {medicalConditions.map((condition) => (
                      <Badge key={condition} variant="secondary" className="gap-1">
                        {condition}
                        <button
                          type="button"
                          onClick={() => removeCondition(condition)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional notes about care requirements..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                  disabled={loading}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Adding...' : 'Add Elderly Person'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/elderly')}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  );
}
