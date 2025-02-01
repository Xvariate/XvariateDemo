import Head from "next/head";
import React from "react";

interface PasswordResetEmailTemplateProps {
  firstName: string;
  resetLink: string;
}

export function PasswordResetEmailTemplate({
  firstName,
  resetLink,
}: PasswordResetEmailTemplateProps) {
  return (
    <html>
      <Head>
        <title>Reset Your Password</title>
      </Head>
      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily: "Arial, sans-serif",
          fontSize: "16px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <table
          border={0}
          cellPadding={0}
          cellSpacing={0}
          width="100%"
          style={{ maxWidth: "600px", margin: "0 auto" }}
        >
          <tbody>
            <tr>
              <td style={{ padding: "20px" }}>
                <h1
                  style={{
                    textAlign: "center",
                    color: "#333",
                    margin: "0 0 10px",
                  }}
                >
                  Reset Your Password
                </h1>
                <p
                  style={{
                    textAlign: "center",
                    color: "#555",
                    margin: "0 0 20px",
                  }}
                >
                  Hello {firstName},
                </p>
                <p
                  style={{
                    textAlign: "center",
                    color: "#555",
                    margin: "0 0 20px",
                  }}
                >
                  We received a request to reset your password. You can change
                  it through the link below:
                </p>
                <div style={{ textAlign: "center", margin: "20px 0" }}>
                  <a
                    href={resetLink}
                    style={{
                      display: "inline-block",
                      padding: "12px 24px",
                      backgroundColor: "#007bff",
                      color: "#fff",
                      textDecoration: "none",
                      borderRadius: "4px",
                      fontWeight: 500,
                    }}
                  >
                    Reset Password
                  </a>
                </div>
                <p
                  style={{
                    textAlign: "center",
                    color: "#666",
                    fontSize: "14px",
                    margin: "10px 0",
                  }}
                >
                  If you didn’t request a password reset, you can safely ignore
                  this email.
                </p>
                <p
                  style={{
                    textAlign: "center",
                    color: "#666",
                    fontSize: "14px",
                    margin: "10px 0",
                  }}
                >
                  For assistance, please email{" "}
                  <a
                    href="mailto:support@xvariate.com"
                    style={{ color: "#007bff", textDecoration: "none" }}
                  >
                    support@xvariate.com
                  </a>.
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  );
}
