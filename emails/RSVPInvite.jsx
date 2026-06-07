// emails/RSVPInvite.jsx
import {
  Body, Button, Container, Head,
  Heading, Html, Preview, Section, Text
} from "@react-email/components"

export default function RSVPInviteEmail({
  guestName,
  eventName,
  hostName,
  eventDate,
  venueName,
  rsvpUrl,
}) {
  return (
    <Html>
      <Head />
      <Preview>You are invited to {eventName}</Preview>
      <Body style={main}>
        <Container style={container}>

          <Section style={header}>
            <Heading style={logo}>LuxVenue</Heading>
          </Section>

          <Section style={content}>
            <Heading style={h1}>You are invited</Heading>
            <Text style={text}>
              Hi {guestName}, {hostName} has invited you to {eventName}.
            </Text>

            <Section style={detailsBox}>
              <Text style={detailLabel}>Event</Text>
              <Text style={detailValue}>{eventName}</Text>
              <Text style={detailLabel}>Date</Text>
              <Text style={detailValue}>{eventDate}</Text>
              <Text style={detailLabel}>Venue</Text>
              <Text style={detailValue}>{venueName}</Text>
            </Section>

            <Text style={text}>
              Please let us know if you will be attending by clicking the button below.
            </Text>

            <Button style={button} href={rsvpUrl}>
              RSVP now
            </Button>

            <Text style={smallText}>
              This link is personal to you. Please do not share it.
            </Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              LuxVenue · Architectural precision in every reservation.
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  )
}

const main = { backgroundColor: "#F7F9FB", fontFamily: "sans-serif" }
const container = { maxWidth: "560px", margin: "0 auto" }
const header = { backgroundColor: "#001B3C", padding: "24px 32px", borderRadius: "12px 12px 0 0" }
const logo = { color: "#ffffff", fontSize: "22px", fontWeight: "600", margin: "0" }
const content = { backgroundColor: "#ffffff", padding: "32px" }
const h1 = { fontSize: "24px", fontWeight: "600", color: "#001B3C", margin: "0 0 16px" }
const text = { fontSize: "15px", lineHeight: "1.6", color: "#6b7280", margin: "0 0 20px" }
const smallText = { fontSize: "12px", color: "#9ca3af", margin: "16px 0 0" }
const detailsBox = { backgroundColor: "#F7F9FB", borderRadius: "8px", padding: "16px 20px", margin: "0 0 24px" }
const detailLabel = { fontSize: "11px", fontWeight: "600", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 2px" }
const detailValue = { fontSize: "14px", fontWeight: "500", color: "#001B3C", margin: "0 0 12px" }
const button = { backgroundColor: "#001B3C", color: "#ffffff", padding: "12px 24px", borderRadius: "8px", fontSize: "14px", fontWeight: "600", textDecoration: "none", display: "inline-block" }
const footer = { padding: "24px 32px", borderRadius: "0 0 12px 12px" }
const footerText = { fontSize: "12px", color: "#9ca3af", margin: "0", textAlign: "center" }