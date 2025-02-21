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
          <Heading style={logo}>🔥 suggestIT</Heading>
        </Section>

        <Section style={content}>
          <Heading style={heading}>🔒 Email Verification</Heading>
          <Text style={paragraph}>
            Hey <strong>{username}</strong>, 👋 Welcome to{" "}
            <strong>suggestIT</strong>! To unlock all features, verify your
            email using the **code below**:
          </Text>

          <div style={codeContainer}>
            {verificationCode.split("").map((digit, index) => (
              <span key={index} style={codeDigit}>
                {digit}
              </span>
            ))}
          </div>

          <Text style={paragraph}>
            ⏳ **This code expires in 15 minutes.** If you didn’t request this,
            ignore this email.
          </Text>

          <Hr style={divider} />

          <Text style={supportText}>
            Need help? Contact{" "}
            <Link href="mailto:sudaiskh31@gmail.com" style={link}>
              support@suggestIT.com
            </Link>{" "}
            📩
          </Text>
        </Section>

        <Section style={footer}>
          <Text style={footerText}>
            🚀 **suggestIT** | Attock, Punjab, Pakistan ©{" "}
            {new Date().getFullYear()} suggestIT. All rights reserved.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

// 🎨 Vibrant Styling
const main = {
  backgroundColor: "#FFF4E0",
  fontFamily:
    '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
  padding: "30px 0",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "30px 0 50px",
  maxWidth: "650px",
  borderRadius: "12px",
  boxShadow: "0 5px 15px rgba(255, 87, 51, 0.2)",
};

const header = {
  padding: "40px",
  background: "linear-gradient(90deg, #FF5733, #FFB533)",
  textAlign: "center" as const,
  borderRadius: "12px 12px 0 0",
};

const logo = {
  color: "#ffffff",
  fontSize: "36px",
  fontWeight: "700",
  margin: "0",
};

const content = {
  padding: "40px",
};

const heading = {
  fontSize: "28px",
  color: "#222",
  margin: "0 0 20px 0",
};

const paragraph = {
  fontSize: "18px",
  lineHeight: "28px",
  color: "#444",
  margin: "0 0 20px 0",
};

const codeContainer = {
  display: "flex",
  justifyContent: "center",
  margin: "30px 0",
  gap: "12px",
};

const codeDigit = {
  background: "linear-gradient(90deg, #FF5733, #FFB533)",
  color: "#ffffff",
  borderRadius: "6px",
  fontSize: "28px",
  fontWeight: "bold",
  padding: "16px 22px",
  minWidth: "50px",
  textAlign: "center" as const,
  boxShadow: "0px 4px 10px rgba(255, 87, 51, 0.3)",
};

const divider = {
  borderColor: "#ddd",
  margin: "30px 0",
};

const supportText = {
  ...paragraph,
  textAlign: "center" as const,
};

const link = {
  color: "#FF5733",
  textDecoration: "none",
  fontWeight: "bold",
};

const footer = {
  padding: "20px 40px",
  backgroundColor: "#FFF4E0",
  textAlign: "center" as const,
  borderRadius: "0 0 12px 12px",
};

const footerText = {
  fontSize: "14px",
  color: "#777",
  lineHeight: "20px",
  margin: "0",
};

export default EmailVerification;