# Welcome to Your Miaoda Project
Miaoda Application Link URL
    URL:https://medo.dev/projects/app-9x1ihajudzpd

# AmaniCare - Healthcare Reminder & Caregiver Support Platform

A comprehensive multi-channel healthcare reminder and caregiver support platform designed for elderly care in rural Africa. Supports both feature phone users (via SMS and voice calls) and smartphone users (via web dashboard).

---

## 🚀 Quick Start

### 1. First Time Setup

**Register an Account:**
1. Open the application
2. Click "Register"
3. Create a username and password
4. The first user automatically becomes an admin

**Configure SMS/Voice (Required):**
1. Sign up at [africastalking.com](https://africastalking.com/) (free sandbox available)
2. Get your API Key and Username from the dashboard
3. Enter credentials when prompted in the application
4. For sandbox: Register test phone numbers in Africa's Talking dashboard

📖 **Full setup guide:** [SMS_SETUP_GUIDE.md](./SMS_SETUP_GUIDE.md)

---

## 📱 Features

### For Caregivers:
- **Dashboard**: Overview of all elderly people, schedules, and reminder statistics
- **Elderly Management**: Add and manage elderly people with medical conditions and contacts
- **Reminder Scheduling**: Create automated reminders for medications, exercise, and appointments
- **Manual Sending**: Send reminders immediately with "Send Now" button
- **Confirmation Tracking**: Track if elderly completed tasks after reminders
- **Automatic Escalation**: Alerts secondary contacts when reminders are missed
- **Multi-Channel**: Send via SMS, voice calls, or both
- **Multi-Language**: Support for English and Kiswahili

### For Admins:
- **User Management**: View all users and manage roles
- **System Monitoring**: Track reminder success rates and system usage

---

## 📋 User Guide

### Adding an Elderly Person:
1. Go to **Elderly** page
2. Click **Add Elderly Person**
3. Fill in details:
   - Full name
   - Age
   - Primary contact (phone number in format: `+254712345678`)
   - Secondary contact (optional, for escalation)
   - Medical conditions
   - Medications
4. Click **Save**

### Creating a Reminder Schedule:
1. Go to **Schedules** page
2. Click **Create Schedule**
3. Configure:
   - Select elderly person
   - Set title and description
   - Choose type (medication, exercise, appointment, custom)
   - Set time (e.g., 09:00 AM)
   - Choose frequency (daily, weekly, custom)
   - Select channel (SMS, voice, or both)
   - Choose language (English or Kiswahili)
   - Enable "Active" to start sending
4. Click **Create Schedule**

### Sending a Reminder Immediately:
1. Go to **Schedules** page
2. Find the schedule you want to trigger
3. Click **Send Now** button
4. Confirm the action
5. Check **Reminder Logs** to verify it was sent

### Tracking Confirmations:
1. Go to **Reminder Logs** page
2. Find the reminder you want to track
3. Click **Confirm** if the elderly completed the task
4. Click **Mark as Missed** if they didn't
   - This automatically sends alerts to secondary contacts

---

## 🔧 Troubleshooting

### SMS Not Sending?

**Most common cause:** Africa's Talking API credentials not configured.

**Quick fix:**
1. Check if you see a yellow warning banner on the Schedules page
2. Follow the setup steps in the banner
3. See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for detailed help

### Other Issues:

- **"Invalid phone number"**: Use international format: `+254712345678`
- **"Failed to send reminder"**: Check API credentials in Supabase
- **SMS sent but not received**: 
  - For sandbox: Register phone number in Africa's Talking
  - Check phone has signal and SMS inbox isn't full
- **"Insufficient balance"**: Top up credits in Africa's Talking (production only)

📖 **Full troubleshooting guide:** [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

---

## 📚 Documentation

- **[REMINDER_GUIDE.md](./REMINDER_GUIDE.md)** - Complete guide to reminder system features
- **[SMS_SETUP_GUIDE.md](./SMS_SETUP_GUIDE.md)** - Step-by-step SMS/voice setup instructions
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Solutions to common issues

---

## 🌍 Supported Countries

Africa's Talking supports SMS and voice calls in:
- 🇰🇪 Kenya
- 🇺🇬 Uganda
- 🇹🇿 Tanzania
- 🇷🇼 Rwanda
- 🇳🇬 Nigeria
- 🇿🇦 South Africa
- And many more African countries

---

## 💰 Pricing

### Sandbox (Free):
- Free testing environment
- Must register phone numbers first
- Messages prefixed with "AT-Sandbox:"
- Perfect for development and testing

### Production (Paid):
- SMS: ~$0.01 - $0.02 per message
- Voice: ~$0.05 - $0.10 per minute
- Example: 10 elderly × 3 reminders/day × 30 days = ~$9-18/month

---

## 🔐 Security & Privacy

- **Role-based access**: Caregivers can only see their own elderly people
- **Secure authentication**: Username and password with encrypted storage
- **Data encryption**: All data encrypted in transit and at rest
- **Audit logs**: All reminders and actions are logged for accountability

---

## 🎯 Use Cases

### Medication Reminders:
- "Time to take your blood pressure medication"
- "Don't forget your diabetes medication"
- Scheduled at specific times daily

### Exercise Reminders:
- "Time for your 10-minute walk"
- "Remember to do your stretching exercises"
- Helps maintain physical health

### Appointment Reminders:
- "Doctor appointment tomorrow at 2 PM"
- "Time to check your blood pressure"
- Prevents missed appointments

### Custom Reminders:
- "Drink water"
- "Take your vitamins"
- "Call your family"

---

## 🛠️ Technical Stack

- **Frontend**: React + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **SMS/Voice**: Africa's Talking API
- **Authentication**: Supabase Auth
- **Hosting**: Supabase (backend) + Vercel/Netlify (frontend)

---

## 📞 Support

### Getting Help:
1. Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common issues
2. Review [SMS_SETUP_GUIDE.md](./SMS_SETUP_GUIDE.md) for setup help
3. Check Supabase Edge Function logs for errors
4. Check Africa's Talking SMS logs for delivery issues

### External Support:
- **Africa's Talking**: support@africastalking.com
- **Africa's Talking Docs**: https://developers.africastalking.com/
- **Supabase Docs**: https://supabase.com/docs

---

## 🎉 Getting Started Checklist

- [ ] Register an account (first user becomes admin)
- [ ] Sign up for Africa's Talking (free sandbox)
- [ ] Configure API credentials in Supabase
- [ ] For sandbox: Register test phone numbers
- [ ] Add your first elderly person
- [ ] Create a test reminder schedule
- [ ] Click "Send Now" to test
- [ ] Check Reminder Logs to verify delivery
- [ ] Test confirmation tracking
- [ ] Test escalation by marking a reminder as missed

---

## 📄 License

Copyright 2026 AmaniCare

---

## 🌟 About AmaniCare

AmaniCare ("Amani" means "peace" in Kiswahili) is designed to bring peace of mind to caregivers and families caring for elderly people in rural Africa. By leveraging both modern smartphone technology and basic feature phone capabilities (SMS/voice), we ensure that healthcare reminders reach everyone, regardless of their access to technology.

**Mission**: To improve elderly healthcare outcomes in rural Africa through accessible, multi-channel reminder systems.

---

**Ready to get started? Follow the Quick Start guide above! 🚀**
