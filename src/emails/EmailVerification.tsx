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
    <Preview>Verify your email to start using suggestIT</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={logo}>suggestIT</Heading>
        </Section>

        <Section style={content}>
          <Heading style={heading}>Email Verification</Heading>
          <Text style={paragraph}>
            Hi {username},
            <br />
            Thank you for creating an account with suggestIT. To complete your
            registration, please enter the following verification code in the
            application:
          </Text>

          <div style={codeContainer}>
            {verificationCode.split("").map((digit, index) => (
              <span key={index} style={codeDigit}>
                {digit}
              </span>
            ))}
          </div>

          <Text style={paragraph}>
            This code will expire in 15 minutes. If you did not request this
            code, you can safely ignore this email.
          </Text>

          <Hr style={divider} />

          <Text style={supportText}>
            Need help? Contact our support team at{" "}
            <Link href="mailto:sudaiskh31@gmail.com" style={link}>
              sudaiskh31@gmail.com
            </Link>
          </Text>
        </Section>

        <Section style={footer}>
          <Text style={footerText}>
            © {new Date().getFullYear()} suggestIT. All rights reserved.
            <br />
            Attock, Punjab, Pakistan
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "600px",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};

const header = {
  padding: "32px 48px",
  borderBottom: "1px solid #eaeaea",
};

const logo = {
  color: "#2d3436",
  fontSize: "32px",
  fontWeight: "700",
  margin: "0",
  textAlign: "center" as const,
};

const content = {
  padding: "32px 48px",
};

const heading = {
  fontSize: "24px",
  color: "#2d3436",
  margin: "0 0 24px 0",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "24px",
  color: "#525f7f",
  margin: "0 0 24px 0",
};

const codeContainer = {
  display: "flex",
  justifyContent: "center",
  margin: "32px 0",
  gap: "8px",
};

const codeDigit = {
  backgroundColor: "#f4f4f4",
  borderRadius: "4px",
  fontSize: "24px",
  fontWeight: "700",
  padding: "12px 16px",
  minWidth: "40px",
  textAlign: "center" as const,
  color: "#2d3436",
};

const divider = {
  borderColor: "#eaeaea",
  margin: "24px 0",
};

const supportText = {
  ...paragraph,
  textAlign: "center" as const,
};

const link = {
  color: "#5468ff",
  textDecoration: "none",
  fontWeight: "600",
};

const footer = {
  padding: "0 48px",
};

const footerText = {
  fontSize: "12px",
  color: "#8898aa",
  lineHeight: "16px",
  margin: "0",
  textAlign: "center" as const,
};
