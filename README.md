# LuxVenue
A hotel reservation management system for special events 

# What this app actually does
A hotel has event spaces — ballrooms, conference halls, garden venues, rooftop terraces. People want to book those spaces for special events like weddings, corporate dinners, birthday galas, and conferences. Right now most hotels handle this over phone calls, WhatsApp messages, and emailed PDFs. This app replaces all of that with a proper digital system.

# The three core jobs of the app
  # Job 1 — Let people find and book a venue
Someone planning a wedding or a corporate event visits the app, browses available venues, sees photos and pricing, picks a date, builds their package (catering, AV, décor), gets an instant quote, signs a contract digitally, and pays a deposit. All without calling anyone.

  # Job 2 — Help them manage everything leading up to the event
After booking, the planner gets a private portal where they upload their guest list, track their payment schedule, communicate with the hotel coordinator, build their event timeline, manage dietary requirements, and monitor a checklist of everything that needs to happen before the day.

  # Job 3 — Help the hotel run the event smoothly
Hotel staff have their own side of the system — a dashboard showing all upcoming events, tools to approve contracts, manage multiple venues without double-booking, track outstanding payments, assign staff to events, and communicate with planners.



# Who uses it
  There are essentially four types of people in this system.
The event planner or organiser is the main customer. They could be a bride planning her wedding, an EA organising a company conference, or someone booking a 50th birthday party. They spend the most time in the app.
The hotel coordinator is the staff member assigned to manage bookings. They approve things, answer questions, handle changes, and make sure everything is in place before the event.
The hotel manager runs the business side — pricing, reports, staff, and overall operations.
The event guest is an attendee invited by the planner. They get a link to RSVP, submit dietary preferences, and on the day use a simple mobile page to check in and see the event schedule.

# What makes it different from a regular hotel booking

A regular hotel booking is simple — pick dates, pick a room, pay, done. A special event booking is completely different because:
Every booking is heavily customised. Two weddings on the same date in the same ballroom need completely different setups — different catering, different layouts, different timelines.
The process takes weeks or months. There's a long coordination period between signing the contract and the actual event day, with multiple people involved.
There are multiple payments. A deposit to confirm, a balance payment weeks out, and a final invoice after any extras on the day.
There are legal documents involved. A contract needs to be signed before anything is confirmed. Cancellation policies, force majeure clauses, and minimum spend commitments all need to be tracked.
There are third parties. Florists, photographers, AV companies, caterers — the hotel needs to coordinate with vendors that the planner brings in.

# What the finished app looks like in practice
A planner visits the site, searches for venues available on a Saturday in December for 150 guests. They find a ballroom, browse the photos, see it fits their budget, check the date is free, and click Book. They go through a 4-step checkout — event details, package selection, review quote, pay deposit. They sign the contract digitally. They now have access to their event portal.
Over the next three months they log back in to upload their guest list, mark off checklist items, message the coordinator when they have questions, and pay their balance when it's due. Two weeks before the event they finalise their run-of-show — a minute by minute schedule of the day.
On the day, hotel staff open the staff app and see exactly what needs to happen and when. Guests scan a QR code at the entrance to check in. The coordinator can push notifications to all guests — "dinner is served in the main hall."
After the event the planner receives their final invoice, gets asked for a review, and if it went well, gets a prompt to rebook for next year.

# Final Prototype is done!

✓ Authentication        signup, login, logout, sessions, middleware
✓ Venue browsing        listing, filtering, detail pages
✓ Booking flow          4 step multi-form, packages, quote, confirmation
✓ Event dashboard       overview, checklist, guests, payments, messages, run of show, reviews
✓ Real-time messages    planner to coordinator chat with Supabase Realtime
✓ Stripe payments       checkout, webhooks, receipt emails
✓ Staff dashboard       all events, status management, coordinator tools
✓ Staff invite system   token based invite, admin API account creation
✓ Email notifications   booking confirmation, payment receipt, RSVP invites
✓ Guest RSVP page       public token-based page, dietary preferences
✓ Vendor management     assign vendors to events, status tracking
✓ Reviews               star rating, comments, anonymous option

<img width="1917" height="988" alt="image" src="https://github.com/user-attachments/assets/7982eff2-7fc4-4ef9-bbad-22259da1fec0" />
<img width="1918" height="898" alt="image" src="https://github.com/user-attachments/assets/16696284-a2c7-426e-9261-1235405c6f79" />
<img width="1918" height="987" alt="image" src="https://github.com/user-attachments/assets/da3fae42-d3c9-4c21-954d-4e9f261b741c" />
<img width="1918" height="990" alt="image" src="https://github.com/user-attachments/assets/63a1caa9-6619-4335-a4bc-8c83c428d6d7" />

    


