// emails/PaymentReceipt.jsx
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

export default function PaymentReceiptEmail({
  plannerName,
  eventName,
  paymentType,
  amount,
  paidAt,
  eventUrl,
}) {
  return (
    <Html>
      <Head />
      <Preview>Payment received for {eventName}</Preview>
      <Body style={main}>
        <Container style={container}>

          <Section style={header}>
            <Heading style={logo}>LuxVenue</Heading>
          </Section>

          <Section style={content}>
            <Heading style={h1}>Payment received</Heading>
            <Text style={text}>
              Hi {plannerName}, we have received your payment. Here are the details.
            </Text>

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
                  <Text style={detailLabel}>Payment type</Text>
                  <Text style={detailValue} className="capitalize">{paymentType}</Text>
                </Column>
              </Row>
              <Hr style={divider} />
              <Row>
                <Column>
                  <Text style={detailLabel}>Amount paid</Text>
                  <Text style={{ ...detailValue, color: "#16a34a", fontSize: "18px" }}>
                    LKR {amount}
                  </Text>
                </Column>
              </Row>
              <Hr style={divider} />
              <Row>
                <Column>
                  <Text style={detailLabel}>Date</Text>
                  <Text style={detailValue}>{paidAt}</Text>
                </Column>
              </Row>
            </Section>

            <Text style={text}>
              You can view your full payment schedule and download invoices
              from your event dashboard.
            </Text>

            <Button style={button} href={eventUrl}>
              View payment details
            </Button>

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
const detailsBox = { backgroundColor: "#F7F9FB", borderRadius: "8px", padding: "16px 20px", margin: "0 0 24px" }
const detailLabel = { fontSize: "11px", fontWeight: "600", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 2px" }
const detailValue = { fontSize: "14px", fontWeight: "500", color: "#001B3C", margin: "0" }
const divider = { borderColor: "#e5e7eb", margin: "12px 0" }
const button = { backgroundColor: "#001B3C", color: "#ffffff", padding: "12px 24px", borderRadius: "8px", fontSize: "14px", fontWeight: "600", textDecoration: "none", display: "inline-block" }
const footer = { padding: "24px 32px", borderRadius: "0 0 12px 12px" }
const footerText = { fontSize: "12px", color: "#9ca3af", margin: "0 0 4px", textAlign: "center" }