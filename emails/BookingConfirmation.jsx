// emails/BookingConfirmation.jsx
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from "@react-email/components"

export default function BookingConfirmationEmail({
  plannerName,
  eventName,
  venueName,
  startDate,
  guestCount,
  depositAmount,
  eventUrl,
}) {
  return (
    <Html>
      <Head />
      <Preview>Your booking at {venueName} is confirmed</Preview>
      <Body style={main}>
        <Container style={container}>

          {/* header */}
          <Section style={header}>
            <Heading style={logo}>LuxVenue</Heading>
          </Section>

          {/* content */}
          <Section style={content}>
            <Heading style={h1}>Booking confirmed</Heading>
            <Text style={text}>
              Hi {plannerName}, your event has been received and is now under review.
              A coordinator will be in touch shortly to confirm the details.
            </Text>

            {/* event details box */}
            <Section style={detailsBox}>
              <Row>
                <Column>
                  <Text style={detailLabel}>Event</Text>
                  <Text style={detailValue}>{eventName}</Text>
                </Column>
              </Row>
              <Hr style={divider} />
              <Row>
                <Column>
                  <Text style={detailLabel}>Venue</Text>
                  <Text style={detailValue}>{venueName}</Text>
                </Column>
              </Row>
              <Hr style={divider} />
              <Row>
                <Column>
                  <Text style={detailLabel}>Date</Text>
                  <Text style={detailValue}>{startDate}</Text>
                </Column>
              </Row>
              <Hr style={divider} />
              <Row>
                <Column>
                  <Text style={detailLabel}>Guests</Text>
                  <Text style={detailValue}>{guestCount}</Text>
                </Column>
              </Row>
              <Hr style={divider} />
              <Row>
                <Column>
                  <Text style={detailLabel}>Deposit due</Text>
                  <Text style={detailValue}>LKR {depositAmount}</Text>
                </Column>
              </Row>
            </Section>

            <Text style={text}>
              Log in to your dashboard to view your full booking details,
              complete your guest list, and pay your deposit.
            </Text>

            <Button style={button} href={eventUrl}>
              View my booking
            </Button>

          </Section>

          {/* footer */}
          <Section style={footer}>
            <Text style={footerText}>
              LuxVenue · Architectural precision in every reservation.
            </Text>
            <Text style={footerText}>
              If you did not make this booking please contact us immediately.
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: "#F7F9FB",
  fontFamily: "sans-serif",
}

const container = {
  maxWidth: "560px",
  margin: "0 auto",
}

const header = {
  backgroundColor: "#001B3C",
  padding: "24px 32px",
  borderRadius: "12px 12px 0 0",
}

const logo = {
  color: "#ffffff",
  fontSize: "22px",
  fontWeight: "600",
  margin: "0",
}

const content = {
  backgroundColor: "#ffffff",
  padding: "32px",
}

const h1 = {
  fontSize: "24px",
  fontWeight: "600",
  color: "#001B3C",
  margin: "0 0 16px",
}

const text = {
  fontSize: "15px",
  lineHeight: "1.6",
  color: "#6b7280",
  margin: "0 0 20px",
}

const detailsBox = {
  backgroundColor: "#F7F9FB",
  borderRadius: "8px",
  padding: "16px 20px",
  margin: "0 0 24px",
}

const detailLabel = {
  fontSize: "11px",
  fontWeight: "600",
  color: "#9ca3af",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  margin: "0 0 2px",
}

const detailValue = {
  fontSize: "14px",
  fontWeight: "500",
  color: "#001B3C",
  margin: "0",
}

const divider = {
  borderColor: "#e5e7eb",
  margin: "12px 0",
}

const button = {
  backgroundColor: "#001B3C",
  color: "#ffffff",
  padding: "12px 24px",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: "600",
  textDecoration: "none",
  display: "inline-block",
}

const footer = {
  padding: "24px 32px",
  borderRadius: "0 0 12px 12px",
}

const footerText = {
  fontSize: "12px",
  color: "#9ca3af",
  margin: "0 0 4px",
  textAlign: "center",
}