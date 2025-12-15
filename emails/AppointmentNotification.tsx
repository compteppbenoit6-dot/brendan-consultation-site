// File: emails/AppointmentNotification.tsx

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
} from "@react-email/components";
import * as React from "react";

interface AppointmentNotificationProps {
  serviceName?: string;
  servicePrice?: number;
  appointmentDate?: string;
  clientName?: string;
  clientEmail?: string;
  clientNotes?: string;
}

// Sample data for easy previewing with `pnpm email`
const sampleProps: AppointmentNotificationProps = {
  serviceName: "Soul Session",
  servicePrice: 75,
  appointmentDate: "Friday, November 14, 2025 at 2:00 PM",
  clientName: "Benny Marechal",
  clientEmail: "benoitmarechaleee@gmail.com",
  clientNotes: "Looking forward to our session!",
};

export const AppointmentNotification = ({
  serviceName = sampleProps.serviceName,
  servicePrice = sampleProps.servicePrice,
  appointmentDate = sampleProps.appointmentDate,
  clientName = sampleProps.clientName,
  clientEmail = sampleProps.clientEmail,
  clientNotes = sampleProps.clientNotes,
}: AppointmentNotificationProps) => (
  <Html>
    <Head>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@900&family=Source+Sans+3:wght@400;600&display=swap" rel="stylesheet" />
    </Head>
    <Preview>New Spiritual Session Booking: {serviceName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={heading}>FIZ</Heading>
        </Section>
        <Section style={content}>
          <Heading as="h2" style={subheading}>
            New Spiritual Session
          </Heading>
          <Text style={paragraph}>You have a new appointment! Here are the details:</Text>
          
          <Section style={detailsContainer}>
            <Row style={row}>
              <Column style={label}>Service:</Column>
              <Column style={value}>{serviceName}</Column>
            </Row>
            <Row style={row}>
              <Column style={label}>Price:</Column>
              <Column style={value}>${servicePrice}</Column>
            </Row>
            <Row style={row}>
              <Column style={label}>Date & Time:</Column>
              <Column style={value}>{appointmentDate}</Column>
            </Row>
            <Hr style={hr} />
            <Row style={row}>
              <Column style={label}>Client:</Column>
              <Column style={value}>{clientName}</Column>
            </Row>
            <Row style={row}>
              <Column style={label}>Email:</Column>
              <Column style={value}>{clientEmail}</Column>
            </Row>
            {clientNotes && (
              <Row style={row}>
                <Column style={label} valign="top">Notes:</Column>
                <Column style={value}>{clientNotes}</Column>
              </Row>
            )}
          </Section>

          <Hr style={hr} />

          <Button style={button} href="https://www.fiz.guru/admin/appointments">
            View in Admin Panel
          </Button>
        </Section>
        <Section style={footer}>
          <Text style={footerText}>This is an automated notification from fiz.guru</Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default AppointmentNotification;

// --- STYLES ---

const main = {
  backgroundColor: "#f0fdf4", // Light emerald tint
  fontFamily: '"Source Sans 3", "Helvetica Neue", sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "0",
  width: "580px",
  maxWidth: "100%",
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
};

const header = {
  backgroundColor: "#059669", // Primary emerald
  padding: "24px",
  textAlign: "center" as const,
};

const heading = {
  fontFamily: "'Playfair Display', serif",
  color: "#ffffff",
  margin: 0,
  fontSize: "36px",
  fontWeight: 900,
  letterSpacing: "2px",
};

const content = {
  padding: "32px 40px",
};

const subheading = {
  fontFamily: "'Playfair Display', serif",
  fontSize: "24px",
  color: "#065f46", // Darker emerald
  margin: "0 0 16px",
};

const paragraph = {
  color: "#374151", // Dark gray
  fontSize: "16px",
  lineHeight: "26px",
};

const detailsContainer = {
  marginTop: "24px",
  borderTop: "1px solid #e5e7eb",
};

const row = {
  padding: "12px 0",
  borderBottom: "1px solid #e5e7eb",
};

const label = {
  color: "#475569", // Secondary gray
  fontSize: "16px",
  width: "120px",
};

const value = {
  color: "#374151",
  fontSize: "16px",
  fontWeight: "600",
  textAlign: "right" as const,
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "30px 0",
};

const button = {
  backgroundColor: "#10b981", // Accent emerald
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "100%",
  padding: "14px",
};

const footer = {
  padding: "20px",
  textAlign: "center" as const,
  fontSize: "12px",
  color: "#475569",
  backgroundColor: "#f1f5f9",
};

const footerText = {
  margin: 0,
};