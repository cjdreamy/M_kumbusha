import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getReminderLogs } from '@/db/api';
import { supabase } from '@/db/supabase';
import type { ReminderLogWithDetails } from '@/types/database';
import { MessageSquare, Phone, CheckCircle2, XCircle, Clock, AlertCircle, ThumbsUp, ThumbsDown } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function ReminderLogsPage() {
  const [logs, setLogs] = useState<ReminderLogWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmingReminder, setConfirmingReminder] = useState<string | null>(null);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const data = await getReminderLogs(100);
      setLogs(data);
    } catch (error) {
      console.error('Failed to load logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReminder = async (reminderId: string, confirmed: boolean) => {
    setConfirmingReminder(reminderId);
    try {
      const { data, error } = await supabase.functions.invoke('confirm-reminder', {
        body: {
          reminderId: reminderId,
          confirmed: confirmed,
        },
      });

      if (error) {
        const errorMsg = await error?.context?.text();
        console.error('Confirm reminder error:', errorMsg || error?.message);
        toast.error('Failed to update reminder status');
      } else {
        toast.success(confirmed ? 'Reminder confirmed!' : 'Reminder marked as missed');
        if (data?.escalated) {
          toast.info('Alert sent to secondary contact');
        }
        // Reload logs to show updated status
        await loadLogs();
      }
    } catch (error) {
      console.error('Failed to confirm reminder:', error);
      toast.error('Failed to update reminder status');
    } finally {
      setConfirmingReminder(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
      case 'delivered':
        return <CheckCircle2 className="h-4 w-4 text-chart-4" />;
      case 'confirmed':
        return <CheckCircle2 className="h-4 w-4 text-primary" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'missed':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-muted-foreground" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
      case 'delivered':
        return 'bg-chart-4/10 text-chart-4';
      case 'confirmed':
        return 'bg-primary/10 text-primary';
      case 'failed':
      case 'missed':
        return 'bg-destructive/10 text-destructive';
      case 'pending':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getChannelIcon = (channel: string) => {
    return channel === 'voice' ? (
      <Phone className="h-4 w-4" />
    ) : (
      <MessageSquare className="h-4 w-4" />
    );
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reminder Logs</h1>
          <p className="text-muted-foreground mt-1">
            View history of all reminder attempts and their status
          </p>
        </div>

        {/* Logs List */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="py-4">
                  <Skeleton className="h-4 w-full mb-2 bg-muted" />
                  <Skeleton className="h-3 w-3/4 bg-muted" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : logs.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <MessageSquare className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No reminder logs yet</h3>
              <p className="text-sm text-muted-foreground text-center max-w-sm">
                Reminder logs will appear here once reminders are sent.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <Card key={log.id}>
                <CardContent className="py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={getStatusColor(log.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(log.status)}
                            {log.status}
                          </span>
                        </Badge>
                        <Badge variant="outline">
                          <span className="flex items-center gap-1">
                            {getChannelIcon(log.channel)}
                            {log.channel}
                          </span>
                        </Badge>
                        <span className="text-sm font-medium">
                          {log.elderly?.full_name}
                        </span>
                      </div>
                      
                      {log.message && (
                        <p className="text-sm text-muted-foreground">
                          {log.message}
                        </p>
                      )}
                      
                      {log.error_message && (
                        <p className="text-sm text-destructive">
                          Error: {log.error_message}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {log.sent_at && (
                          <span>
                            Sent: {format(new Date(log.sent_at), 'MMM d, yyyy HH:mm')}
                          </span>
                        )}
                        {log.delivered_at && (
                          <span>
                            Delivered: {format(new Date(log.delivered_at), 'MMM d, yyyy HH:mm')}
                          </span>
                        )}
                        {log.confirmed_at && (
                          <span>
                            Confirmed: {format(new Date(log.confirmed_at), 'MMM d, yyyy HH:mm')}
                          </span>
                        )}
                      </div>

                      {/* Confirmation Buttons */}
                      {log.reminder_id && (log.status === 'sent' || log.status === 'delivered' || log.status === 'pending') && (
                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleConfirmReminder(log.reminder_id, true)}
                            disabled={confirmingReminder === log.reminder_id}
                          >
                            <ThumbsUp className="mr-2 h-3 w-3" />
                            Confirm
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleConfirmReminder(log.reminder_id, false)}
                            disabled={confirmingReminder === log.reminder_id}
                          >
                            <ThumbsDown className="mr-2 h-3 w-3" />
                            Mark as Missed
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
