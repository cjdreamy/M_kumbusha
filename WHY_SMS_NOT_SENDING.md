# Why SMS is Not Sending - Quick Answer

## The Problem
When you click "Send Now" on a reminder schedule, the SMS is not being sent.

## The Reason
**Africa's Talking API credentials are not configured yet.**

The system needs these credentials to send SMS and voice calls through Africa's Talking service.

---

## The Solution (5 Minutes)

### Step 1: Sign Up for Africa's Talking
- Go to: https://africastalking.com/
- Click "Sign Up" (it's FREE for testing)
- Create your account
- You'll get access to the **Sandbox** (free testing environment)

### Step 2: Get Your Credentials
1. Log in to Africa's Talking dashboard
2. Go to **Settings** → **API Key**
3. Copy these two things:
   - **API Key**: Looks like `atsk_1234567890abcdef...`
   - **Username**: For sandbox, it's `sandbox`

### Step 3: Enter Credentials
You should see a prompt asking for these credentials. Enter:
- **AFRICASTALKING_API_KEY**: Paste your API key
- **AFRICASTALKING_USERNAME**: Enter `sandbox` (for testing)

### Step 4: Register Test Phone Numbers (Sandbox Only)
1. In Africa's Talking dashboard
2. Go to **Sandbox** → **Voice & SMS**
3. Click **Add Phone Number**
4. Enter phone number: `+254712345678` (your test number)
5. Verify with OTP

### Step 5: Test It
1. In AmaniCare, go to **Elderly** page
2. Add an elderly person with the phone number you registered
3. Go to **Schedules** page
4. Create a schedule with SMS channel
5. Click **Send Now**
6. Check **Reminder Logs** - status should be "sent" ✅

---

## Important Notes

### Phone Number Format
Always use international format:
- ✅ Correct: `+254712345678`
- ❌ Wrong: `0712345678`
- ❌ Wrong: `+254 712 345 678`

### Sandbox Limitations
- Free to use
- Must register phone numbers first
- Messages have "AT-Sandbox:" prefix
- Perfect for testing

### Moving to Production
When ready for real use:
1. Buy SMS credits in Africa's Talking
2. Update username from `sandbox` to your production username
3. Update API key to production key
4. No need to register phone numbers anymore

---

## Still Not Working?

### Check This:
1. ✅ Credentials entered in Supabase secrets
2. ✅ Phone number registered in Africa's Talking sandbox
3. ✅ Phone number in correct format: `+254712345678`
4. ✅ Clicked "Send Now" and confirmed
5. ✅ Checked Reminder Logs for error message

### Get Help:
- See **TROUBLESHOOTING.md** for detailed solutions
- See **SMS_SETUP_GUIDE.md** for step-by-step instructions
- Check Supabase Edge Function logs for errors
- Check Africa's Talking SMS logs for delivery status

---

## Quick Links

- **Sign up**: https://africastalking.com/
- **Documentation**: https://developers.africastalking.com/
- **Support**: support@africastalking.com

---

## Summary

**SMS is not sending because Africa's Talking API credentials are missing.**

**To fix:**
1. Sign up at africastalking.com (free)
2. Get API Key and Username
3. Enter in Supabase secrets configuration
4. Register test phone numbers (sandbox only)
5. Test with "Send Now" button

**That's it! Once configured, SMS will work automatically. 🎉**
