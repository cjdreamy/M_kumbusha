## Inspiration
**Vulnerable Demographic**
-Kenya’s elderly face chronic health risks and accessibility barriers to standard apps, while urban relatives suffer from anxiety due to a lack of visibility
**Health Risks**
- Kenya's elderly population has surpassed 3 million, with the vast majority residing in rural areas far from specialized care.
**Accessibility Barriers**
- Chronic illnesses like diabetes require strict adherence. Memory decline frequently compromises daily medication routines
**Caregiver Anxiety**
- Standard apps require smartphone literacy, data, and English proficiency, alienating the rural senior population
- Urban relatives lack reliable, daily visibility into the health routines of their loved ones, leading to constant worry.


## What it does
**Easy onboarding**
- both the elderly with disability like dimentia... , under a care-giver , thier routine(medication, wellbieng...) and plan of activities(doctor appoitments, massage, short exercise...) to have a profile and schedule appropiate reminders and manage by their next-of-kin
**Automated Reminders**
- Schedule-based alerts sent directly to feature phones or smartphones. No internet required for the recipient.
**Localized Delivery**
- Voice calls in Swahili, Kikuyu, Luo, and other vernaculars, removing language barriers for rural seniors.
**Dual-Alert Safety Net**
- If the user is unresponsive, an automated alert is instantly routed to a designated local neighbor or caregiver.
**Remote Management**
- Intuitive web dashboard for urban relatives to schedule appointments, monitor logs, and manage subscriptions.


## How we built it
webapp & USSD(without smartphone , internet) - for onmbording the care giver
We built our MVP in short time focusing on speed-to-market. We used a Nodejs backend to handle API calls for our core AI feature, and Vite for a responsive frontend. We focused heavily on user-centric design, testing with a number of early adopters to validate the workflow before scaling. The system is designed with a modular architecture, meaning we can add new features without reconfiguring the entire platform, ensuring it scales comfortably as we grow

## Challenges we ran into
- techinacalities Trying to get a free tire to send sms to mobile phone,  since its a prototyped we used the Africa's Talking in a sandbox environment
- some elderly were beyond it and the human aspect really needed to be there

## Accomplishments that we're proud of
**Voice-First Delivery**
- Friendly automated calls bridge the literacy gap for rural seniors.
**Vernacular Integration**
- Swahili and regional languages (Kikuyu, Luo) for cultural trust.
**Hardware Agnostic**
- Works on basic 'kabambe' feature phones through USSD. No data plan needed.
**Dual-Caregiver Loop**
- tomated neighbor alerts create a reliable local safety net.

## What we learned
- you can not solve problems of everyone, but you can for some, which we exaclty solving not all Elderly people but a majority 
- "Thereis nothing new under the sun", Accesibility in phones already exists, social media and telecomunications exists, ours is automation and bridging the language barrier,  building for local the later scale

## What's next for M_kumbusha
**Social Return**
- Directly improving the quality of life and healthcare access for rural elderly citizens.
**Scalability**
- A proven pilot model ready for expansion across other rural regions in East Africa.
**Partnership**
- Join us in creating a sustainable, tech-driven ecosystem for community-based care.
**NLP (natural language processing) for maximum inclusion**
- More datasets integration with LLMs on local langauages,  vernacular, (maasai, kikuyu, kikamba ...)