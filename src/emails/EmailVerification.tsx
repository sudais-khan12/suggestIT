import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface EmailVerificationProps {
  username: string;
  verificationCode: string;
}

export const EmailVerification = ({
  username,
  verificationCode,
}: EmailVerificationProps) => (
  <Html>
    <Head>
      <title>Verify Your suggestIT Account</title>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Head>
    <Preview>🚀 Verify your email to start using suggestIT!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={logo}>suggestIT</Heading>
        </Section>

        <Section style={content}>
          <Heading style={heading}>Email Verification</Heading>
          <Text style={paragraph}>
            Hey <strong>{username}</strong>, 👋 Welcome to{" "}
            <strong>suggestIT</strong>! To unlock all features, verify your
            email using the code below:
          </Text>

          <div style={codeContainer}>
            {verificationCode.split("").map((digit, index) => (
              <span key={index} style={codeDigit}>
                {digit}
              </span>
            ))}
          </div>

          <Text style={paragraph}>
            ⏳ This code expires in 15 minutes. If you didn’t request this,
            ignore this email.
          </Text>

          <Hr style={divider} />

          <Text style={supportText}>
            Need help? Contact{" "}
            <Link href="mailto:support@suggestIT.com" style={link}>
              support@suggestIT.com
            </Link>{" "}
            📩
          </Text>
        </Section>

        <Section style={footer}>
          <Text style={footerText}>
            🚀 suggestIT | Attock, Punjab, Pakistan ©{" "}
            {new Date().getFullYear()} suggestIT. All rights reserved.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

// 🎨 Simplified and Modern Styling
const main = {
  backgroundColor: "#f7f7f7",
  fontFamily:
    '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
  padding: "40px 0",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px",
  maxWidth: "600px",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
};

const header = {
  padding: "20px 0",
  textAlign: "center" as const,
};

const logo = {
  color: "#333",
  fontSize: "28px",
  fontWeight: "700",
  margin: "0",
};

const content = {
  padding: "20px 0",
};

const heading = {
  fontSize: "24px",
  color: "#333",
  margin: "0 0 20px 0",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "24px",
  color: "#555",
  margin: "0 0 20px 0",
};

const codeContainer = {
  display: "flex",
  justifyContent: "center",
  margin: "30px 0",
  gap: "10px",
};

const codeDigit = {
  backgroundColor: "#f0f0f0",
  color: "#333",
  borderRadius: "6px",
  fontSize: "24px",
  fontWeight: "bold",
  padding: "12px 18px",
  minWidth: "40px",
  textAlign: "center" as const,
  transition: "background-color 0.3s ease",
};

const divider = {
  borderColor: "#e0e0e0",
  margin: "30px 0",
};

const supportText = {
  ...paragraph,
  textAlign: "center" as const,
};

const link = {
  color: "#007BFF",
  textDecoration: "none",
  fontWeight: "bold",
};

const footer = {
  padding: "20px 0",
  backgroundColor: "#f7f7f7",
  textAlign: "center" as const,
  borderRadius: "0 0 8px 8px",
};

const footerText = {
  fontSize: "14px",
  color: "#777",
  lineHeight: "20px",
  margin: "0",
};

export default EmailVerification;
